require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const {
  getVietnamDateParts,
  createMorningEmbed,
  createNoonEmbed,
  createNightEmbed,
  createSpecialDayEmbed,
  isSpecialDay
} = require('./schedule-utils');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`🤖 Bot đã sẵn sàng với tên: ${client.user.tag}`);
  console.log("Giờ hiện tại UTC:", new Date().toISOString());
  console.log("Giờ hiện tại VN:", getVietnamDateParts());

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) {
    console.error("❌ Không tìm thấy kênh");
    process.exit(1);
    return;
  }

  const vietnamTime = getVietnamDateParts();
  const hour = vietnamTime.hour;
  console.log("Giờ VN:", hour);

  try {
    if (hour === 7) {
      await channel.send({ embeds: [createMorningEmbed()] });
    } else if (hour === 12) {
      await channel.send({ embeds: [createNoonEmbed()] });
    } else if (hour === 0) {
      await channel.send({ embeds: [createNightEmbed()] });
    } else if (hour === 8 && isSpecialDay()) {
      await channel.send({ embeds: [createSpecialDayEmbed()] });
    } else {
      console.log("⏰ Không phải giờ gửi tin nhắn. Giờ hiện tại:", hour);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi tin nhắn:", error);
  } finally {
    process.exit(0); // Đảm bảo chương trình sẽ thoát sau khi xử lý xong
  }
});




client.login(process.env.DISCORD_TOKEN);
