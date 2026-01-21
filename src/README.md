# src/ Directory

## ⚠️ Lưu ý quan trọng

Thư mục này chứa **example code** và **không được sử dụng** trong ứng dụng hiện tại.

## Cấu trúc

- `components/AccountsTable.svelte` - Example Svelte component (không được sử dụng)
- `stores/accountsStore.js` - Example Svelte store (không được sử dụng)

## Trạng thái project

**Project này là Vanilla JS**, không phải Svelte:
- Code chính: `app.js` (Vanilla JavaScript)
- HTML: `index.html` (không có Svelte components)
- Build tool: Vite (không có Svelte plugin)

## Tại sao có thư mục này?

Thư mục `src/` có thể là:
1. Code example từ migration guide
2. Code thử nghiệm cho tương lai
3. Legacy code chưa được xóa

## Nếu muốn sử dụng Svelte

Nếu bạn muốn migrate sang Svelte trong tương lai:
1. Cài lại Svelte dependencies: `npm install svelte @sveltejs/vite-plugin-svelte`
2. Khôi phục `svelte.config.js`
3. Cập nhật `vite.config.js` để include Svelte plugin
4. Refactor `app.js` thành Svelte components

## Khuyến nghị

Nếu không có kế hoạch sử dụng Svelte, có thể:
- Xóa thư mục `src/` này
- Hoặc giữ lại như documentation/example

