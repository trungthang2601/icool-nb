# Giải Thích: Báo Cáo Archive - Nguồn Dữ Liệu và Cách Thức

## 📍 Nguồn Dữ Liệu

### 1. **Collection Chính (Lý Thuyết)**
- **Collection**: `issueReports_archive`
- **Đường dẫn**: `/artifacts/${canvasAppId}/public/data/issueReports_archive`
- **Mục đích**: Lưu trữ các báo cáo đã được archive (lưu trữ lâu dài)

### 2. **Collection Fallback (Thực Tế Hiện Tại)**
- **Collection**: `issueReports`
- **Đường dẫn**: `/artifacts/${canvasAppId}/public/data/issueReports`
- **Mục đích**: Lưu trữ tất cả báo cáo hiện tại

## 🔄 Cách Thức Hoạt Động

### **Bước 1: Query Archive Collection**
Khi người dùng chọn "Báo Cáo Archive" và chọn tháng/năm:

```javascript
// 1. Parse tháng/năm được chọn (ví dụ: "2025-11")
const [year, month] = issueHistorySelectedMonth.split("-");

// 2. Tính toán khoảng thời gian
const startDate = new Date(year, month - 1, 1);  // Ngày đầu tháng
const endDate = new Date(year, month, 0, 23, 59, 59, 999);  // Ngày cuối tháng

// 3. Query từ collection archive
q = collection(db, `/artifacts/${canvasAppId}/public/data/issueReports_archive`);

// 4. Áp dụng scope restrictions (theo role)
if (role === "Manager") {
  q = query(q, where("issueBranch", "in", managedBranches));
} else if (role === "Nhân viên") {
  q = query(q, where("reporterId", "==", currentUser.uid));
}

// 5. Filter theo tháng/năm
q = query(
  q,
  where("reportDate", ">=", Timestamp.fromDate(startDate)),
  where("reportDate", "<=", Timestamp.fromDate(endDate))
);

// 6. Sắp xếp và phân trang
q = query(q, orderBy("reportDate", "desc"), limit(10));
```

### **Bước 2: Fallback Logic (Nếu Archive Trống)**

Nếu collection `issueReports_archive` **trống** hoặc **không tồn tại**:

```javascript
// 1. Phát hiện archive trống
if (snapshot.empty) {
  console.log("Archive collection is empty, trying fallback...");
  usingFallback = true;
  
  // 2. Query từ collection hiện tại (issueReports)
  q = getScopedIssuesQuery();  // Query với scope restrictions
  
  // 3. Áp dụng các filter khác (nhưng KHÔNG filter date ở server)
  if (branchFilter) q = query(q, where("issueBranch", "==", branchFilter));
  if (issueTypeFilter) q = query(q, where("issueType", "==", issueTypeFilter));
  if (statusFilter) q = query(q, where("status", "==", statusFilter));
  
  // 4. Lấy nhiều records hơn (100 thay vì 10) để filter client-side
  q = query(q, orderBy("reportDate", "desc"), limit(100));
  
  // 5. Execute query
  snapshot = await getDocs(q);
}
```

### **Bước 3: Client-Side Filtering (Khi Fallback)**

Sau khi lấy dữ liệu từ `issueReports`, filter theo tháng/năm ở client:

```javascript
// 1. Convert documents thành array
const reports = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

// 2. Filter theo tháng/năm đã chọn
if (usingFallback && issueHistoryMode === "archive") {
  const [year, month] = issueHistorySelectedMonth.split("-");
  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
  
  filteredReports = reports.filter((report) => {
    // Handle cả Timestamp và Date format
    let reportDate;
    if (report.reportDate && report.reportDate.toDate) {
      reportDate = report.reportDate.toDate();  // Firestore Timestamp
    } else if (report.reportDate) {
      reportDate = new Date(report.reportDate);  // String/Date
    } else {
      return false;
    }
    
    // Kiểm tra nằm trong khoảng tháng/năm
    return reportDate >= startDate && reportDate <= endDate;
  });
}
```

## ⚠️ Vấn Đề Hiện Tại

### **1. Collection Archive Chưa Có Dữ Liệu**
- Collection `issueReports_archive` **chưa được tạo** hoặc **trống**
- Không có code nào tự động **archive** dữ liệu từ `issueReports` sang `issueReports_archive`
- Hiện tại hệ thống **luôn fallback** sang `issueReports`

### **2. Fallback Hoạt Động Như Thế Nào**
- ✅ Query từ `issueReports` (collection hiện tại)
- ✅ Lấy 100 records gần nhất (thay vì 10)
- ✅ Filter theo tháng/năm ở **client-side** (trong trình duyệt)
- ⚠️ **Hạn chế**: Chỉ lấy được 100 records, nếu tháng đó có > 100 báo cáo thì sẽ thiếu

## 💡 Giải Pháp Đề Xuất

### **Option 1: Tạo Cloud Function để Archive Tự Động**
```javascript
// functions/index.js
exports.archiveOldReports = functions.pubsub
  .schedule("0 0 1 * *")  // Chạy vào 00:00 ngày 1 hàng tháng
  .timeZone("Asia/Ho_Chi_Minh")
  .onRun(async (context) => {
    // 1. Lấy tất cả reports từ tháng trước
    // 2. Copy sang issueReports_archive
    // 3. Xóa hoặc giữ lại trong issueReports (tùy chọn)
  });
```

### **Option 2: Archive Thủ Công**
- Tạo một function để admin có thể archive dữ liệu thủ công
- Copy dữ liệu từ `issueReports` sang `issueReports_archive` theo tháng

### **Option 3: Cải Thiện Fallback**
- Query tất cả dữ liệu từ `issueReports` (không limit)
- Filter client-side theo tháng/năm
- ⚠️ **Lưu ý**: Có thể chậm nếu có quá nhiều dữ liệu

## 📊 Tóm Tắt

| Trạng Thái | Collection | Cách Lấy Dữ Liệu |
|------------|------------|------------------|
| **Lý Thuyết** | `issueReports_archive` | Query trực tiếp với filter tháng/năm ở server |
| **Thực Tế** | `issueReports` (fallback) | Query 100 records, filter tháng/năm ở client |
| **Vấn Đề** | Archive trống | Luôn phải dùng fallback |
| **Giải Pháp** | Tạo archive system | Cloud Function tự động archive hoặc archive thủ công |

## 🔍 Kiểm Tra Trạng Thái

Để kiểm tra xem archive có dữ liệu không:
1. Mở Firebase Console
2. Vào Firestore Database
3. Tìm collection: `artifacts/{appId}/public/data/issueReports_archive`
4. Nếu collection không tồn tại hoặc trống → Hệ thống đang dùng fallback

