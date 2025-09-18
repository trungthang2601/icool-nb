# **HỆ THỐNG VẬN HÀNH THÔNG MINH**

Đây là một ứng dụng web toàn diện được thiết kế để quản lý vận hành, nhân sự và xử lý sự cố trong môi trường doanh nghiệp một cách hiệu quả và an toàn.

## **I. Quản lý Tài khoản & Phân quyền**

### **1\. Đăng nhập & Bảo mật**

* **Đăng nhập an toàn:** Hệ thống sử dụng email và mật khẩu để xác thực người dùng.  
* **Quên mật khẩu:** Cung cấp chức năng "Quên mật khẩu" bảo mật, gửi một đường link đến email đã đăng ký để người dùng có thể tự đặt lại mật khẩu mới.  
* **Bắt buộc đổi mật khẩu:** Để tăng cường bảo mật, tất cả tài khoản mới tạo (bằng tay hoặc qua file Excel) và tài khoản vừa sử dụng chức năng "Quên mật khẩu" sẽ bị yêu cầu phải đổi mật khẩu ngay trong lần đăng nhập đầu tiên.

### **2\. Phân quyền theo vai trò**

Hệ thống có 3 cấp độ người dùng với các quyền hạn được phân cấp rõ ràng:

* **Admin:** Có toàn bộ quyền hạn cao nhất, bao gồm quản lý tất cả tài khoản, cài đặt hệ thống và xem toàn bộ dữ liệu.  
* **Manager:** Quản lý các hoạt động trong phạm vi chi nhánh được phân công, xem báo cáo, giao việc và theo dõi nhật ký hoạt động.  
* **Nhân viên:** Sử dụng các tính năng cơ bản như chấm công và báo cáo sự cố.

### **3\. Quản lý người dùng hiệu quả (dành cho Admin)**

* **Tạo tài khoản đơn lẻ:** Admin có thể tạo mới từng tài khoản trực tiếp trên giao diện.  
* **Nhập/Cập nhật hàng loạt từ Excel:** Admin có thể thêm mới hoặc cập nhật thông tin hàng loạt tài khoản (bao gồm cả phân quyền role) thông qua một file Excel. Hệ thống cung cấp sẵn file mẫu để tiện sử dụng.  
* **Vô hiệu hóa & Kích hoạt:** Thay vì xóa vĩnh viễn, Admin có thể vô hiệu hóa một tài khoản để tạm khóa quyền truy cập. Các tài khoản này có thể được xem lại và kích hoạt lại khi cần.

## **II. Chấm công & Điểm danh**

* **Xác thực bằng hình ảnh:** Nhân viên thực hiện check-in và check-out bằng cách chụp ảnh trực tiếp từ camera của thiết bị.  
* **Dữ liệu đầy đủ:** Hệ thống tự động ghi lại các thông tin quan trọng kèm theo ảnh chụp:  
  * Thời gian chính xác.  
  * Ngày tháng.  
  * Vị trí địa lý (lấy từ GPS).  
* **Lịch sử chấm công:** Người dùng có thể xem lại lịch sử 5 lần chấm công gần nhất của mình.

## **III. Báo cáo & Quản lý Sự cố**

* **Báo cáo sự cố:** Nhân viên có thể dễ dàng tạo báo cáo sự cố với đầy đủ thông tin:  
  * Loại sự cố, mức độ ưu tiên, chi nhánh.  
  * Mô tả chi tiết và đính kèm hình ảnh minh họa.  
* **Quản lý và giao việc:**  
  * Admin và Manager có thể xem danh sách tất cả sự cố (theo phạm vi quản lý).  
  * Giao việc xử lý một sự cố cụ thể cho một nhân viên.  
  * Cập nhật trạng thái của sự cố ("Mới tạo", "Đang xử lý", "Đã giải quyết").  
* **Tương tác & Thảo luận:** Mỗi sự cố có một mục bình luận riêng, cho phép người quản lý và nhân viên được giao việc có thể trao đổi trực tiếp để làm rõ thông tin và đẩy nhanh tiến độ.  
* **Nhiệm vụ của tôi:** Mỗi người dùng có một trang riêng để xem danh sách các công việc/sự cố đã được giao cho mình.

## **IV. Dashboard & Phân tích Dữ liệu**

* **Tổng quan trực quan:** Cung cấp các số liệu thống kê nhanh về tình hình sự cố theo ngày, tuần, và tháng.  
* **Biểu đồ thông minh:**  
  * Biểu đồ tròn phân loại các loại sự cố.  
  * Biểu đồ thanh thể hiện tiến độ xử lý.  
* **Dự báo Bảo trì (Phân tích Rủi ro):**  
  * Hệ thống tự động phân tích tần suất và mức độ nghiêm trọng của các sự cố theo từng hạng mục và chi nhánh.  
  * Xác định và hiển thị các hạng mục có rủi ro cao nhất cần được ưu tiên bảo trì hoặc chú ý.

## **V. Hệ thống & Thông báo**

* **Thông báo Real-time:** Người dùng sẽ nhận được thông báo ngay lập tức khi có một nhiệm vụ mới được giao.  
* **Nhật ký Hoạt động:** Ghi lại mọi hành động quan trọng trên hệ thống (đăng nhập, tạo người dùng, cập nhật sự cố, v.v.), giúp Admin dễ dàng truy vết và quản lý.  
* **Cảnh báo Tự động (Tùy chỉnh bởi Admin):**  
  * Admin có thể **bật/tắt** tính năng tự động gửi cảnh báo.  
  * Có thể **tùy chỉnh thời gian** (tính bằng phút) mà sau đó hệ thống sẽ tự động gửi thông báo đến tất cả người dùng nếu một sự cố chưa được ai tiếp nhận xử lý.