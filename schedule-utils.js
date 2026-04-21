const { EmbedBuilder } = require('discord.js');

const VTN_TIME_ZONE = 'Asia/Ho_Chi_Minh';

const WEEKDAY_LABELS = {
  Sunday: 'Chủ Nhật',
  Monday: 'Thứ Hai',
  Tuesday: 'Thứ Ba',
  Wednesday: 'Thứ Tư',
  Thursday: 'Thứ Năm',
  Friday: 'Thứ Sáu',
  Saturday: 'Thứ Bảy'
};

const quotes = [
  'Hãy bắt đầu từ những việc nhỏ nhất, để tạo nên điều phi thường.',
  'Mỗi ngày là một cơ hội mới để trở nên tốt hơn ngày hôm qua.',
  'Đừng so sánh bản thân với người khác, hãy là phiên bản tốt nhất của chính mình.',
  'Thành công không phải là đích đến, mà là cả một hành trình.',
  'Hôm nay khó khăn, ngày mai sẽ tốt đẹp hơn.',
  'Đừng để nỗi sợ hãi ngăn cản bạn trở thành phiên bản tốt nhất của chính mình.',
  'Hãy kiên nhẫn với bản thân, mọi thứ cần có thời gian.',
  'Giấc mơ không tự thành hiện thực, hãy bắt tay vào hành động.',
  'Mỗi bước đi nhỏ đều đang đưa bạn đến gần hơn với mục tiêu.',
  'Thất bại không phải là ngã, mà là cơ hội để đứng dậy mạnh mẽ hơn.',
  'Hãy là ánh sáng tích cực trong cuộc sống của người khác.',
  'Đừng từ bỏ ngay trước khi phép màu xảy ra.',
  'Tin vào bản thân là bước đầu tiên để thành công.',
  'Hôm nay là món quà, đó là lý do tại sao nó được gọi là present.',
  'Mỗi ngày đều là cơ hội để viết nên câu chuyện mới của chính mình.'
];

const specialDays = [
  {
    month: 4,
    day: 26,
    year: 2026,
    title: '🌸 Ngày giỗ Quốc tổ Hùng Vương',
    description: 'Hôm nay là ngày giỗ Quốc tổ Hùng Vương (Mùng 10/3 ÂL). Cùng nhớ về cội nguồn và gìn giữ tinh thần đoàn kết nhé.',
    color: '#8B4513'
  },
  {
    month: 4,
    day: 30,
    year: 2026,
    title: '🎉 Ngày Giải phóng miền Nam, thống nhất đất nước',
    description: 'Kỷ niệm 51 năm Ngày Giải phóng miền Nam, thống nhất đất nước (30/4/1975 - 30/4/2026). Chúc bạn một ngày nhiều tự hào và bình an.',
    color: '#DC143C'
  },
  {
    month: 5,
    day: 1,
    year: 2026,
    title: '🛠️ Ngày Quốc tế Lao động',
    description: 'Kỷ niệm 140 năm Ngày Quốc tế Lao động (01/5/1886 - 01/5/2026). Chúc bạn có một ngày nghỉ thật trọn vẹn và vui vẻ.',
    color: '#1E90FF'
  },
  {
    month: 5,
    day: 19,
    year: 2026,
    title: '🌺 Ngày sinh Chủ tịch Hồ Chí Minh',
    description: 'Kỷ niệm 136 năm Ngày sinh Chủ tịch Hồ Chí Minh (19/5/1890 - 19/5/2026). Chúc bạn một ngày nhiều cảm hứng và ý nghĩa.',
    color: '#228B22'
  },
  {
    month: 6,
    day: 1,
    title: '🎈 Ngày Quốc tế Thiếu nhi',
    description: 'Chúc các bạn nhỏ luôn hồn nhiên, vui tươi và được yêu thương thật nhiều trong ngày đặc biệt này.',
    color: '#FF69B4'
  },
  {
    month: 3,
    day: 8,
    title: '💐 Ngày Quốc tế Phụ nữ',
    description: 'Chúc một nửa thế giới luôn xinh đẹp, mạnh mẽ và hạnh phúc mỗi ngày.',
    color: '#FF8C00'
  },
  {
    month: 9,
    day: 2,
    year: 2025,
    title: '🇻🇳 Ngày Quốc khánh',
    description: 'Kỷ niệm Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam (02/9/1945 - 02/9/2025). Chúc bạn một ngày thật nhiều niềm vui và tự hào.',
    color: '#E53935'
  },
  {
    month: 10,
    day: 20,
    year: 2025,
    title: '👩 Ngày Phụ nữ Việt Nam',
    description: 'Chúc các chị em luôn rạng rỡ, hạnh phúc và được yêu thương thật nhiều trong ngày 20/10.',
    color: '#D81B60'
  },
  {
    month: 11,
    day: 20,
    year: 2025,
    title: '📚 Ngày Nhà giáo Việt Nam',
    description: 'Kỷ niệm 43 năm Ngày Nhà giáo Việt Nam (20/11/1982 - 20/11/2025). Xin gửi lời tri ân đến các thầy cô đã tận tâm gieo chữ.',
    color: '#6A1B9A'
  }
];

