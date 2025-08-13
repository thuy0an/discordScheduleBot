require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Lấy quotes từ file index.js
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

function getVietnamTime() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000);
}

function formatTime(date) {
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}

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
    .setTitle('🌤️ Đã đến giờ nghỉ trưa!')
    .setDescription(`Giữa ngày rồi, hãy dành chút thời gian để thư giãn và nạp lại năng lượng 💆‍♂️🍱

**Gợi ý:** Ăn trưa đầy đủ, uống nước và nghỉ ngơi hợp lý.
**Lưu ý:** Một giấc ngủ trưa ngắn giúp tăng hiệu suất buổi chiều đấy! 😴

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

> Giờ VN ${timeString} - Hãy uống nước rồi bắt đầu nhé`);
}

client.once('ready', async () => {
  console.log(`🤖 Bot đã sẵn sàng với tên: ${client.user.tag}`);
console.log("Giờ hiện tại UTC:", new Date().toISOString());
console.log("Giờ hiện tại VN:", getVietnamTime().toISOString());

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) {
    console.error("❌ Không tìm thấy kênh");
    process.exit(1);
    return;
  }

  const vietnamTime = getVietnamTime();
  const hour = vietnamTime.getHours();
console.log("Giờ:", hour);
try {
  if (hour === 6 || hour === 7 || hour === 8) {
    await channel.send({ embeds: [createMorningEmbed()] });
  }
  } if (hour === 11 || hour === 12 || hour === 13) {
    await channel.send({ embeds: [createNoonEmbed()] }); // ✅ thêm logic buổi trưa
  } else if (hour === 0 || hour === 23 || hour === 1) {
    await channel.send({ embeds: [createNightEmbed()] });
  } else {
    console.log("⏰ Không phải giờ gửi tin nhắn. Giờ hiện tại:", hour);
  }
} catch (error) {
  console.error("Error sending message:", error);
} finally {
  // Đảm bảo chương trình sẽ tắt dù gửi thành công hay lỗi
  process.exit(0);
}


  // Kết thúc chương trình sau khi gửi tin nhắn
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
