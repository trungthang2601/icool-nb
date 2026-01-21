// Telegram Bot Configuration
// Lưu ý: File này chứa thông tin nhạy cảm, không nên commit lên git
// Thêm vào .gitignore: Index/telegram-config.js
//
// ⚠️ QUAN TRỌNG: File này được tạo để deploy lên production
// Nếu bạn muốn bảo mật token, hãy:
// 1. Không commit file này lên GitHub
// 2. Hoặc sử dụng environment variables
// 3. Hoặc tạo file này trực tiếp trên server

const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8488858047:AAEtC7KlC2omv6IWkQPoHg4JKlrT-e2VB3A",
  CHAT_ID: "1049752212", // Private chat ID (để nhận thông báo cá nhân)
  // Danh sách Group Chat IDs để gửi thông báo vào group
  GROUP_CHAT_IDS: [
    "-5070808095" // Group Chat ID của group "IT_ICOOI"
    // Có thể thêm nhiều group khác:
    // "-1001234567890", // Group Chat ID của group khác
  ]
};

// Export để sử dụng trong app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TELEGRAM_CONFIG;
}

