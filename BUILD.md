# Hướng dẫn Build với Vite

Project này đã được nâng cấp để sử dụng Vite làm build tool, giúp tối ưu hóa hiệu suất và kích thước file.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

## Development

Chạy development server:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000` và tự động mở trình duyệt.

## Build cho Production

Build project:
```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`.

## Preview Build

Xem preview của build production:
```bash
npm run preview
```

## Lợi ích của Vite

### 1. **Tailwind CSS Purge**
- Tự động loại bỏ các class Tailwind không sử dụng
- Giảm kích thước CSS từ vài MB xuống chỉ còn vài chục KB
- Cải thiện đáng kể thời gian tải trang

### 2. **JavaScript Bundling & Minification**
- Bundle và minify tất cả JavaScript files
- Code splitting tự động cho các thư viện lớn (Chart.js, xlsx, etc.)
- Giảm số lượng HTTP requests

### 3. **Fast HMR (Hot Module Replacement)**
- Thay đổi code được phản ánh ngay lập tức trong development
- Không cần reload toàn bộ trang

### 4. **Tree Shaking**
- Tự động loại bỏ code không sử dụng
- Giảm kích thước bundle cuối cùng

## Cấu trúc Files

- `main.js` - Entry point, import tất cả dependencies và app.js
- `vite.config.js` - Cấu hình Vite
- `tailwind.config.js` - Cấu hình Tailwind CSS
- `postcss.config.js` - Cấu hình PostCSS
- `style.css` - CSS chính với Tailwind directives

## Lưu ý

- Font Awesome và Google Fonts vẫn sử dụng CDN (để đơn giản hóa)
- Firebase SDK vẫn được load từ CDN trong `app.js` (không thay đổi)
- Các custom CSS trong `style.css` vẫn được giữ nguyên

## Deployment

Sau khi build, deploy thư mục `dist/` lên server của bạn.