function getVietnamDateParts(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: VTN_TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const values = {};
  for (const part of formatter.formatToParts(referenceDate)) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }

  return {
    weekday: values.weekday,
    weekdayLabel: WEEKDAY_LABELS[values.weekday] || values.weekday,
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    dateString: `${values.year}-${values.month}-${values.day}`,
    timeString: `${values.hour}:${values.minute}:${values.second}`
  };
}

function formatVietnamDateTime(referenceDate = new Date()) {
  const parts = getVietnamDateParts(referenceDate);
  return `${parts.dateString} ${parts.timeString}`;
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getSpecialDay(referenceDate = new Date()) {
  const parts = getVietnamDateParts(referenceDate);
  return specialDays.find((specialDay) => {
    return (
      specialDay.month === parts.month &&
      specialDay.day === parts.day &&
      (specialDay.year == null || specialDay.year === parts.year)
    );
  });
}

function createMorningEmbed(referenceDate = new Date()) {
  const parts = getVietnamDateParts(referenceDate);
  const randomQuote = getRandomQuote();

  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle(`🌞 Chào buổi sáng ${parts.weekdayLabel}!`)
    .setDescription(`Chúc bạn một ngày mới rực rỡ, đầy năng lượng tích cực và những điều bất ngờ tuyệt vời! 🌈✨

**Gợi ý** Dành thời gian để học một ngôn ngữ sẽ giúp bạn tốt hơn 🎵
**Ghi nhớ** Để ly nước bên cạnh bạn và uống nước thường xuyên hơn 💧
**Quote hôm nay:**
✨ *${randomQuote}*

> Giờ VN ${formatVietnamDateTime(referenceDate)} - Hãy uống nước rồi bắt đầu nhé`);
}

function createNoonEmbed(referenceDate = new Date()) {
  return new EmbedBuilder()
    .setColor('#00CED1')
    .setTitle('🌤️ Giữa trưa rồi!')
    .setDescription(`Đừng quên nghỉ ngơi một chút để nạp lại năng lượng bạn nhé! 🥗💤

**Gợi ý**: Đứng dậy vươn vai hoặc đi dạo vài phút sẽ giúp bạn tỉnh táo hơn.
**Nhắc nhẹ**: Hãy ăn trưa đúng giờ để giữ sức khoẻ và duy trì hiệu suất làm việc 💪

> Giờ VN ${formatVietnamDateTime(referenceDate)} • Chúc bạn một buổi chiều tràn đầy năng lượng!`);
}

function createNightEmbed(referenceDate = new Date()) {
  return new EmbedBuilder()
    .setColor('#000080')
    .setTitle('🌙 Chúc ngủ ngon cả nhà!')
    .setDescription(`Cảm ơn bạn vì một ngày làm việc chăm chỉ. Bạn đang tiến bộ từng ngày 💙

**Nghi thức nhỏ trước khi ngủ:** Hãy nhớ tắt điện thoại hoặc máy tính trước khi đi ngủ để có giấc ngủ tốt hơn. Để điện thoại xa khỏi tầm tay 📱➡️📦
**Lời thì thầm:** Buông xuống để sạc lại.

> Giờ VN ${formatVietnamDateTime(referenceDate)} • Hẹn gặp lại vào sáng mai`);
}

function createSpecialDayEmbed(referenceDate = new Date()) {
  const specialDay = getSpecialDay(referenceDate);

  if (!specialDay) {
    return null;
  }

  return new EmbedBuilder()
    .setColor(specialDay.color || '#FFCC00')
    .setTitle(specialDay.title)
    .setDescription(`${specialDay.description}

> Giờ VN ${formatVietnamDateTime(referenceDate)} • Chúc bạn một ngày đặc biệt thật trọn vẹn!`);
}

function isSpecialDay(referenceDate = new Date()) {
  return Boolean(getSpecialDay(referenceDate));
}

module.exports = {
  VTN_TIME_ZONE,
  specialDays,
  getVietnamDateParts,
  formatVietnamDateTime,
  getSpecialDay,
  isSpecialDay,
  createMorningEmbed,
  createNoonEmbed,
  createNightEmbed,
  createSpecialDayEmbed
};