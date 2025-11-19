# Cấu trúc Project

## 🎯 Loại Project

**Vanilla JavaScript** - Không sử dụng framework

- ✅ **Vanilla JS**: Code chính trong `app.js`
- ✅ **Vite**: Build tool (không có Svelte plugin)
- ✅ **Tailwind CSS**: Styling
- ✅ **Firebase**: Backend services

## 📁 Cấu trúc thư mục

```
Index/
├── app.js                 # Main application code (Vanilla JS)
├── index.html             # Main HTML file
├── style.css             # Custom styles
├── vite.config.js        # Vite config (NO Svelte)
├── package.json          # Dependencies (NO Svelte)
│
├── js/                   # New modular structure
│   ├── config.js         # Configuration constants
│   ├── services/        # Business logic & API calls
│   ├── ui/              # UI/DOM manipulation
│   └── utils/           # Utilities (DOM optimizer, helpers)
│
└── src/                  # ⚠️ EXAMPLE CODE ONLY (not used)
    ├── components/       # Svelte examples (not used)
    └── stores/          # Svelte examples (not used)
```

## ⚠️ Lưu ý quan trọng

### Thư mục `src/` - KHÔNG ĐƯỢC SỬ DỤNG

Thư mục `src/` chứa **example code** và **không được import/sử dụng** trong ứng dụng:
- `src/components/AccountsTable.svelte` - Example component (không dùng)
- `src/stores/accountsStore.js` - Example store (không dùng)

Xem `src/README.md` để biết thêm chi tiết.

### Cấu hình đã được làm sạch

- ✅ Đã xóa `svelte.config.js`
- ✅ Đã loại bỏ Svelte plugin khỏi `vite.config.js`
- ✅ Đã loại bỏ Svelte dependencies khỏi `package.json`

## 🚀 Cách chạy project

```bash
# Install dependencies (không có Svelte)
npm install

# Development
npm run dev

# Build
npm run build
```

## 📦 Dependencies chính

### Production
- `chart.js` - Charts
- `xlsx` - Excel export
- `browser-image-compression` - Image compression

### Development
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `postcss`, `autoprefixer` - CSS processing

**KHÔNG có Svelte dependencies**

## 🔄 Migration Path (nếu cần)

Nếu muốn migrate sang Svelte trong tương lai:
1. Cài lại: `npm install svelte @sveltejs/vite-plugin-svelte`
2. Tạo `svelte.config.js`
3. Cập nhật `vite.config.js` để include Svelte plugin
4. Refactor `app.js` thành Svelte components

Hiện tại: **KHÔNG CẦN** - Project đang chạy tốt với Vanilla JS.

