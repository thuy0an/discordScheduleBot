require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const {
  VTN_TIME_ZONE,
  createMorningEmbed,
  createNoonEmbed,
  createNightEmbed,
  createSpecialDayEmbed
} = require('./schedule-utils');

const N8N_WEBHOOK_URL = (process.env.N8N_WEBHOOK_URL || '').trim();
const AI_LISTEN_CHANNEL_IDS = (process.env.AI_LISTEN_CHANNEL_IDS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const AI_REPLY_IN_THREAD = (process.env.AI_REPLY_IN_THREAD || 'true').toLowerCase() !== 'false';
const N8N_TIMEOUT_MS = Number(process.env.N8N_TIMEOUT_MS || 15000);

// ==========================================
// 🤖 Khởi tạo Discord Client
// ==========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

async function safeSend(channel, embed, label) {
  if (!embed) {
    return;
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`❌ Không thể gửi tin nhắn ${label || 'đã lên lịch'}:`, error);
  }
}

function normalizeReplyText(responseBody) {
  if (typeof responseBody === 'string') {
    return responseBody.trim();
  }

  if (!responseBody || typeof responseBody !== 'object') {
    return '';
  }

  const preferredKeys = ['reply', 'response', 'message', 'output', 'text', 'answer'];
  for (const key of preferredKeys) {
    if (typeof responseBody[key] === 'string' && responseBody[key].trim()) {
      return responseBody[key].trim();
    }
  }

  return '';
}

async function requestN8nReply(payload) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Webhook trả mã ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return normalizeReplyText(data);
    }

    const text = await response.text();
    return normalizeReplyText(text);
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function replyFromN8n(message, content) {
  const output = content.slice(0, 1900);

  if (!AI_REPLY_IN_THREAD) {
    await message.reply(output);
    return;
  }

  try {
    if (message.hasThread && message.thread) {
      await message.thread.send(output);
      return;
    }

    if (message.channel && message.channel.isThread && message.channel.isThread()) {
      await message.reply(output);
      return;
    }

    const thread = await message.startThread({
      name: `AI ${message.author.username}`.slice(0, 100),
      autoArchiveDuration: 60
    });
    await thread.send(output);
  } catch (error) {
    console.warn('⚠️ Không thể gửi theo thread, chuyển sang reply trực tiếp:', error.message);
    await message.reply(output);
  }
}

client.on('messageCreate', async (message) => {
  if (!N8N_WEBHOOK_URL) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  if (AI_LISTEN_CHANNEL_IDS.length > 0 && !AI_LISTEN_CHANNEL_IDS.includes(message.channelId)) {
    return;
  }

  if (!message.content || !message.content.trim()) {
    return;
  }

  const payload = {
    channel_id: message.channelId,
    chat_message: message.content,
    timestamp: message.createdAt.toISOString(),
    message_id: message.id,
    user_id: message.author.id,
    username: message.author.username
  };

  try {
    const n8nReply = await requestN8nReply(payload);

    if (!n8nReply) {
      console.log('ℹ️ Webhook n8n đã nhận nhưng không trả về nội dung phản hồi.');
      return;
    }

    await replyFromN8n(message, n8nReply);
  } catch (error) {
    console.error('❌ Lỗi khi gọi n8n webhook:', error.message || error);
  }
});

// ==========================================
// 🤖 Khởi động bot và lên lịch gửi tin nhắn
// ==========================================
client.once('ready', () => {
  console.log(`🤖 Bot đã sẵn sàng với tên: ${client.user.tag}`);
  if (N8N_WEBHOOK_URL) {
    console.log(`🧠 n8n bridge đã bật. Kênh lắng nghe: ${AI_LISTEN_CHANNEL_IDS.length ? AI_LISTEN_CHANNEL_IDS.join(', ') : 'tất cả kênh bot có quyền đọc'}`);
  } else {
    console.log('🧠 n8n bridge đang tắt (chưa cấu hình N8N_WEBHOOK_URL).');
  }

  if (typeof initializeGeminiFeatures === 'function') {
    initializeGeminiFeatures(client);
  }

  client.channels.fetch(process.env.CHANNEL_ID)
    .then((channel) => {
      if (!channel || !channel.isTextBased()) {
        throw new Error('Không tìm thấy kênh văn bản hợp lệ');
      }

      cron.schedule('0 7 * * *', async () => {
        await safeSend(channel, createMorningEmbed(), 'buổi sáng');
      }, { timezone: VTN_TIME_ZONE });

      cron.schedule('0 12 * * *', async () => {
        await safeSend(channel, createNoonEmbed(), 'buổi trưa');
      }, { timezone: VTN_TIME_ZONE });

      cron.schedule('0 0 * * *', async () => {
        await safeSend(channel, createNightEmbed(), 'buổi tối');
      }, { timezone: VTN_TIME_ZONE });

      cron.schedule('0 8 * * *', async () => {
        await safeSend(channel, createSpecialDayEmbed(), 'ngày đặc biệt');
      }, { timezone: VTN_TIME_ZONE });

      console.log('⏰ Đã đăng ký lịch 7:00, 12:00, 0:00 và 8:00 (ngày đặc biệt) theo giờ Việt Nam');
    })
    .catch((error) => {
      console.error('❌ Không thể khởi tạo lịch gửi tin nhắn:', error);
    });
});


client.login(process.env.DISCORD_TOKEN);

