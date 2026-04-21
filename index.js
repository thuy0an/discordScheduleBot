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

// ==========================================
// 🤖 Khởi động bot và lên lịch gửi tin nhắn
// ==========================================
client.once('ready', () => {
  console.log(`🤖 Bot đã sẵn sàng với tên: ${client.user.tag}`);

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

