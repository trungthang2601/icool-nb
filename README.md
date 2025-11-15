# **HỆ THỐNG VẬN HÀNH THÔNG MINH - HƯỚNG DẪN SỬ DỤNG**

Đây là một ứng dụng web toàn diện được thiết kế để quản lý vận hành, nhân sự và xử lý sự cố trong môi trường doanh nghiệp một cách hiệu quả và an toàn.

---

## **MỤC LỤC**

1. [Đăng nhập và Bảo mật](#đăng-nhập-và-bảo-mật)
2. [Phân quyền theo Vai trò](#phân-quyền-theo-vai-trò)
3. [Dashboard - Tổng quan](#dashboard---tổng-quan)
4. [Điểm Danh - Chấm công](#điểm-danh---chấm-công)
5. [Báo Lỗi - Báo cáo Sự cố](#báo-lỗi---báo-cáo-sự-cố)
6. [Lịch Sử Báo Cáo](#lịch-sử-báo-cáo)
7. [Nhiệm Vụ Của Tôi](#nhiệm-vụ-của-tôi)
8. [Quản Lý Tài Khoản](#quản-lý-tài-khoản)
9. [Quản Lý Ca Làm Việc](#quản-lý-ca-làm-việc)
10. [Bảng Chấm Công](#bảng-chấm-công)
11. [Nhật Ký Hoạt Động](#nhật-ký-hoạt-động)
12. [Hồ sơ của tôi](#hồ-sơ-của-tôi)
13. [Các Tính năng Nâng cao](#các-tính-năng-nâng-cao)

---

## **ĐĂNG NHẬP VÀ BẢO MẬT**

### **1. Đăng nhập**

- Truy cập trang web và nhập **Email** và **Mật khẩu** của bạn
- Nhấn nút **"Đăng nhập"** hoặc nhấn phím **Enter**
- Hệ thống sẽ tự động chuyển đến trang chủ sau khi đăng nhập thành công

### **2. Quên mật khẩu**

- Nhấn vào liên kết **"Quên mật khẩu?"** trên màn hình đăng nhập
- Nhập email đã đăng ký của bạn
- Kiểm tra hộp thư email và làm theo hướng dẫn trong email để đặt lại mật khẩu
- **Lưu ý:** Sau khi đặt lại mật khẩu, bạn sẽ phải đổi mật khẩu ngay trong lần đăng nhập đầu tiên

### **3. Bắt buộc đổi mật khẩu**

- Tất cả tài khoản mới tạo hoặc vừa sử dụng "Quên mật khẩu" sẽ phải đổi mật khẩu ngay
- Màn hình đổi mật khẩu sẽ tự động hiển thị sau khi đăng nhập
- Nhập mật khẩu mới (tối thiểu 6 ký tự) và xác nhận lại
- Sau khi đổi mật khẩu thành công, bạn mới có thể sử dụng các tính năng khác

### **4. Đăng xuất**

- Nhấn vào **icon người dùng** ở góc trên bên phải
- Chọn **"Thoát"** từ menu dropdown

---

## **PHÂN QUYỀN THEO VAI TRÒ**

Hệ thống có **4 cấp độ người dùng** với các quyền hạn được phân cấp rõ ràng:

### **1. Admin (Quản trị viên)**

- ✅ Toàn quyền truy cập tất cả tính năng
- ✅ Quản lý tất cả tài khoản (tạo, chỉnh sửa, vô hiệu hóa)
- ✅ Xem toàn bộ dữ liệu và báo cáo
- ✅ Quản lý ca làm việc
- ✅ Xem nhật ký hoạt động của tất cả người dùng
- ✅ Giao việc cho bất kỳ nhân viên nào

### **2. Manager (Quản lý)**

- ✅ Quản lý nhân viên trong các chi nhánh được phân công (`managedBranches`)
- ✅ Xem báo cáo chấm công của nhân viên trong phạm vi quản lý
- ✅ Giao việc cho nhân viên trong các chi nhánh được quản lý
- ✅ Xem nhật ký hoạt động
- ✅ Xem Dashboard và báo cáo
- ❌ Không thể quản lý tài khoản Admin hoặc Manager khác
- ❌ Không thể quản lý ca làm việc

### **3. Nhân viên**

- ✅ Chấm công (check-in/check-out)
- ✅ Báo cáo sự cố
- ✅ Xem nhiệm vụ được giao
- ✅ Xem lịch sử báo cáo
- ✅ Xem Dashboard cá nhân
- ❌ Không thể quản lý tài khoản
- ❌ Không thể giao việc cho người khác
- ❌ Không thể xem nhật ký hoạt động

### **4. Chi nhánh (Reporter-Only)**

- ✅ Báo cáo sự cố
- ✅ Xem lịch sử báo cáo
- ❌ Không thể được gán xử lý sự cố
- ❌ Không thể chấm công
- ❌ Không có quyền quản lý

---

## **DASHBOARD - TỔNG QUAN**

Dashboard cung cấp cái nhìn tổng quan về tình hình hoạt động của hệ thống.

### **1. Thẻ Thống kê Nhanh**

- **Lỗi Phát Sinh Hôm Nay:** Số lượng sự cố được báo cáo trong ngày
- **Lỗi Trong Tuần Này:** Tổng số sự cố trong tuần hiện tại
- **Lỗi Trong Tháng Này:** Tổng số sự cố trong tháng hiện tại

### **2. Bộ lọc Nâng cao**

- **Chi nhánh:** Lọc theo chi nhánh cụ thể
- **Loại sự cố:** Lọc theo loại (Kỹ thuật, Vận hành, Hệ thống, Con người, Khác)
- **Nhân viên:** Lọc theo nhân viên báo cáo hoặc được giao xử lý
- **Từ ngày / Đến ngày:** Lọc theo khoảng thời gian
- **Lọc nhanh:**
  - **Hôm nay:** Tự động chọn ngày hôm nay
  - **7 ngày qua:** Tự động chọn 7 ngày gần nhất
  - **30 ngày qua:** Tự động chọn 30 ngày gần nhất
- Nhấn **"Lọc"** để áp dụng hoặc **"Reset"** để xóa bộ lọc

### **3. Phân Tích So Sánh**

- So sánh số lượng sự cố giữa:
  - Tuần này vs Tuần trước
  - Tháng này vs Tháng trước
  - Năm này vs Năm trước

### **4. Cảnh báo Tự động**

- **Cảnh báo Backlog:** Hiển thị khi có quá nhiều sự cố chưa được xử lý
- **Cảnh báo Daily Spike:** Cảnh báo khi số lượng sự cố trong ngày tăng đột biến

### **5. Các Tab Phân tích**

#### **Tab "Tổng quan"**
- Thống kê nhanh
- Phân tích so sánh
- Cảnh báo hệ thống

#### **Tab "Phân tích Lỗi"**
- **Biểu đồ tròn:** Phân loại sự cố theo loại
- **Biểu đồ thanh:** Top 5 nhân viên xử lý nhiều nhất
- **Biểu đồ trạng thái theo chi nhánh:** Tình trạng xử lý sự cố theo từng chi nhánh
- **Biểu đồ thời gian xử lý:** Thời gian trung bình xử lý sự cố theo chi nhánh

**Tính năng Drill-down:**
- Click vào bất kỳ phần nào của biểu đồ để xem danh sách chi tiết các sự cố liên quan
- Modal sẽ hiển thị danh sách sự cố với đầy đủ thông tin

#### **Tab "Xu hướng"**
- Biểu đồ đường thể hiện xu hướng sự cố theo thời gian
- Phân tích theo ngày, tuần, tháng

#### **Tab "Heatmap"**
- Bản đồ nhiệt thể hiện tần suất sự cố theo thời gian trong ngày
- Xác định khung giờ có nhiều sự cố nhất

#### **Tab "Phạm vi"**
- Phân tích sự cố theo tầng và phòng
- Xác định khu vực có nhiều sự cố nhất

---

## **ĐIỂM DANH - CHẤM CÔNG**

### **1. Check-in (Bắt đầu ca làm việc)**

1. Chọn menu **"Điểm Danh"** từ sidebar
2. Nhấn nút **"Check-in"**
3. Cho phép truy cập camera khi được yêu cầu
4. Định vị vị trí (GPS) - hệ thống sẽ tự động lấy địa chỉ
5. Chụp ảnh bằng cách nhấn nút **"Chụp ảnh"**
6. Xem lại ảnh và nhấn **"Xác nhận"** hoặc **"Chụp lại"**
7. Hệ thống sẽ lưu thông tin:
   - Thời gian check-in
   - Ảnh chụp
   - Vị trí địa lý (GPS + địa chỉ)
   - Ca làm việc (nếu đã được gán)

### **2. Check-out (Kết thúc ca làm việc)**

1. Chọn menu **"Điểm Danh"**
2. Nhấn nút **"Check-out"**
3. Lặp lại các bước tương tự như check-in
4. Hệ thống sẽ tính toán tổng số giờ làm việc

### **3. Xem Lịch sử Chấm công**

- Phần **"Lịch sử gần đây"** hiển thị 5 lần chấm công gần nhất
- Mỗi bản ghi hiển thị:
  - Loại (Check-in/Check-out)
  - Thời gian
  - Ảnh chụp
  - Vị trí
  - Ca làm việc

### **4. Lưu ý**

- Ảnh sẽ được **nén tự động** trước khi upload để tiết kiệm dung lượng
- Hệ thống hỗ trợ **offline** - dữ liệu sẽ được đồng bộ tự động khi có kết nối
- Icon trạng thái ở header hiển thị: **Trực tuyến** (xanh) / **Ngoại tuyến** (vàng)

---

## **BÁO LỖI - BÁO CÁO SỰ CỐ**

### **1. Tạo Báo cáo Sự cố Mới**

1. Chọn menu **"Báo Lỗi"** từ sidebar
2. Điền thông tin trong form:

   **Nhóm "Thông tin cơ bản":**
   - **Loại sự cố:** Chọn từ dropdown (Kỹ thuật, Vận hành, Hệ thống, Con người, Khác) - **Bắt buộc**
   - **Mức độ ưu tiên:** Chọn từ dropdown (Cao, Trung bình, Thấp) - **Bắt buộc**

   **Nhóm "Vị trí sự cố":**
   - **Tìm kiếm Vị trí:** Nhập tên phòng (ví dụ: "P.201") hoặc tên chi nhánh
     - Hệ thống sẽ tự động tìm và gợi ý
     - Click vào kết quả để tự động điền Chi nhánh và Tầng
   - **Chi nhánh:** Chọn chi nhánh - **Bắt buộc**
   - **Tầng:** Chọn tầng (tự động cập nhật sau khi chọn chi nhánh)
   - **Phạm vi:**
     - **Toàn tầng:** Sự cố ảnh hưởng toàn bộ tầng
     - **Phòng cụ thể:** Chọn một hoặc nhiều phòng cụ thể

   **Nhóm "Mô tả và hình ảnh":**
   - **Mô tả chi tiết:** Nhập mô tả về sự cố - **Bắt buộc**
   - **Hình ảnh:** Chọn file ảnh (tùy chọn)
     - Ảnh sẽ được nén tự động trước khi upload

3. Nhấn nút **"Gửi Báo cáo"**
4. Hệ thống sẽ hiển thị thông báo xác nhận

### **2. Tính năng Tìm kiếm Vị trí Thông minh**

- Nhập tên phòng (ví dụ: "P.201", "P.101") hoặc tên chi nhánh
- Hệ thống sẽ tự động:
  - Tìm phòng trong cơ sở dữ liệu
  - Tự động điền **Chi nhánh** và **Tầng**
  - Tự động chọn **"Phòng cụ thể"** và check phòng tương ứng
- Nhấn **Enter** để chọn kết quả đầu tiên
- Nhấn **Escape** để đóng danh sách gợi ý

---

## **LỊCH SỬ BÁO CÁO**

### **1. Xem Lịch sử**

1. Chọn menu **"Lịch Sử Báo Cáo"** từ sidebar
2. Danh sách hiển thị tất cả sự cố đã báo cáo (theo phân quyền)

### **2. Bộ lọc**

- **Chi nhánh:** Lọc theo chi nhánh
- **Loại sự cố:** Lọc theo loại
- **Trạng thái:** Lọc theo trạng thái (Chờ xử lý, Đang xử lý, Đã giải quyết, Đã hủy)
- **Người báo cáo:** Lọc theo người báo cáo
- **Từ ngày / Đến ngày:** Lọc theo khoảng thời gian
- Nhấn **"Áp dụng Bộ lọc"** hoặc **"Xóa Bộ lọc"**

### **3. Phân trang**

- Hệ thống sử dụng **phân trang phía server** để tối ưu hiệu suất
- Nhấn **"Tải thêm"** để xem thêm dữ liệu
- Hiển thị số lượng bản ghi đã tải

### **4. Xem Chi tiết Sự cố**

- Click vào bất kỳ dòng nào trong bảng để xem chi tiết
- Modal sẽ hiển thị:
  - Thông tin đầy đủ về sự cố
  - Hình ảnh (nếu có)
  - Lịch sử bình luận
  - Form cập nhật (nếu có quyền)

### **5. Cập nhật Sự cố (Admin/Manager)**

Trong modal chi tiết:

1. **Cập nhật Trạng thái:**
   - Chọn trạng thái mới từ dropdown
   - **Lưu ý:** Khi chọn "Đã hủy", hệ thống sẽ yêu cầu xác nhận

2. **Giao việc:**
   - Chọn nhân viên từ dropdown "Giao cho"
   - Hệ thống chỉ hiển thị nhân viên phù hợp:
     - Admin: Tất cả nhân viên
     - Manager: Chỉ nhân viên trong các chi nhánh được quản lý
     - "Chi nhánh" không bao giờ xuất hiện trong danh sách

3. **Cập nhật Mức độ ưu tiên**

4. **Thêm ảnh sửa chữa:**
   - Khi trạng thái là "Đã giải quyết", bắt buộc phải upload ảnh sửa chữa
   - Ảnh sẽ được nén tự động

5. **Thêm Bình luận:**
   - Nhập bình luận vào ô text
   - Sử dụng **@mention** để tag người khác (xem phần [Tagging](#tagging-trong-bình-luận))
   - Nhấn **"Gửi"** hoặc **Enter**

6. Nhấn **"Cập nhật"** để lưu thay đổi

### **6. Xuất Excel**

- Nhấn nút **"Xuất Excel"** ở góc trên bên phải
- File Excel sẽ được tải xuống với tên: `lich_su_su_co_YYYYMMDD.xlsx`
- File chứa tất cả dữ liệu đã lọc hiện tại

---

## **NHIỆM VỤ CỦA TÔI**

### **1. Xem Nhiệm vụ**

1. Chọn menu **"Nhiệm Vụ Của Tôi"** từ sidebar
2. Danh sách hiển thị tất cả sự cố đã được giao cho bạn
3. Sắp xếp theo ngày báo cáo (mới nhất trước)

### **2. Thông tin Hiển thị**

- **Loại sự cố**
- **Mức độ ưu tiên** (màu sắc: Đỏ = Cao, Vàng = Trung bình, Xanh = Thấp)
- **Chi nhánh**
- **Vị trí chi tiết** (tầng, phòng)
- **Người báo cáo**
- **Ngày báo cáo**
- **Trạng thái**

### **3. Xem Chi tiết**

- Click vào bất kỳ dòng nào để xem chi tiết và cập nhật
- Bạn có thể:
  - Xem thông tin đầy đủ
  - Xem và thêm bình luận
  - Cập nhật trạng thái (nếu có quyền)
  - Upload ảnh sửa chữa khi hoàn thành

### **4. Phân trang**

- Nhấn **"Tải thêm"** để xem thêm nhiệm vụ
- Hệ thống tự động tải theo từng trang để tối ưu hiệu suất

---

## **QUẢN LÝ TÀI KHOẢN**

> **Chỉ dành cho Admin**

### **1. Xem Danh sách Tài khoản**

1. Chọn menu **"Quản Lý Tài Khoản"** từ sidebar
2. Bảng hiển thị tất cả tài khoản trong hệ thống

### **2. Tạo Tài khoản Mới**

1. Nhấn nút **"Tạo Tài Khoản Mới"**
2. Điền thông tin:
   - **Email:** Email đăng nhập (bắt buộc)
   - **Mật khẩu:** Tối thiểu 6 ký tự (bắt buộc)
   - **Tên người dùng:** Tên hiển thị (bắt buộc)
   - **Mã nhân viên (MSNV):** Bắt buộc (trừ vai trò "Chi nhánh")
   - **Vai trò:** Chọn từ dropdown (Admin, Manager, Nhân viên, Chi nhánh)
   - **Chi nhánh:** Chỉ hiển thị khi chọn vai trò "Nhân viên" (bắt buộc)
   - **Quyền truy cập:** Chọn các view được phép truy cập
3. Nhấn **"Tạo Tài Khoản"**
4. Tài khoản mới sẽ phải đổi mật khẩu trong lần đăng nhập đầu tiên

### **3. Chỉnh sửa Tài khoản**

1. Click vào nút **"Chỉnh sửa"** (icon bút chì) trong bảng
2. Modal sẽ hiển thị thông tin hiện tại
3. Cập nhật các trường cần thiết:
   - Tên người dùng
   - Mã nhân viên
   - Vai trò
   - Chi nhánh (nếu là Nhân viên)
   - Quyền truy cập
   - Chi nhánh quản lý (nếu là Manager)
4. Nhấn **"Lưu Thay Đổi"**

### **4. Vô hiệu hóa Tài khoản**

1. Click vào nút **"Vô hiệu hóa"** (icon khóa) trong bảng
2. Modal xác nhận sẽ hiển thị
3. **Cảnh báo:** Hành động này sẽ:
   - Vô hiệu hóa tài khoản
   - Ẩn danh tất cả dữ liệu liên quan (báo cáo, bình luận, v.v.)
4. Nhập tên người dùng để xác nhận
5. Nhấn **"Thực hiện Vô hiệu hóa & Ẩn danh"**

### **5. Kích hoạt lại Tài khoản**

1. Bật toggle **"Hiển thị tài khoản đã vô hiệu hóa"**
2. Tìm tài khoản cần kích hoạt
3. Click vào nút **"Kích hoạt"** (icon mở khóa)
4. Tài khoản sẽ được kích hoạt lại ngay lập tức

### **6. Đặt lại Mật khẩu**

1. Click vào nút **"Đặt lại mật khẩu"** (icon khóa) trong bảng
2. Hệ thống sẽ gửi email đặt lại mật khẩu đến email của người dùng
3. Người dùng sẽ phải đổi mật khẩu trong lần đăng nhập tiếp theo

### **7. Phân trang**

- Nhấn **"Tải thêm"** để xem thêm tài khoản
- Sử dụng toggle để hiển thị/ẩn tài khoản đã vô hiệu hóa

---

## **QUẢN LÝ CA LÀM VIỆC**

> **Chỉ dành cho Admin**

### **1. Xem Danh sách Ca**

1. Chọn menu **"Quản Lý Ca Làm Việc"** từ sidebar
2. Bảng hiển thị tất cả ca làm việc với thông tin:
   - Tên ca
   - Giờ bắt đầu
   - Giờ kết thúc
   - Thời gian nghỉ (phút)
   - Tổng giờ làm việc
   - Số nhân viên được gán

### **2. Tạo Ca Mới**

1. Điền thông tin trong form "Tạo ca làm việc mới":
   - **Tên ca:** Tên mô tả (ví dụ: "Ca Sáng")
   - **Giờ bắt đầu:** Format HH:mm (ví dụ: 08:00)
   - **Giờ kết thúc:** Format HH:mm (ví dụ: 17:00)
   - **Thời gian nghỉ:** Số phút (ví dụ: 60 cho 1 giờ)
2. Nhấn **"Tạo Ca"**
3. Hệ thống sẽ tự động tính tổng giờ làm việc (bao gồm cả ca qua đêm)

### **3. Gán Ca cho Nhân viên**

1. Chọn **Nhân viên** từ dropdown
2. Chọn **Ca làm việc** từ dropdown
3. Nhấn **"Gán Ca"**
4. Hệ thống sẽ kiểm tra xem nhân viên đã có ca này chưa
5. Sau khi gán, nhân viên sẽ tự động được gán ca khi chấm công

### **4. Xóa Ca**

1. Click vào nút **"Xóa"** trong bảng
2. **Lưu ý:** Không thể xóa ca nếu còn nhân viên được gán
3. Hệ thống sẽ hiển thị cảnh báo nếu còn nhân viên

### **5. Ca Mặc định**

Hệ thống tự động tạo 5 ca mặc định:
- **Ca Đêm 1 (18h-04h):** 18:00 - 04:00, nghỉ 30 phút
- **Ca Sáng (8h30-17h30):** 08:30 - 17:30, nghỉ 60 phút
- **Ca Chiều (16h-24h):** 16:00 - 24:00, **không nghỉ**
- **Ca Đêm 2 (22h-6h):** 22:00 - 06:00, **không nghỉ**
- **Ca Sáng Sớm (6h-15h):** 06:00 - 15:00, nghỉ 60 phút

---

## **BẢNG CHẤM CÔNG**

> **Dành cho Admin và Manager**

### **1. Tạo Báo cáo Chấm công**

1. Chọn menu **"Bảng Chấm Công"** từ sidebar
2. Chọn **Tháng** và **Năm** cần xem báo cáo
3. (Tùy chọn) Chọn **Nhân viên** cụ thể hoặc "Tất cả"**
   - Manager chỉ thấy nhân viên trong các chi nhánh được quản lý
4. Nhấn **"Tạo Báo cáo"**

### **2. Thông tin Báo cáo**

**Phần Tổng hợp:**
- **Tổng giờ làm việc:** Tổng số giờ trong tháng
- **Số ngày làm việc:** Số ngày có check-in
- **Số ngày nghỉ:** Số ngày không có check-in
- **Tổng số lần check-in:** Tổng số lần chấm công

**Bảng Chi tiết:**
- **Ngày:** Ngày chấm công
- **Nhân viên:** Tên nhân viên
- **Ca:** Ca làm việc được gán
- **Check-in:** Thời gian check-in
- **Check-out:** Thời gian check-out
- **Giờ làm việc:** Số giờ làm việc trong ngày
- **Trạng thái:**
  - **Hoàn thành:** Có cả check-in và check-out
  - **Chưa check-out:** Chỉ có check-in
  - **Nghỉ:** Không có check-in

### **3. Xuất Excel**

1. Sau khi tạo báo cáo, nhấn nút **"Xuất Excel"**
2. File Excel sẽ được tải xuống với tên: `bang_cham_cong_YYYYMM.xlsx`
3. File bao gồm:
   - Bảng tổng hợp
   - Bảng chi tiết từng ngày
   - Thông tin nhân viên và ca làm việc

---

## **NHẬT KÝ HOẠT ĐỘNG**

> **Dành cho Admin và Manager**

### **1. Xem Nhật ký**

1. Chọn menu **"Nhật Ký Hoạt Động"** từ sidebar
2. Bảng hiển thị tất cả hoạt động trong hệ thống, sắp xếp theo thời gian (mới nhất trước)

### **2. Thông tin Hiển thị**

- **Thời gian:** Thời điểm thực hiện hành động
- **Người thực hiện:** Tên và email của người thực hiện
- **Hành động:** Mô tả hành động (ví dụ: "User Login", "Create Account", "Update Issue")
- **Chi tiết:** Thông tin bổ sung (JSON format)

### **3. Phân trang**

- Nhấn **"Tải thêm"** để xem thêm bản ghi
- Hệ thống tự động tải theo từng trang

### **4. Lưu ý**

- Nhật ký không thể chỉnh sửa hoặc xóa
- Tất cả hành động quan trọng đều được ghi lại tự động

---

## **HỒ SƠ CỦA TÔI**

### **1. Mở Hồ sơ**

1. Click vào **icon người dùng** ở góc trên bên phải
2. Chọn **"Hồ sơ của tôi"** từ menu dropdown
3. Modal sẽ hiển thị thông tin cá nhân

### **2. Cập nhật Thông tin Cá nhân**

1. Trong modal, phần **"Thông tin cá nhân"**:
   - **Email:** Chỉ xem (không thể thay đổi)
   - **Mã nhân viên (MSNV):** Chỉ xem
   - **Vai trò:** Chỉ xem
   - **Tên hiển thị:** Có thể chỉnh sửa
2. Nhập tên hiển thị mới
3. Nhấn **"Cập nhật thông tin"**
4. Hệ thống sẽ hiển thị thông báo xác nhận

### **3. Đổi Mật khẩu**

1. Trong modal, phần **"Đổi mật khẩu"**:
   - **Mật khẩu hiện tại:** Nhập mật khẩu hiện tại
   - **Mật khẩu mới:** Nhập mật khẩu mới (tối thiểu 6 ký tự)
   - **Xác nhận mật khẩu mới:** Nhập lại mật khẩu mới
2. Nhấn **"Đổi mật khẩu"**
3. Hệ thống sẽ yêu cầu xác thực lại (re-authentication) để bảo mật
4. Sau khi đổi thành công, bạn sẽ thấy thông báo xác nhận

### **4. Lưu ý**

- Đóng modal bằng cách:
  - Click vào nút **X** ở góc trên bên phải
  - Click bên ngoài modal

---

## **CÁC TÍNH NĂNG NÂNG CAO**

### **1. Tagging trong Bình luận**

Khi thêm bình luận trong chi tiết sự cố:

1. Gõ **@** và bắt đầu nhập tên người dùng
2. Hệ thống sẽ hiển thị danh sách gợi ý
3. Sử dụng phím **↑/↓** để di chuyển
4. Nhấn **Enter** để chọn
5. Người được tag sẽ nhận thông báo
6. Trong bình luận, tên được tag sẽ được highlight

**Ví dụ:**
```
@Nguyễn Văn A vui lòng kiểm tra sự cố này
```

### **2. Hỗ trợ Offline**

- Hệ thống tự động lưu dữ liệu cục bộ khi mất kết nối
- Icon trạng thái ở header:
  - 🟢 **Trực tuyến:** Kết nối bình thường
  - 🟡 **Ngoại tuyến:** Đang offline, dữ liệu sẽ được đồng bộ khi có kết nối
- Khi offline, bạn vẫn có thể:
  - Chấm công
  - Báo cáo sự cố
  - Xem dữ liệu đã tải trước đó
- Dữ liệu sẽ tự động đồng bộ khi kết nối được khôi phục

### **3. Nén Ảnh Tự động**

- Tất cả ảnh upload (báo cáo sự cố, chấm công, ảnh sửa chữa) đều được nén tự động
- Giảm dung lượng lưu trữ và tăng tốc độ upload
- Chất lượng ảnh vẫn đảm bảo đủ để xem

### **4. Xuất Excel**

Có sẵn ở các trang:
- **Lịch Sử Báo Cáo:** Xuất danh sách sự cố đã lọc
- **Bảng Chấm Công:** Xuất báo cáo chấm công theo tháng

### **5. Tìm kiếm Vị trí Thông minh**

Trong form báo lỗi:
- Nhập tên phòng (ví dụ: "P.201")
- Hệ thống tự động tìm và điền Chi nhánh, Tầng
- Tiết kiệm thời gian nhập liệu

### **6. Drill-down trong Dashboard**

- Click vào bất kỳ phần nào của biểu đồ
- Xem danh sách chi tiết các sự cố liên quan
- Hỗ trợ phân tích sâu hơn

### **7. Phân trang Phía Server**

- Tất cả danh sách dài đều sử dụng phân trang phía server
- Tải dữ liệu theo từng trang để tối ưu hiệu suất
- Nhấn **"Tải thêm"** để xem thêm

### **8. Thông báo Real-time**

- Nhận thông báo ngay khi:
  - Có nhiệm vụ mới được giao
  - Được tag trong bình luận
  - Có cập nhật về sự cố được giao
- Icon thông báo ở header hiển thị số lượng thông báo chưa đọc
- Click để xem danh sách thông báo

---

## **LƯU Ý QUAN TRỌNG**

### **Bảo mật**

- Không chia sẻ mật khẩu với người khác
- Đổi mật khẩu định kỳ
- Đăng xuất khi sử dụng máy tính công cộng

### **Hiệu suất**

- Hệ thống tự động tối ưu hiệu suất với phân trang và nén ảnh
- Dashboard sử dụng dữ liệu tổng hợp để tải nhanh
- Hỗ trợ offline để tiếp tục làm việc khi mất kết nối

### **Hỗ trợ**

- Nếu gặp vấn đề, liên hệ Admin hoặc Manager
- Kiểm tra trạng thái kết nối ở icon header
- Đảm bảo trình duyệt được cập nhật mới nhất

---

## **PHỤ LỤC**

### **Các Trạng thái Sự cố**

- **Chờ xử lý:** Sự cố mới được báo cáo, chưa có người xử lý
- **Đang xử lý:** Đã được gán cho nhân viên và đang được xử lý
- **Đã giải quyết:** Đã hoàn thành xử lý (bắt buộc có ảnh sửa chữa)
- **Đã hủy:** Sự cố đã bị hủy (cần xác nhận)

### **Các Loại Sự cố**

- **Kỹ thuật:** Sự cố về thiết bị, máy móc
- **Vận hành:** Sự cố về quy trình vận hành
- **Hệ thống:** Sự cố về hệ thống IT
- **Con người:** Sự cố liên quan đến nhân sự
- **Khác:** Các sự cố khác

### **Mức độ Ưu tiên**

- **Cao:** Cần xử lý ngay lập tức
- **Trung bình:** Xử lý trong thời gian hợp lý
- **Thấp:** Có thể xử lý sau

---

**Phiên bản:** 1.0  
**Cập nhật:** 2024
