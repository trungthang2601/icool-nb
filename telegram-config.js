// Telegram Bot Configuration
// Lưu ý: File này chứa thông tin nhạy cảm, không nên commit lên git
// Thêm vào .gitignore: Index/telegram-config.js
//
// ⚠️ QUAN TRỌNG: File này được tạo để deploy lên production
// Nếu bạn muốn bảo mật token, hãy:
// 1. Không commit file này lên GitHub
// 2. Hoặc sử dụng environment variables
// 3. Hoặc tạo file này trực tiếp trên server

/** Chuẩn ES module — app.js import() rồi gán globalThis.TELEGRAM_CONFIG */
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8488858047:AAEtC7KlC2omv6IWkQPoHg4JKlrT-e2VB3A",
  CHAT_ID: "1049752212", // Private chat ID (tài khoản Thang Quang — lấy từ getUpdates)
  GROUP_CHAT_IDS: [
    "-5070808095",
  ],
};

