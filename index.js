require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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

// ==========================================
// 📝 Dữ liệu quotes cho tin nhắn buổi sáng
// ==========================================
const quotes = [
  "Hãy bắt đầu từ những việc nhỏ nhất, để tạo nên điều phi thường.",
  "Mỗi ngày là một cơ hội mới để trở nên tốt hơn ngày hôm qua.",
  "Đừng so sánh bản thân với người khác, hãy là phiên bản tốt nhất của chính mình.",
  "Thành công không phải là đích đến, mà là cả một hành trình.",
  "Hôm nay khó khăn, ngày mai sẽ tốt đẹp hơn.",
  "Đừng để nỗi sợ hãi ngăn cản bạn trở thành phiên bản tốt nhất của chính mình.",
  "Hãy kiên nhẫn với bản thân, mọi thứ cần có thời gian.",
  "Giấc mơ không tự thành hiện thực, hãy bắt tay vào hành động.",
  "Mỗi bước đi nhỏ đều đang đưa bạn đến gần hơn với mục tiêu.",
  "Thất bại không phải là ngã, mà là cơ hội để đứng dậy mạnh mẽ hơn.",
  "Hãy là ánh sáng tích cực trong cuộc sống của người khác.",
  "Đừng từ bỏ ngay trước khi phép màu xảy ra.",
  "Tin vào bản thân là bước đầu tiên để thành công.",
  "Hôm nay là món quà, đó là lý do tại sao nó được gọi là present.",
  "Mỗi ngày đều là cơ hội để viết nên câu chuyện mới của chính mình."
];

// ==========================================
// 🕐 Tiện ích xử lý thời gian
// ==========================================
function getVietnamTime() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000);
}

function formatTime(date) {
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}

function getDelayToNextSend(hour, minute) {
  const now = new Date();
  const nowUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vietnamOffset = 7 * 60 * 60000;
  const vietnamNow = new Date(nowUTC + vietnamOffset);

  let sendTimeVN = new Date(vietnamNow);
  sendTimeVN.setHours(hour, minute, 0, 0);
  if (vietnamNow > sendTimeVN) {
    sendTimeVN.setDate(sendTimeVN.getDate() + 1);
  }

  const sendTimeUTC = sendTimeVN.getTime() - vietnamOffset;
  return sendTimeUTC - nowUTC;
}

// ==========================================
// 💌 Tạo nội dung tin nhắn
// ==========================================
function createNightEmbed() {
  const vietnamTime = getVietnamTime();
  const timeString = formatTime(vietnamTime);

  return new EmbedBuilder()
    .setColor('#000080')
    .setTitle('🌙 Chúc ngủ ngon cả nhà!')
    .setDescription(`Cảm ơn bạn vì một ngày làm việc chăm chỉ. Bạn đang tiến bộ từng ngày 💙

**Nghi thức nhỏ trước khi ngủ:** Hãy nhớ tắt điện thoại hoặc máy tính trước khi đi ngủ để có giấc ngủ tốt hơn. Để điện thoại xa khỏi tầm tay 📱➡️📦
**Lời thì thầm:** Buông xuống để sạc lại.

> Giờ VN ${timeString} • Hẹn gặp lại vào sáng mai`);
}

function createNoonEmbed() {
  const vietnamTime = getVietnamTime();
  const timeString = formatTime(vietnamTime);

  return new EmbedBuilder()
    .setColor('#00CED1')
    .setTitle('🌤️ Giữa trưa rồi!')
    .setDescription(`Đừng quên nghỉ ngơi một chút để nạp lại năng lượng bạn nhé! 🥗💤

**Gợi ý**: Đứng dậy vươn vai hoặc đi dạo vài phút sẽ giúp bạn tỉnh táo hơn.
**Nhắc nhẹ**: Hãy ăn trưa đúng giờ để giữ sức khoẻ và duy trì hiệu suất làm việc 💪

> Giờ VN ${timeString} • Chúc bạn một buổi chiều tràn đầy năng lượng!`);
}


function createMorningEmbed() {
  const vietnamTime = getVietnamTime();
  const timeString = formatTime(vietnamTime);
  
  const weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const currentDay = weekDays[vietnamTime.getDay()];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle(`🌞 Chào buổi sáng ${currentDay}!`)
    .setDescription(`Chúc bạn một ngày mới rực rỡ, đầy năng lượng tích cực và những điều bất ngờ tuyệt vời! 🌈✨

**Gợi ý** Dành thời gian để học một ngôn ngữ sẽ giúp bạn tốt hơn 🎵 
**Ghi nhớ** Để ly nước bên cạnh bạn và uống nước thường xuyên hơn 💧
**Quote hôm nay:** 
✨ *${randomQuote}*

> Giờ VN ${timeString} - Hãy uống nước rồi bắt đầu nhé`)
}

// ==========================================
// 🤖 Khởi động bot và lên lịch gửi tin nhắn
// ==========================================
client.once('ready', () => {
  console.log(`🤖 Bot đã sẵn sàng với tên: ${client.user.tag}`);

  // Khởi tạo tính năng Gemini AI
  initializeGeminiFeatures(client);

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) {
    console.error("❌ Không tìm thấy kênh");
    return;
  }

  // Lên lịch gửi tin nhắn chào buổi sáng (7:00)
  const morningDelay = getDelayToNextSend(7, 0);
  setTimeout(() => {
    channel.send({ embeds: [createMorningEmbed()] });
    setInterval(() => {
      channel.send({ embeds: [createMorningEmbed()] });
    }, 24 * 60 * 60 * 1000);
  }, morningDelay);

  // Lên lịch gửi tin nhắn chúc ngủ ngon (0:00)
  const nightDelay = getDelayToNextSend(0, 0);
  setTimeout(() => {
    channel.send({ embeds: [createNightEmbed()] });
    setInterval(() => {
      channel.send({ embeds: [createNightEmbed()] });
    }, 24 * 60 * 60 * 1000);
  }, nightDelay);
  // Lên lịch gửi tin nhắn trưa (12:00)
  const noonDelay = getDelayToNextSend(12, 0);
  setTimeout(() => {
    channel.send({ embeds: [createNoonEmbed()] });
    setInterval(() => {
      channel.send({ embeds: [createNoonEmbed()] });
    }, 24 * 60 * 60 * 1000);
  }, noonDelay);
});


client.login(process.env.DISCORD_TOKEN);

