# Hướng dẫn Deploy Service Worker lên GitHub Pages

## Vấn đề
File `service-worker.js` không được tìm thấy trên production (404 error).

## Giải pháp

### 1. Đảm bảo file được commit

Kiểm tra xem file có trong Git:

```bash
git status Index/service-worker.js
```

Nếu file chưa được track, thêm vào:

```bash
git add Index/service-worker.js
git commit -m "Add service-worker.js"
git push
```

### 2. Kiểm tra .gitignore

Đảm bảo `service-worker.js` KHÔNG bị ignore trong `.gitignore`:

```bash
grep -i "service-worker" .gitignore
```

Nếu có, xóa dòng đó hoặc thêm exception:

```
!Index/service-worker.js
```

### 3. Tạo file .nojekyll (quan trọng cho GitHub Pages)

GitHub Pages có thể ignore file không theo quy tắc Jekyll. Tạo file `.nojekyll` ở root của thư mục deploy:

```bash
# Trong thư mục Index/ hoặc root của branch deploy
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll to ensure service-worker.js is served"
git push
```

### 4. Kiểm tra branch deploy

Nếu bạn deploy từ branch `gh-pages` hoặc thư mục `docs/`:

1. Đảm bảo file `service-worker.js` có trong branch đó
2. Đảm bảo file ở root level (không trong subfolder)

### 5. Kiểm tra GitHub Pages settings

1. Vào repository trên GitHub
2. Settings → Pages
3. Đảm bảo Source branch/folder đúng
4. Kiểm tra xem file có trong thư mục đó không

### 6. Kiểm tra sau khi deploy

Sau khi push code, kiểm tra:

```bash
# Chờ vài phút để GitHub Pages update
curl -I https://post.iticool.com/service-worker.js
```

Nếu thấy `200 OK` → File đã được deploy thành công.

## Giải pháp tạm thời: Disable Service Worker

Nếu không cần Service Worker ngay, có thể tạm thời disable:

1. Mở `Index/app.js`
2. Comment out hoặc xóa phần register Service Worker
3. Unregister các Service Worker cũ trong browser DevTools

## Troubleshooting

### Lỗi vẫn còn sau khi deploy

1. **Clear browser cache:**
   - DevTools → Application → Clear Storage → Clear site data

2. **Unregister Service Worker cũ:**
   - DevTools → Application → Service Workers → Unregister

3. **Hard refresh:**
   - Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)

### File vẫn 404

1. Kiểm tra URL có đúng không:
   - Đúng: `https://post.iticool.com/service-worker.js`
   - Sai: `https://post.iticool.com/Index/service-worker.js`

2. Kiểm tra case sensitivity:
   - Linux servers phân biệt hoa/thường
   - Đảm bảo tên file: `service-worker.js` (chữ thường)

3. Kiểm tra permissions:
   - File phải có quyền read
   - Kiểm tra trên GitHub: Settings → Pages → View your site

## Xác nhận deploy thành công

Sau khi deploy, mở console và kiểm tra:

- ✅ Thấy: `✅ Service Worker đã được đăng ký`
- ❌ Thấy: `⚠️ Service Worker không tìm thấy...` → File chưa được deploy

