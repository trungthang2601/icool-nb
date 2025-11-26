  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import {
    getAuth,
    sendPasswordResetEmail,
    updatePassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithCustomToken,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
  import {
    getFirestore,
    enableIndexedDbPersistence,
    doc,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    where,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    limit,
    deleteDoc,
    startAfter,
    Timestamp,
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
  import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
  import {
    getFunctions,
    httpsCallable,
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js";

  // --- Configuration Constants ---
  const firebaseConfig =
    typeof __firebase_config !== "undefined"
      ? JSON.parse(__firebase_config)
      : {
          apiKey: "AIzaSyD3FBCihM1QA1DZmMxn0ysR2khs43M-2sE",
          authDomain: "icool-ea266.firebaseapp.com",
          projectId: "icool-ea266",
          storageBucket: "icool-ea266.firebasestorage.app",
          messagingSenderId: "338046663113",
          appId: "1:338046663113:web:cef72e289e7546f3271018",
          measurementId: "G-NBGEQSDT6N",
        };
  const initialAuthToken =
    typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
  const canvasAppId =
    typeof __app_id !== "undefined" ? __app_id : "default-app-id";
  const DEFAULT_ADMIN_EMAIL = "trungthang2601@gmail.com";
  const ALL_BRANCHES = [
    "ICOOL XÔ VIẾT NGHỆ TĨNH",
    "ICOOL BÌNH PHÚ",
    "ICOOL UNG VĂN KHIÊM",
    "ICOOL TÔ KÝ",
    "ICOOL DƯƠNG BÁ TRẠC",
    "ICOOL TRẦN NÃO",
    "ICOOL THÀNH THÁI",
    "ICOOL MẠC ĐĨNH CHI",
    "ICOOL NGUYỄN SƠN",
    "ICOOL NGUYỄN TRÃI",
    "ICOOL NHỊ THIÊN ĐƯỜNG",
    "ICOOL CÁCH MẠNG THÁNG TÁM",
    "ICOOL TRẦN BÌNH TRỌNG",
    "ICOOL ĐỒNG ĐEN",
    "ICOOL PHAN CHU TRINH",
    "ICOOL NGUYỄN TRI PHƯƠNG",
    "ICOOL PHAN XÍCH LONG",
    "ICOOL HOÀNG DIỆU 2",
    "ICOOL CẦU CHỮ Y",
    "ICOOL LÊ VĂN VIỆT",
    "ICOOL SƯ VẠN HẠNH",
    "ICOOL ĐẠI LỘ 2",
    "ICOOL LÊ THỊ HÀ",
    "ICOOL VŨNG TÀU",
    "SPACE A&A",
    "Văn phòng",
  ];

  // New data structure: Branch -> Floor -> Room array
  // IMPORTANT: Branch name must EXACTLY MATCH the name in the ALL_BRANCHES array.
  const BRANCH_DATA = {
    "ICOOL XÔ VIẾT NGHỆ TĨNH": {
      Trệt: ["P.101", "P.102"],
      "Tầng 1": [
        "P.201",
        "P.202",
        "P.203",
        "P.204",
        "P.205",
        "P.206",
        "P.207",
        "P.208",
        "P.209",
        "P.210",
        "P.211",
      ],
      "Tầng 2": [
        "P.300",
        "P.301",
        "P.302",
        "P.303",
        "P.304",
        "P.305",
        "P.306",
        "P.307",
        "P.308",
        "P.309",
        "P.310",
        "P.311",
        "P.312",
      ],
      "Tầng 3": ["P.401"],
      "Tầng 4": ["P.501", "P.502"],
    },
    "ICOOL BÌNH PHÚ": {
      Trệt: [
        "P.101",
        "P.102",
        "P.103",
        "P.104",
        "P.105",
        "P.106",
        "P.107",
        "P.108",
        "P.109",
        "P.110",
      ],
      "Lầu 1": ["P.201", "P.202", "P.203", "P.204", "P.205"],
    },
    "ICOOL UNG VĂN KHIÊM": {
      Trệt: ["P.001", "P.002", "P.101", "P.102", "P.103", "P.104"],
      "Tầng 1": [
        "P.101",
        "P.101",
        "P.102",
        "P.103",
        "P.104",
        "P.105",
        "P.106",
        "P.107",
        "P.108",
        "P.109",
        "P.110",
      ],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306", "P.307"],
      "Tầng 4": [
        "P.401",
        "P.402",
        "P.403",
        "P.404",
        "P.405",
        "P.406",
        "P.407",
        "P.408",
        "P.409",
      ],
      "Tầng 5": ["P.501"],
    },
    "ICOOL TÔ KÝ": {
      Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006"],
      "Tầng 1": [
        "P.101",
        "P.102",
        "P.103",
        "P.104",
        "P.105",
        "P.106",
        "P.107",
        "P.108",
        "P.109",
      ],
      "Tầng 2": [
        "P.201",
        "P.202",
        "P.203",
        "P.204",
        "P.205",
        "P.206",
        "P.207",
        "P.208",
        "P.209",
      ],
      "Tầng 3": ["P.301", "P.302"],
      "Tầng 4": ["P.401", "P.402"],
    },
    "ICOOL DƯƠNG BÁ TRẠC": {
      Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006"],
      "Tầng 1": [
        "P.101",
        "P.102",
        "P.103",
        "P.104",
        "P.105",
        "P.106",
        "P.107",
        "P.108",
      ],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207"],
      "Tầng 3": ["P.301"],
      "Tầng 4": ["P.401", "P.402"],
      "Tầng 5": ["P.501", "P.502"],
    },
    "ICOOL TRẦN NÃO": {
      Trệt: [
        "P.101",
        "P.102",
        "P.103",
        "P.104",
        "P.105",
        "P.106",
        "P.107",
        "P.108",
      ],
      "Tầng 1": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206"],
      "Tầng 2": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306"],
    },
    "ICOOL THÀNH THÁI": {
      Trệt: ["P.001"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305"],
      "Tầng 4": ["P.401", "P.402", "P.403", "P.404"],
      "Tầng 5": ["P.501", "P.502", "P.503"],
      "Tầng 6": ["P.601", "P.602", "P.603", "P.604", "P.605"],
    },
    "ICOOL MẠC ĐĨNH CHI": {
      Trệt: [
        "P.001",
        "P.002",
        "P.003",
        "P.004",
        "P.005",
        "P.006",
        "P.007",
        "P.008",
      ],
      "Tầng 1": ["P.101", "P.102", "P.104", "P.105", "P.106", "P.107"],
      "Tầng 2": ["P.201", "P.202"],
      "Tầng 3": ["P.301", "P.302"],
      "Tầng 4": ["P.401", "P.402"],
      "Tầng 5": ["P.501", "P.502"],
    },
    "ICOOL NGUYỄN SƠN": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107"],
      "Tầng 2": [
        "P.201",
        "P.202",
        "P.203",
        "P.204",
        "P.205",
        "P.206",
        "P.207",
        "P.208",
        "P.209",
      ],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305"],
    },
    "ICOOL NGUYỄN TRÃI": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304"],
      "Tầng 4": ["P.401", "P.402"],
    },
    "ICOOL NHỊ THIÊN ĐƯỜNG": {
      Trệt: ["P.001"],
      "Tầng 1": ["P.101", "P.104", "P.105"],
      "Tầng 2": ["P.204", "P.205", "P.206", "P.207"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305"],
      "Tầng 4": ["P.401", "P.402", "P.403", "P.404", "P.405"],
    },
    "ICOOL CÁCH MẠNG THÁNG TÁM": {
      Trệt: ["P.001", "P.002", "P.003", "P.004"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306"],
      "Tầng 4": ["P.401", "P.402", "P.403", "P.404", "P.405", "P.406"],
      "Tầng 5": ["P.501", "P.502"],
    },
    "ICOOL TRẦN BÌNH TRỌNG": {
      Trệt: ["P.101", "P.102"],
      "Tầng 1": ["P.201", "P.202", "P.203"],
      "Tầng 2": ["P.301", "P.302", "P.303"],
      "Tầng 3": ["P.401", "P.402", "P.403"],
      "Tầng 4": ["P.501", "P.502", "P.503"],
      "Tầng 5": ["P.601", "P.602", "P.603"],
    },
    "ICOOL ĐỒNG ĐEN": {
      Trệt: ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107"],
      "Tầng 1": [
        "P.201",
        "P.202",
        "P.203",
        "P.204",
        "P.205",
        "P.206",
        "P.207",
        "P.208",
      ],
      "Tầng 2": [
        "P.301",
        "P.302",
        "P.303",
        "P.304",
        "P.305",
        "P.306",
        "P.307",
        "P.308",
      ],
    },
    "ICOOL PHAN CHU TRINH": {
      Trệt: ["P.001", "P.002", "P.003"],
      "Tầng 1": ["P.101", "P.102", "P.103"],
      "Tầng 2": ["P.201", "P.202"],
      "Tầng 3": ["P.301", "P.302", "P.303"],
      "Tầng 4": ["P.401", "P.402", "P.403"],
      "Tầng 5": ["P.501", "P.502", "P.503"],
    },
    "ICOOL NGUYỄN TRI PHƯƠNG": {
      Trệt: ["P.001"],
      "Tầng 1": ["P.101", "P.102", "P.103"],
      "Tầng 2": ["P.201", "P.202", "P.203"],
      "Tầng 3": ["P.301", "P.302", "P.303"],
      "Tầng 4": ["P.401", "P.402"],
      "Tầng 5": ["P.501", "P.502"],
      "Tầng 6": ["P.601", "P.602"],
    },
    "ICOOL PHAN XÍCH LONG": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306", "P.307"],
      "Tầng 4": ["P.401", "P.402", "P.403", "P.404", "P.405", "P.406", "P.407"],
      "Tầng 5": ["P.501", "P.502", "P.503", "P.504", "P.505", "P.506", "P.507"],
      "Tầng 6": ["P.601", "P.602", "P.603"],
    },
    "ICOOL HOÀNG DIỆU 2": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.002", "P.101", "P.103"],
      "Tầng 2": ["P.201", "P.202"],
      "Tầng 3": ["P.301"],
    },
    "ICOOL ICOOL CẦU CHỮ Y": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.101", "P.102", "P.103"],
      "Tầng 2": ["P.201", "P.202", "P.203"],
      "Tầng 3": ["P.301", "P.302", "P.303"],
      "Tầng 4": ["P.401", "P.402", "P.403"],
    },
    "ICOOL LÊ VĂN VIỆT": {
      Trệt: [
        "P.001",
        "P.002",
        "P.003",
        "P.004",
        "P.005",
        "P.006",
        "P.007",
        "P.008",
        "P.009",
        "P.010",
        "P.011",
        "P.012",
        "P.014",
        "P.015",
        "P.016",
        "P.017",
        "P.018",
        "P.019",
        "P.020",
        "P.021",
        "P.022",
        "P.023",
        "P.026",
        "VIP1",
        "VIP2",
      ],
      "Tầng 1": ["P.024", "P.025"],
    },
    "ICOOL SƯ VẠN HẠNH": {
      Trệt: ["P.001"],
      "Tầng 1": ["P.101", "P.102", "P.103"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305"],
      "Tầng 4": ["P.401"],
    },
    "ICOOL ĐẠI LỘ 2": {
      Trệt: ["P.101", "P.102"],
      "Tầng 1": ["P.201", "P.202", "P.203"],
      "Tầng 2": ["P.301", "P.302", "P.303"],
      "Tầng 3": ["P.401", "P.402", "P.403"],
    },
    "ICOOL LÊ THỊ HÀ": {
      Trệt: ["P.101", "P.102", "P.103", "P.104"],
      "Tầng 1": ["UVK-P1", "UVK-P2", "UVK-P3"],
      "Tầng 2": ["UVK-P4", "UVK-P5", "UVK-P6"],
    },
    "ICOOL VŨNG TÀU": {
      Trệt: ["P.001", "P.002"],
      "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106"],
      "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206"],
      "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306"],
    },
    "SPACE A&A": {
      // Dữ liệu phòng cho SPACE A&A
      Trệt: [],
      "Tầng 1": [],
    },
    "Văn phòng": {
      // Dữ liệu phòng cho Văn phòng
      Trệt: [],
      "Tầng 1": [],
    },

    // Dữ liệu mặc định cho các chi nhánh không được liệt kê ở trên
    default: {
      "Tầng 1": ["P101", "P102", "P103", "P104", "P105"],
      "Tầng 2": ["P201", "P202", "P203", "P204", "P205"],
      VIP: ["V01", "V02"],
    },
  };

  const ALL_VIEWS = {
    dashboardView: "Dashboard",
    attendanceView: "Điểm Danh",
    issueReportView: "Báo Lỗi",
    issueHistoryView: "Lịch Sử Báo Cáo",
    myTasksView: "Nhiệm Vụ Của Tôi",
    manageAccountsView: "Quản Lý Tài Khoản",
    activityLogView: "Nhật Ký Hoạt Động",
    myProfileView: "Hồ sơ của tôi",
    manageShiftsView: "Quản Lý Ca Làm Việc",
    attendanceReportView: "Bảng Chấm Công",
  };
  const ROLES = ["Admin", "Manager", "Nhân viên", "Chi nhánh"];
    // Thứ tự menu hợp lý: Dashboard -> Chấm công -> Báo lỗi -> Công việc -> Quản lý
    // Lưu ý: "Hồ sơ của tôi" đã được chuyển thành modal, không còn trong sidebar
  const DEFAULT_VIEWS = {
    Admin: [
      "dashboardView",              // 1. Tổng quan
      "attendanceView",             // 2. Điểm danh
      "attendanceReportView",        // 3. Bảng chấm công
      "manageShiftsView",           // 4. Quản lý ca làm việc
      "issueReportView",            // 5. Báo lỗi
      "issueHistoryView",           // 6. Lịch sử báo cáo
      "myTasksView",                // 7. Nhiệm vụ của tôi
      "manageAccountsView",         // 8. Quản lý tài khoản
      "activityLogView",            // 9. Nhật ký hoạt động
    ],
    Manager: [
      "dashboardView",              // 1. Tổng quan
      "attendanceView",             // 2. Điểm danh
      "attendanceReportView",       // 3. Bảng chấm công
      "issueReportView",            // 4. Báo lỗi
      "issueHistoryView",           // 5. Lịch sử báo cáo
      "myTasksView",                // 6. Nhiệm vụ của tôi
      "activityLogView",            // 7. Nhật ký hoạt động
    ],
    "Nhân viên": [
      "dashboardView",              // 1. Dashboard
      "attendanceView",             // 2. Điểm danh
      "issueReportView",            // 3. Báo lỗi
      "issueHistoryView",           // 4. Lịch sử báo cáo
      "myTasksView",                // 5. Nhiệm vụ của tôi
      // Lưu ý: "Hồ sơ của tôi" (myProfileView) là modal, không cần thêm vào allowedViews
      // Nhân viên có thể truy cập qua menu dropdown ở header
    ],
    "Chi nhánh": [
      "issueReportView",            // 1. Báo lỗi
      "issueHistoryView",          // 2. Lịch sử báo cáo
    ],
  };
  const ISSUE_STATUSES = ["Chờ xử lý", "Đang xử lý", "Đã giải quyết", "Đã hủy"];
  const ISSUE_TYPES = ["Kỹ thuật", "Vận hành", "Hệ thống", "Con người", "Khác"];

  // --- Global State Variables ---
  let app, auth, db, storage, functions;
  let currentUser = null,
    currentUserProfile = null;
  let unsubscribeListeners = [],
    issueCommentsUnsubscribe = null;
  let issueTypeChart = null,
    pdmRiskChart = null,
    incidentTrendChart = null,
    topEmployeesChart = null,
    branchStatusChart = null,
    branchTimeChart = null,
    scopeAnalysisChart = null;
  let currentCameraStream,
    capturedPhotoBlob,
    currentAttendanceAction,
    timeInterval,
    capturedLocationInfo;
  let showDisabledAccounts = false;
  let allUsersCache = []; // Cache for all users (used for accounts table, dropdowns, mentions) - may be filtered
  let allUsersCacheUnfiltered = []; // Cache for all users before disabled filter (for total count)
  let accountsSearchTerm = "";
  let activityLogSearchTerm = "";
  let usersCacheLoaded = false; // Flag to track if users cache has been loaded
  let activityLogFilters = {
    actor: "",
    action: "",
    dateFrom: "",
    dateTo: ""
  };
  let escalationInterval = null;
  let dashboardReportsCache = [];
  let activityLogsCache = [];
  let issueHistoryCache = [];
  let issueHistoryFiltered = [];
  let issueHistorySelectedMonth = ""; // Store selected month/year for archive query
  let issueHistoryMode = "current"; // "current" or "archive" - mode for viewing issue history
  let myTasksCache = [];
  let activityLogCurrentPage = 1;
  let accountsCurrentPage = 1;
  let issueHistoryCurrentPage = 1;
  let myTasksCurrentPage = 1;
  const ITEMS_PER_PAGE = 10;
  // Server-side pagination state
  let issueHistoryLastVisible = null;
  let issueHistoryHasMore = false;
  let issueHistoryTotalCount = 0;
  let activityLogLastVisible = null;
  let activityLogHasMore = false;
  let accountsLastVisible = null;
  let accountsHasMore = false;
  let myTasksLastVisible = null;
  let myTasksHasMore = false;

  // --- DOM Element References ---
  let skeletonLoader,
    authSection,
    appContainer,
    mainContentContainer,
    viewsContainer,
    sidebarNav,
    sidebarOverlay;
  let authEmailInput, authPasswordInput, loginBtn, authMessage;
  let loggedInUserDisplay, dropdownUserName, dropdownUserRole;
  let notificationToggle, notificationBadge, notificationMenu, notificationList;
  let editAccountModal,
    issueDetailModal,
    cameraModal,
    deleteAccountModal,
    resetPasswordModal,
    forceChangePasswordModal,
    drillDownModal,
    confirmCancelModal,
    myProfileModal;
  let sidebar, mobileMenuToggle;
  let onlineStatusIndicator, onlineStatusIcon, onlineStatusText;

  // --- App Initialization ---
  document.addEventListener("DOMContentLoaded", async () => {
    // Bind DOM elements first to ensure they are available for the catch block
    bindShellDOMElements();
    bindShellEventListeners();

    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      functions = getFunctions(app);

      // Enable offline persistence for Firestore
      // This allows the app to work offline and sync when connection is restored
      try {
        await enableIndexedDbPersistence(db);
        console.log("✅ Đã bật chế độ offline persistence");
      } catch (persistenceError) {
        // Handle errors (e.g., multiple tabs open, browser doesn't support it)
        if (persistenceError.code === "failed-precondition") {
          console.warn("⚠️ Offline persistence failed: Multiple tabs open. Persistence can only be enabled in one tab at a time.");
        } else if (persistenceError.code === "unimplemented") {
          console.warn("⚠️ Offline persistence not supported in this browser.");
        } else {
          console.warn("⚠️ Offline persistence error:", persistenceError);
        }
      }

      // Set up online/offline status monitoring
      setupOnlineStatusMonitoring();

      onAuthStateChanged(auth, handleAuthStateChange);

      if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken);
      }
    } catch (error) {
      console.error("Lỗi khởi tạo Firebase:", error);
      // Kiểm tra nếu là lỗi mạng
      if (error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED') || error.code === 'unavailable') {
        console.warn("⚠️ Lỗi kết nối mạng: Không thể kết nối đến Firebase. Vui lòng kiểm tra kết nối internet.");
      }
      // Now skeletonLoader and authSection are defined, so this won't throw a TypeError
      skeletonLoader.classList.add("hidden");
      authSection.classList.remove("hidden");
    }
  });

  /**
   * Sets up online/offline status monitoring and UI updates
   */
  function setupOnlineStatusMonitoring() {
    if (!onlineStatusIndicator || !onlineStatusIcon || !onlineStatusText) {
      return; // Elements not available yet
    }

    // Update status based on current connection state
    const updateOnlineStatus = (isOnline) => {
      if (!onlineStatusIndicator || !onlineStatusIcon || !onlineStatusText) return;

      onlineStatusIndicator.classList.remove("hidden");
      
      if (isOnline) {
        // Online state
        onlineStatusIndicator.className = "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700";
        onlineStatusIcon.className = "fas fa-circle text-xs text-green-500";
        onlineStatusText.textContent = "Trực tuyến";
        onlineStatusIcon.title = "Kết nối mạng hoạt động bình thường";
      } else {
        // Offline state
        onlineStatusIndicator.className = "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700";
        onlineStatusIcon.className = "fas fa-circle text-xs text-yellow-500";
        onlineStatusText.textContent = "Ngoại tuyến";
        onlineStatusIcon.title = "Không có kết nối mạng. Dữ liệu sẽ được đồng bộ khi có mạng trở lại.";
      }
    };

    // Initial status
    updateOnlineStatus(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener("online", () => {
      console.log("✅ Connection restored");
      updateOnlineStatus(true);
      
      // Show a brief notification that sync is happening
      if (onlineStatusText) {
        const originalText = onlineStatusText.textContent;
        onlineStatusText.textContent = "Đang đồng bộ...";
        setTimeout(() => {
          if (onlineStatusText) {
            onlineStatusText.textContent = originalText;
          }
        }, 2000);
      }
    });

    window.addEventListener("offline", () => {
      console.log("⚠️ Connection lost - Offline mode activated");
      updateOnlineStatus(false);
    });

    // Also monitor Firestore connection state if available
    // Note: Firestore doesn't expose connection state directly in v9+,
    // but offline persistence handles sync automatically
  }

  // --- Escalation & Settings Functions (Admin only) ---
  async function handleSaveSettings() {
    const settingsMessage =
      mainContentContainer.querySelector("#settingsMessage");
    const newTime = parseInt(
      mainContentContainer.querySelector("#escalationTimeInput").value,
      10
    );
    const escalationEnabled =
      mainContentContainer.querySelector("#escalationToggle").checked;

    if (isNaN(newTime) || newTime <= 0) {
      settingsMessage.textContent = "Vui lòng nhập một số dương hợp lệ.";
      settingsMessage.className = "p-3 rounded-lg text-sm alert-error";
      settingsMessage.classList.remove("hidden");
      return;
    }

    try {
      const settingsRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/settings`,
        "appSettings"
      );
      await setDoc(
        settingsRef,
        {
          escalationTimeMinutes: newTime,
          escalationEnabled: escalationEnabled,
        },
        { merge: true }
      );

      settingsMessage.textContent = "Cài đặt đã được lưu thành công!";
      settingsMessage.className = "p-3 rounded-lg text-sm alert-success";
      settingsMessage.classList.remove("hidden");

      // Restart the checker with the new settings
      stopEscalationChecker();
      startEscalationChecker();

      setTimeout(() => settingsMessage.classList.add("hidden"), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      settingsMessage.textContent = `Lỗi: ${error.message}`;
      settingsMessage.className = "p-3 rounded-lg text-sm alert-error";
      settingsMessage.classList.remove("hidden");
    }
  }

  async function fetchAndDisplaySettings() {
    const escalationTimeInput = mainContentContainer.querySelector(
      "#escalationTimeInput"
    );
    const escalationToggle =
      mainContentContainer.querySelector("#escalationToggle");
    if (!escalationTimeInput || !escalationToggle) return;

    try {
      const settingsRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/settings`,
        "appSettings"
      );
      const docSnap = await getDoc(settingsRef);

      if (docSnap.exists()) {
        const settings = docSnap.data();
        escalationTimeInput.value = settings.escalationTimeMinutes || 60;
        escalationToggle.checked = settings.escalationEnabled === true;
      } else {
        escalationTimeInput.value = 60; // Default value
        escalationToggle.checked = false; // Default value
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      escalationTimeInput.value = 60; // Fallback to default
      escalationToggle.checked = false;
    }
  }

  function stopEscalationChecker() {
    if (escalationInterval) {
      clearInterval(escalationInterval);
      escalationInterval = null;
      console.log("Escalation checker stopped.");
    }
  }

  async function startEscalationChecker() {
    stopEscalationChecker(); // Ensure no multiple intervals are running

    const settingsRef = doc(
      db,
      `/artifacts/${canvasAppId}/public/data/settings`,
      "appSettings"
    );
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists() || !settingsSnap.data().escalationEnabled) {
      console.log("Tính năng escalation đã tắt. Trình kiểm tra sẽ không chạy.");
      return;
    }

    console.log("Starting escalation checker...");

    const escalationMinutes = settingsSnap.data().escalationTimeMinutes || 60;
    const checkInterval = 5 * 60 * 1000; // Check every 5 minutes

    escalationInterval = setInterval(async () => {
      console.log(
        `Checking for unassigned issues older than ${escalationMinutes} minutes...`
      );
      const now = new Date();
      const escalationThreshold = new Date(
        now.getTime() - escalationMinutes * 60 * 1000
      );

      const q = query(
        collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`),
        where("status", "==", "Chờ xử lý"),
        where("assigneeId", "==", null),
        where("reportDate", "<", escalationThreshold.toISOString())
      );

      const overdueIssuesSnapshot = await getDocs(q);
      if (overdueIssuesSnapshot.empty) {
        console.log("No overdue issues found.");
        return;
      }

      const allUsersSnapshot = await getDocs(
        collection(db, `/artifacts/${canvasAppId}/users`)
      );
      const allUserIds = allUsersSnapshot.docs.map((d) => d.id);

      for (const issueDoc of overdueIssuesSnapshot.docs) {
        const issueData = issueDoc.data();
        if (issueData.escalated) {
          continue; // Skip if already escalated
        }

        console.log(`Escalating issue: ${issueDoc.id}`);
        const message = `CẢNH BÁO: Sự cố tại '${issueData.issueBranch}' (${issueData.issueType}) đã quá hạn xử lý!`;

        // Send notification to all users
        for (const userId of allUserIds) {
          await sendNotification(userId, message);
        }

        // Mark as escalated to prevent re-notifying
        await updateDoc(issueDoc.ref, { escalated: true });
      }
    }, checkInterval);
  }

  // --- Core Auth & UI Functions ---
  async function handleAuthStateChange(user) {
    unsubscribeAll();
    stopEscalationChecker();
    currentUser = user;

    if (user) {
      await fetchAndSetUserProfile(user.uid, user);

      if (currentUserProfile && currentUserProfile.status !== "disabled") {
        if (currentUserProfile.requiresPasswordChange) {
          // Nếu cần đổi mật khẩu, chỉ hiển thị modal, KHÔNG cho phép truy cập app
          authSection.classList.add("hidden");
          appContainer.classList.remove("hidden");
          // Thiết lập header cơ bản để hiển thị thông tin user
          loggedInUserDisplay.textContent = currentUserProfile.displayName;
          dropdownUserName.textContent = currentUserProfile.displayName;
          dropdownUserRole.textContent = currentUserProfile.role;
          // Ẩn sidebar và main content để người dùng không thể truy cập
          sidebar.classList.add("-translate-x-full");
          mainContentContainer.innerHTML = "";
          // Hiển thị modal đổi mật khẩu
          promptForcePasswordChange();
        } else {
          // Nếu không cần đổi mật khẩu, thiết lập UI đầy đủ và tải các chức năng
          setupUIForLoggedInUser();
          forceChangePasswordModal.style.display = "none";
          listenToNotifications();
          showInitialView();
          // Load users into cache (for dropdowns and mentions)
          // Don't await - load in background to not block UI
          loadUsersIntoCache().catch(err => console.error("Failed to load users cache:", err));
          if (currentUserProfile.role === "Admin") {
            startEscalationChecker();
          }
        }
        setTimeout(() => logActivity("User Login", { email: user.email }), 500);
      } else {
        console.error(
          "User profile not found or account is disabled. Logging out."
        );
        handleLogout();
      }
    } else {
      setupUIForLoggedOutUser();
      // Clear cache on logout
      allUsersCache = [];
      usersCacheLoaded = false;
    }
    skeletonLoader.classList.add("hidden");
  }

  async function fetchAndSetUserProfile(uid, authUser) {
    const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${uid}`);
    let userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const userRole =
        authUser.email === DEFAULT_ADMIN_EMAIL ? "Admin" : "Nhân viên";
      const defaultProfile = {
        email: authUser.email,
        displayName:
          authUser.displayName ||
          (authUser.email || "").split("@")[0] ||
          "Người dùng mới",
        employeeId: "N/A",
        role: userRole,
        allowedViews: DEFAULT_VIEWS[userRole],
        managedBranches: [],
        requiresPasswordChange: true, // Force change for new accounts
      };
      await setDoc(userDocRef, defaultProfile);
      userDoc = await getDoc(userDocRef);
    }
    currentUserProfile = userDoc.data();
    
    // Filter out myProfileView from allowedViews (it's now a modal, not a sidebar view)
    if (currentUserProfile.allowedViews && Array.isArray(currentUserProfile.allowedViews)) {
      currentUserProfile.allowedViews = currentUserProfile.allowedViews.filter(
        (viewId) => viewId !== "myProfileView"
      );
    }
  }

  /**
   * Loads all users into cache (called once after login)
   * This avoids repeated getDocs calls in openIssueDetailModal and setupMentionAutocomplete
   */
  async function loadUsersIntoCache() {
    if (usersCacheLoaded || !currentUser) {
      return; // Already loaded or user not logged in
    }

    try {
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const usersSnapshot = await getDocs(usersRef);
      allUsersCache = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      usersCacheLoaded = true;
      console.log(`✅ Đã tải ${allUsersCache.length} người dùng vào cache`);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách người dùng vào cache:", error);
      if (error.code === "permission-denied" || error.message?.includes("permissions")) {
        console.warn("⚠️ Lỗi quyền truy cập Firestore. Vui lòng cập nhật Firestore Security Rules:");
        console.warn("   1. Vào Firebase Console: https://console.firebase.google.com/project/icool-ea266/firestore/rules");
        console.warn("   2. Thêm rule: allow read: if true; cho collection users");
        console.warn("   3. Xem chi tiết trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
      }
      // Continue execution even if cache load fails
      // App will still work, but some features (like user dropdowns) may not work properly
      allUsersCache = [];
      usersCacheLoaded = false;
    }
  }

  async function handleLogin() {
    const input = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    if (!input || !password) {
      authMessage.textContent = "Vui lòng nhập tên đăng nhập và mật khẩu.";
      authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
      authMessage.classList.remove("hidden");
      return;
    }
    
    let email = input;
    
    // Nếu input không phải email (không có @), tìm email từ username bằng Cloud Function
    if (!input.includes("@")) {
      try {
        console.log("Đang tìm username:", input);
        
        // Sử dụng Cloud Function để tìm email từ username
        const getEmailFromUsername = httpsCallable(functions, "getEmailFromUsername");
        const result = await getEmailFromUsername({ 
          username: input.trim(),
          appId: canvasAppId 
        });
        
        if (result.data && result.data.email) {
          email = result.data.email;
          console.log("Tìm thấy email từ Cloud Function:", email);
        } else {
          authMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
          authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
          authMessage.classList.remove("hidden");
          return;
        }
      } catch (error) {
        console.error("Lỗi khi tìm username:", error);
        
        // Xử lý các loại lỗi khác nhau
        if (error.code === "functions/not-found" || error.message.includes("not-found") || error.message.includes("not found")) {
          authMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
          authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
          authMessage.classList.remove("hidden");
          return;
        } else if (error.code === "functions/unavailable" || error.message.includes("unavailable")) {
          authMessage.textContent = "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau hoặc sử dụng email để đăng nhập.";
          authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
          authMessage.classList.remove("hidden");
          return;
        } else {
          // Lỗi khác - thử fallback: query trực tiếp Firestore (nếu có quyền)
          try {
            console.log("Thử fallback: query Firestore trực tiếp");
            const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
            const q = query(usersRef, where("displayName", "==", input.trim()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              email = userData.email;
              console.log("Tìm thấy email từ Firestore (fallback):", email);
            } else {
              authMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
              authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
              authMessage.classList.remove("hidden");
              return;
            }
          } catch (fallbackError) {
            console.error("Fallback cũng thất bại:", fallbackError);
            authMessage.textContent = `Lỗi khi tìm tên đăng nhập: ${error.message || error.code || "Lỗi không xác định"}. Vui lòng sử dụng email để đăng nhập.`;
            authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
            authMessage.classList.remove("hidden");
            return;
          }
        }
      }
    }
    
    // Đăng nhập bằng email
    try {
      console.log("Đang đăng nhập với email:", email);
      await signInWithEmailAndPassword(auth, email, password);
      authMessage.classList.add("hidden");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      authMessage.textContent = `Lỗi đăng nhập: ${
        error.code === "auth/invalid-credential"
          ? "Tên đăng nhập/email hoặc mật khẩu không đúng."
          : error.message
      }`;
      authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
      authMessage.classList.remove("hidden");
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }

  function setupUIForLoggedInUser() {
    authSection.classList.add("hidden");
    appContainer.classList.remove("hidden");
    // KHÔNG được ẩn modal đổi mật khẩu ở đây
    // forceChangePasswordModal.style.display = "none"; // <-- XÓA DÒNG NÀY
    loggedInUserDisplay.textContent = currentUserProfile.displayName;
    dropdownUserName.textContent = currentUserProfile.displayName;
    dropdownUserRole.textContent = currentUserProfile.role;
    renderSidebarNav();
  }

  function setupUIForLoggedOutUser() {
    authSection.classList.remove("hidden");
    appContainer.classList.add("hidden");
    currentUserProfile = null;
  }

  function renderSidebarNav() {
    sidebarNav.innerHTML = "";
    
    // Không render sidebar nếu chưa đổi mật khẩu
    if (currentUserProfile && currentUserProfile.requiresPasswordChange) {
      return;
    }
    
    // Filter out myProfileView (it's now a modal, not a sidebar view)
    const filteredViews = (currentUserProfile.allowedViews || []).filter(
      (viewId) => viewId !== "myProfileView"
    );
    
    filteredViews.forEach((viewId) => {
      if (ALL_VIEWS[viewId]) {
        const button = document.createElement("button");
        button.className = "sidebar-nav-link w-full text-left p-3 rounded-md";
        button.dataset.view = viewId;
        const icons = {
          dashboardView: "fa-chart-line",
          attendanceView: "fa-user-clock",
          issueReportView: "fa-exclamation-triangle",
          issueHistoryView: "fa-history",
          myTasksView: "fa-tasks",
          manageAccountsView: "fa-users-cog",
          activityLogView: "fa-clipboard-list",
          myProfileView: "fa-user",
          manageShiftsView: "fa-calendar-alt",
          attendanceReportView: "fa-file-invoice",
        };
        button.innerHTML = `<i class="fas ${icons[viewId]} fa-fw mr-3"></i>${ALL_VIEWS[viewId]}`;
        button.addEventListener("click", () => showView(viewId));
        sidebarNav.appendChild(button);
      }
    });
  }

  function showInitialView() {
    const firstAllowedView =
      currentUserProfile.allowedViews[0] || "attendanceView";
    showView(firstAllowedView);
  }

  function showView(viewId) {
    // Ngăn chặn truy cập các view nếu chưa đổi mật khẩu
    if (currentUserProfile && currentUserProfile.requiresPasswordChange) {
      promptForcePasswordChange();
      return;
    }

    const viewTemplate = viewsContainer.querySelector(`#${viewId}`);
    mainContentContainer.innerHTML = viewTemplate
      ? viewTemplate.innerHTML
      : `<h2>${ALL_VIEWS[viewId] || "Trang không xác định"}</h2>`;
    document.querySelectorAll(".sidebar-nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewId);
    });
    const setupFunction = window[`setup_${viewId}`];
    if (typeof setupFunction === "function") {
      setupFunction();
    }

    if (window.innerWidth < 1024) {
      toggleMobileMenu(true);
    }
  }

  function toggleMobileMenu(forceClose = false) {
    const overlay = document.getElementById("sidebarOverlay");
    if (forceClose) {
      sidebar.classList.add("-translate-x-full");
      if (overlay) overlay.classList.add("hidden");
    } else {
      sidebar.classList.toggle("-translate-x-full");
      if (overlay) overlay.classList.toggle("hidden");
    }
  }

  // --- Notifications & Logging ---
  function listenToNotifications() {
    const q = query(
      collection(
        db,
        `/artifacts/${canvasAppId}/users/${currentUser.uid}/notifications`
      ),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        renderNotifications(notifications);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          console.warn("⚠️ Lỗi kết nối Firebase: Không thể tải thông báo. Ứng dụng sẽ hoạt động ở chế độ offline.");
        } else if (error.code === "permission-denied" || error.message?.includes("permissions")) {
          console.error("❌ Lỗi quyền truy cập khi tải thông báo:", error);
          console.warn("⚠️ Vui lòng cập nhật Firestore Security Rules để cho phép đọc notifications collection.");
          console.warn("   Xem hướng dẫn trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
        } else {
          console.error("Lỗi khi tải thông báo:", error);
        }
      }
    );
    unsubscribeListeners.push(unsubscribe);
  }

  function renderNotifications(notifications) {
    const unreadCount = notifications.filter((n) => !n.read).length;
    notificationBadge.textContent = unreadCount;
    notificationBadge.classList.toggle("show", unreadCount > 0);
    
    // Show/hide "Mark all as read" button
    const markAllReadBtn = document.getElementById("markAllReadBtn");
    if (markAllReadBtn) {
      if (unreadCount > 0) {
        markAllReadBtn.classList.remove("hidden");
      } else {
        markAllReadBtn.classList.add("hidden");
      }
    }
    
    notificationList.innerHTML =
      notifications.length === 0
        ? `<div class="p-4 text-center text-sm text-slate-500">Không có thông báo mới.</div>`
        : notifications
            .map((n) => {
              const timestamp = n.timestamp
                ? new Date(n.timestamp.toDate()).toLocaleString("vi-VN")
                : "Vừa xong";
              const hasIssueId = n.issueId ? `data-issue-id="${n.issueId}"` : "";
              const clickableClass = n.issueId ? "notification-clickable" : "";
              const readButton = !n.read 
                ? `<button class="mark-read-btn text-xs text-indigo-600 hover:text-indigo-700 ml-2" data-notification-id="${n.id}" title="Đánh dấu đã đọc">
                    <i class="fas fa-check"></i>
                   </button>`
                : "";
              return `<div class="notification-item p-3 hover:bg-slate-50 flex items-start justify-between ${
                clickableClass
              } ${n.read ? "" : "unread"}" ${hasIssueId} data-notification-id="${n.id}">
                <div class="flex-1 ${n.issueId ? "cursor-pointer" : ""}">
                  <p class="text-sm">${n.message}</p>
                  <p class="text-xs text-slate-400 mt-1">${timestamp}</p>
                </div>
                ${readButton}
              </div>`;
            })
            .join("");

    // Add click handlers for notifications with issueId
    notificationList.querySelectorAll(".notification-clickable").forEach((item) => {
      const clickableContent = item.querySelector(".flex-1");
      if (clickableContent) {
        clickableContent.addEventListener("click", async () => {
          const issueId = item.getAttribute("data-issue-id");
          const notificationId = item.getAttribute("data-notification-id");
          
          if (issueId) {
            // Mark as read
            if (notificationId && !item.classList.contains("read")) {
              await markNotificationAsRead(notificationId);
            }
            
            // Open issue detail modal
            openIssueDetailModal(issueId);
            
            // Close notification menu
            notificationMenu.classList.remove("show");
          }
        });
      }
    });

    // Add click handlers for mark as read buttons
    notificationList.querySelectorAll(".mark-read-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const notificationId = btn.getAttribute("data-notification-id");
        if (notificationId) {
          await markNotificationAsRead(notificationId);
          // Log to activity log
          await logActivity("Mark Notification as Read", { 
            notificationId: notificationId 
          });
        }
      });
    });
  }

  async function markAllNotificationsAsRead() {
    if (!currentUser) return;
    try {
      const notificationsCol = collection(
        db,
        `/artifacts/${canvasAppId}/users/${currentUser.uid}/notifications`
      );
      const q = query(notificationsCol, where("read", "==", false));
      const snapshot = await getDocs(q);
      
      const updatePromises = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(updatePromises);
      
      // Log to activity log
      await logActivity("Mark All Notifications as Read", { 
        count: snapshot.docs.length 
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }

  async function sendNotification(userId, message, issueId = null) {
    if (!userId) return;
    try {
      const notificationsCol = collection(
        db,
        `/artifacts/${canvasAppId}/users/${userId}/notifications`
      );
      const notificationData = {
        message: message,
        read: false,
        timestamp: serverTimestamp(),
      };
      if (issueId) {
        notificationData.issueId = issueId;
      }
      const docRef = await addDoc(notificationsCol, notificationData);
      
      // Log notification received to activity log for the recipient
      // We need to get the recipient's profile to log as them
      try {
        const recipientDoc = await getDoc(doc(db, `/artifacts/${canvasAppId}/users/${userId}`));
        if (recipientDoc.exists()) {
          const recipientProfile = recipientDoc.data();
          // Create a temporary activity log entry as the recipient
          const logCollection = collection(
            db,
            `/artifacts/${canvasAppId}/public/data/activityLogs`
          );
          await addDoc(logCollection, {
            action: "Received Notification",
            details: {
              message: message,
              notificationId: docRef.id,
              issueId: issueId || null,
            },
            timestamp: serverTimestamp(),
            actor: {
              uid: userId,
              email: recipientProfile.email || "",
              displayName: recipientProfile.displayName || "",
            },
          });
        }
      } catch (logError) {
        console.warn("Could not log notification received to activity log:", logError);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  async function markNotificationAsRead(notificationId) {
    if (!notificationId || !currentUser) return;
    try {
      const notificationRef = doc(
        db,
        `/artifacts/${canvasAppId}/users/${currentUser.uid}/notifications/${notificationId}`
      );
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function logActivity(action, details = {}) {
    try {
      if (!currentUserProfile) return;
      const logCollection = collection(
        db,
        `/artifacts/${canvasAppId}/public/data/activityLogs`
      );
      await addDoc(logCollection, {
        action,
        details,
        timestamp: serverTimestamp(),
        actor: {
          uid: currentUser?.uid,
          email: currentUser?.email,
          displayName: currentUserProfile?.displayName,
        },
      });
    } catch (error) {
      if (error.code === "permission-denied" || error.message?.includes("permissions")) {
        console.warn(
          `⚠️ Không thể ghi activity log (lỗi quyền truy cập): ${error.message}`
        );
        console.warn("   Vui lòng cập nhật Firestore Security Rules để cho phép ghi activityLogs collection.");
        console.warn("   Xem hướng dẫn trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
      } else {
        console.warn(
          `⚠️ Không thể ghi activity log: ${error.message}`
        );
      }
    }
  }

  // --- Data Queries ---
  function getScopedIssuesQuery() {
    let q = collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`);
    // Chỉ filter cho role "Chi nhánh" - chỉ xem báo cáo của chi nhánh đó
    if (currentUserProfile.role === "Chi nhánh") {
      const userBranch = currentUserProfile.branch;
      if (userBranch) {
        q = query(q, where("issueBranch", "==", userBranch));
      } else {
        // Nếu không có branch, trả về empty result
        return query(q, where("issueBranch", "==", "__NO_BRANCH_ASSIGNED__"));
      }
    }
    // Admin, Manager, Nhân viên: xem tất cả (không filter)
    return q;
  }

  // --- View Setup Functions ---
  window.setup_attendanceView = function () {
    if (!currentUserProfile) return;
    mainContentContainer.querySelector("#employeeName").value =
      currentUserProfile.displayName;
    mainContentContainer
      .querySelector("#checkInBtn")
      .addEventListener("click", () => handleAttendance("Check-In"));
    mainContentContainer
      .querySelector("#checkOutBtn")
      .addEventListener("click", () => handleAttendance("Check-Out"));
    listenToAttendance();
  };

  /**
   * Setup Quản Lý Ca Làm Việc view (Admin only)
   */
  window.setup_manageShiftsView = function () {
    if (!currentUserProfile || currentUserProfile.role !== "Admin") return;

    // Initialize default shifts if none exist
    initializeDefaultShifts().then(() => {
      // Load shifts and populate dropdowns
      loadShifts();
      loadEmployeesForShiftAssignment();
    });

    // Create shift button
    const createShiftBtn = mainContentContainer.querySelector("#createShiftBtn");
    if (createShiftBtn) {
      createShiftBtn.addEventListener("click", handleCreateShift);
    }

    // Assign shift button
    const assignShiftBtn = mainContentContainer.querySelector("#assignShiftBtn");
    if (assignShiftBtn) {
      assignShiftBtn.addEventListener("click", handleAssignShift);
    }
  };

  /**
   * Setup Bảng Chấm Công view (Admin & Manager)
   */
  window.setup_attendanceReportView = function () {
    if (!currentUserProfile) return;
    if (currentUserProfile.role !== "Admin" && currentUserProfile.role !== "Manager") return;

    // Set default month to current month
    const monthInput = mainContentContainer.querySelector("#attendanceReportMonth");
    if (monthInput) {
      const now = new Date();
      monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    // Load employees for filter
    loadEmployeesForAttendanceReport();

    // Generate report button
    const generateBtn = mainContentContainer.querySelector("#generateAttendanceReportBtn");
    if (generateBtn) {
      generateBtn.addEventListener("click", generateAttendanceReport);
    }

    // Export button
    const exportBtn = mainContentContainer.querySelector("#exportAttendanceReportBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", handleExportAttendanceReport);
    }
  };

  window.setup_manageAccountsView = function () {
    if (!currentUserProfile) return;

    // --- THÊM MỚI: Xóa trống các trường input để tránh autocomplete của trình duyệt ---
    const emailInput = mainContentContainer.querySelector("#createAccountEmail");
    const passwordInput = mainContentContainer.querySelector("#createAccountPassword");
    const usernameInput = mainContentContainer.querySelector("#createAccountUsername");
    const employeeIdInput = mainContentContainer.querySelector("#createAccountEmployeeId");

    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
    if (usernameInput) usernameInput.value = "";
    if (employeeIdInput) employeeIdInput.value = "";
    // --- KẾT THÚC THÊM MỚI ---

    accountsCurrentPage = 1; // Reset page
    // --- BỔ SUNG LOGIC CHO FORM TẠO TÀI KHOẢN MỚI ---
    const createRoleSelect =
      mainContentContainer.querySelector("#createAccountRole");
    const employeeIdContainer = mainContentContainer.querySelector(
      "#createAccountEmployeeIdContainer"
    );

    if (createRoleSelect && employeeIdContainer) {
      // 1. Điền các vai trò vào dropdown (lấy từ hằng số ROLES đã có)
      createRoleSelect.innerHTML = ROLES.map(
        (r) =>
          `<option value="${r}" ${
            r === "Nhân viên" ? "selected" : ""
          }>${r}</option>`
      ).join("");

      // 2. Populate branch dropdown
      const branchContainer = mainContentContainer.querySelector("#createAccountBranchContainer");
      const branchSelect = mainContentContainer.querySelector("#createAccountBranch");
      if (branchSelect) {
        branchSelect.innerHTML = '<option value="">-- Chọn chi nhánh --</option>' + 
          ALL_BRANCHES.map(b => `<option value="${b}">${b}</option>`).join("");
      }

      // 3. Hàm ẩn/hiện MSNV và Branch
      const toggleEmployeeFields = () => {
        const selectedRole = createRoleSelect.value;
        if (selectedRole === "Chi nhánh") {
          employeeIdContainer.classList.add("hidden");
          if (branchContainer) branchContainer.classList.add("hidden");
        } else if (selectedRole === "Nhân viên") {
          employeeIdContainer.classList.remove("hidden");
          if (branchContainer) branchContainer.classList.remove("hidden");
        } else {
          employeeIdContainer.classList.remove("hidden");
          if (branchContainer) branchContainer.classList.add("hidden");
        }
      };

      // 4. Gắn event listener
      createRoleSelect.addEventListener("change", toggleEmployeeFields);

      // 5. Chạy 1 lần lúc ban đầu để set trạng thái đúng
      toggleEmployeeFields();
    }
    // --- KẾT THÚC BỔ SUNG ---
    mainContentContainer
      .querySelector("#createAccountBtn")
      .addEventListener("click", handleCreateAccount);
    mainContentContainer
      .querySelector("#importExcelBtn")
      .addEventListener("click", handleExcelImport);
    mainContentContainer
      .querySelector("#downloadTemplateBtn")
      .addEventListener("click", handleDownloadTemplate);
    const showDisabledToggle = mainContentContainer.querySelector(
      "#showDisabledAccountsToggle"
    );
    showDisabledToggle.checked = showDisabledAccounts;

    showDisabledToggle.addEventListener("change", () => {
      showDisabledAccounts = showDisabledToggle.checked;
      accountsCurrentPage = 1;
      loadAccountsPage(true); // Reload from server when toggling
    });

    // Search input event listener
    const accountSearchInput = mainContentContainer.querySelector("#accountSearchInput");
    if (accountSearchInput) {
      accountSearchInput.value = accountsSearchTerm; // Restore previous search term
      let searchTimeout;
      accountSearchInput.addEventListener("input", async (e) => {
        accountsSearchTerm = e.target.value.trim().toLowerCase();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // If there's a search term, load all users for search
        if (accountsSearchTerm) {
          // Show loading state immediately
          const tableBody = mainContentContainer.querySelector("#accountsTableBody");
          if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4">Đang tìm kiếm...</td></tr>`;
          }
          
          // Debounce search to avoid too many requests
          searchTimeout = setTimeout(async () => {
            try {
              // Load all users for search (without pagination)
              const allUsersQuery = query(
                collection(db, `/artifacts/${canvasAppId}/users`),
                orderBy("displayName")
              );
              const allUsersSnapshot = await getDocs(allUsersQuery);
              const allUsers = allUsersSnapshot.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data(),
              }));
              
              // Store unfiltered cache for count display
              allUsersCacheUnfiltered = allUsers;
              
              // Filter disabled accounts if needed
              if (!showDisabledAccounts) {
                allUsersCache = allUsers.filter((user) => user.status !== "disabled" && !user.disabled);
              } else {
                allUsersCache = allUsers;
              }
              
              // Re-render table with search filter
              renderAccountsTable(allUsersCache);
            } catch (error) {
              console.error("Error loading users for search:", error);
              if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Lỗi tìm kiếm: ${error.message}</td></tr>`;
              }
              // Fallback to current cache
              renderAccountsTable(allUsersCache);
            }
          }, 300); // 300ms debounce
        } else {
          // If search is cleared, reload with pagination
          accountsCurrentPage = 1;
          loadAccountsPage(true);
        }
      });
    }

    // Export all accounts button
    const exportAllAccountsBtn = mainContentContainer.querySelector(
      "#exportAllAccountsBtn"
    );
    if (exportAllAccountsBtn) {
      exportAllAccountsBtn.addEventListener("click", handleExportAllAccounts);
    }

    const exportAllBtn = mainContentContainer.querySelector(
      "#exportAllAttendanceBtn"
    );
    if (
      currentUserProfile.role === "Admin" ||
      currentUserProfile.role === "Manager"
    ) {
      exportAllBtn.classList.remove("hidden");
      exportAllBtn.addEventListener("click", handleExportAllAttendance);
    }

    if (currentUserProfile.role === "Admin") {
      const adminSettingsCard =
        mainContentContainer.querySelector("#adminSettingsCard");
      if (adminSettingsCard) {
        adminSettingsCard.classList.remove("hidden");
        mainContentContainer
          .querySelector("#saveSettingsBtn")
          .addEventListener("click", handleSaveSettings);
        fetchAndDisplaySettings();
      }
    }

    // Load initial page with server-side pagination
    loadAccountsPage(true);
  };

  /**
   * Loads accounts page with server-side pagination
   * @param {boolean} resetPage - Whether to reset to page 1
   * @param {boolean} loadNext - Whether to load next page
   */
  async function loadAccountsPage(resetPage = false, loadNext = false) {
    const tableBody = mainContentContainer.querySelector("#accountsTableBody");
    if (!tableBody) return;

    if (resetPage) {
      accountsCurrentPage = 1;
      accountsLastVisible = null;
      allUsersCache = [];
      allUsersCacheUnfiltered = [];
    }

    // Show loading state
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4">Đang tải...</td></tr>`;
    
    // Update count display to show loading
    const countTextEl = mainContentContainer.querySelector("#accountsCountText");
    if (countTextEl) {
      countTextEl.textContent = "Đang tải...";
    }

    try {
      // Get total count of all users (only when resetPage, to avoid unnecessary queries)
      if (resetPage) {
        // Get total count query (without pagination) - only on first load
        const countQuery = query(collection(db, `/artifacts/${canvasAppId}/users`), orderBy("displayName"));
        const countSnapshot = await getDocs(countQuery);
        const allUsersForCount = countSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        
        // Store total count
        allUsersCacheUnfiltered = allUsersForCount;
      }
      
      // Build query for paginated results
      let q = query(collection(db, `/artifacts/${canvasAppId}/users`));
      
      // Note: Firestore doesn't have a direct "disabled" field check
      // We'll filter client-side for disabled accounts
      
      // Add ordering and pagination
      q = query(q, orderBy("displayName"), limit(ITEMS_PER_PAGE));

      // Add startAfter for pagination
      if (loadNext && accountsLastVisible) {
        q = query(q, startAfter(accountsLastVisible));
      }

      // Execute query
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

      // Note: allUsersCacheUnfiltered is already set when resetPage, don't update it on loadNext

      // Filter disabled accounts client-side
      let filteredUsers = users;
      if (!showDisabledAccounts) {
        filteredUsers = users.filter((user) => user.status !== "disabled" && !user.disabled);
      }

      // Update filtered cache and state
      if (resetPage) {
        allUsersCache = filteredUsers;
      } else if (loadNext) {
        allUsersCache = [...allUsersCache, ...filteredUsers];
      } else {
        allUsersCache = filteredUsers;
      }

      // Update pagination state
      accountsLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      accountsHasMore = snapshot.docs.length === ITEMS_PER_PAGE;

      // Update UI
      renderAccountsTable(allUsersCache);
    } catch (error) {
      console.error("Error loading accounts:", error);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
      
      // Update count display to show error
      const countTextEl = mainContentContainer.querySelector("#accountsCountText");
      if (countTextEl) {
        countTextEl.textContent = "Lỗi tải dữ liệu";
      }
    }
  }

  window.setup_dashboardView = function () {
    if (!currentUserProfile) return;

    const tabContainer = mainContentContainer.querySelector("#dashboardTabs");
    const tabContentContainer = mainContentContainer.querySelector(
      "#dashboardTabContent"
    );

    // Define tabs and their content
    const tabs = {
      overview: {
        title: "Tổng quan",
        content: `
                  <div id="dashboardWarnings" class="space-y-4 mb-6">
                      <div id="dailySpikeWarning" class="hidden"></div>
                      <div id="backlogWarning" class="hidden"></div>
                  </div>
                  <div class="card p-4">
                      <h3 class="font-semibold text-slate-800 mb-3">Bộ lọc nâng cao</h3>
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          <div><label for="filterBranch" class="text-sm font-medium text-slate-600">Chi nhánh</label><select id="filterBranch" class="select-field text-sm mt-1"><option value="">Tất cả</option></select></div>
                          <div><label for="filterIssueType" class="text-sm font-medium text-slate-600">Loại sự cố</label><select id="filterIssueType" class="select-field text-sm mt-1"><option value="">Tất cả</option></select></div>
                          <div><label for="filterEmployee" class="text-sm font-medium text-slate-600">Nhân viên</label><select id="filterEmployee" class="select-field text-sm mt-1"><option value="">Tất cả</option></select></div>
                          <div><label for="filterStartDate" class="text-sm font-medium text-slate-600">Từ ngày</label><input type="date" id="filterStartDate" class="input-field text-sm mt-1"></div>
                          <div><label for="filterEndDate" class="text-sm font-medium text-slate-600">Đến ngày</label><input type="date" id="filterEndDate" class="input-field text-sm mt-1"></div>
                          <div class="flex items-end space-x-2"><button id="applyFiltersBtn" class="btn-primary flex-grow">Lọc</button><button id="resetFiltersBtn" class="btn-secondary"><i class="fas fa-undo"></i></button></div>
                      </div>
                      <div class="mt-3 flex flex-wrap items-center gap-2">
                          <span class="text-sm font-medium text-slate-600">Lọc nhanh:</span>
                          <button id="quickFilterToday" class="btn-secondary text-sm px-3 py-1.5">
                              <i class="fas fa-calendar-day mr-1.5"></i>Hôm nay
                          </button>
                          <button id="quickFilter7Days" class="btn-secondary text-sm px-3 py-1.5">
                              <i class="fas fa-calendar-week mr-1.5"></i>7 ngày qua
                          </button>
                          <button id="quickFilter30Days" class="btn-secondary text-sm px-3 py-1.5">
                              <i class="fas fa-calendar-alt mr-1.5"></i>30 ngày qua
                          </button>
                      </div>
                  </div>
                  
                  <div class="mt-6">
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Phân Tích So Sánh (Số Lượng Sự Cố)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div id="compareWeek" class="card p-5"></div>
                      <div id="compareMonth" class="card p-5"></div>
                      <div id="compareYear" class="card p-5"></div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <div class="card p-5"><p class="text-sm text-slate-500">Lỗi Phát Sinh Hôm Nay</p><p id="errorsToday" class="text-3xl font-bold">0</p></div>
                    <div class="card p-5"><p class="text-sm text-slate-500">Lỗi Trong Tuần Này</p><p id="errorsThisWeek" class="text-3xl font-bold">0</p></div>
                    <div class="card p-5"><p class="text-sm text-slate-500">Lỗi Trong Tháng Này</p><p id="errorsThisMonth" class="text-3xl font-bold">0</p></div>
                  </div>`,
      },
      analysis: {
        title: "Phân tích Lỗi",
        content: `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-1 card p-6"><h3 class="font-semibold mb-4">Phân Loại Lỗi</h3><div class="h-64"><canvas id="issueTypePieChart" class="clickable-chart"></canvas></div></div><div class="lg:col-span-2 card p-6"><h3 class="font-semibold mb-4">Trạng Thái Xử Lý</h3><div id="statusSummary" class="space-y-3"></div></div></div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div class="card p-6">
                                <h3 class="font-semibold mb-4">Phân Tích Phạm Vi Sự Cố</h3>
                                <div class="h-72"><canvas id="scopeAnalysisChart"></canvas></div>
                            </div>
                            <div class="card p-6">
                                <h3 class="font-semibold mb-4">Top 10 Phòng Có Nhiều Sự Cố Nhất</h3>
                                <div id="problematicRoomsTableContainer" class="max-h-72 overflow-y-auto"></div>
                            </div>
                        </div>`,
      },
      trends: {
        title: "Xu hướng & Mật độ",
        content: `<div class="space-y-6"><div class="card p-6"><h3 class="font-semibold text-slate-800 mb-4">Xu Hướng Sự Cố Theo Thời Gian</h3><div class="h-80"><canvas id="incidentTrendChart"></canvas></div></div><div class="card p-6"><h3 class="font-semibold text-slate-800 mb-4">Mật Độ Sự Cố (Giờ trong ngày vs Ngày trong tuần)</h3><div id="incidentHeatmapContainer" class="heatmap-container mt-4 overflow-x-auto"></div></div></div>`,
      },
      performance: {
        title: "Hiệu suất",
        content: `
                  <div class="card p-6">
                      <div class="flex flex-wrap justify-center items-center gap-2 bg-slate-100 p-1 rounded-lg w-full mx-auto mb-6">
                          <button id="perfTabToggleEmployee" class="perf-tab-toggle flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors bg-white text-indigo-600 shadow">
                              <i class="fas fa-user-cog mr-2"></i>Hiệu suất Xử lý
                          </button>
                          <button id="perfTabToggleManager" class="perf-tab-toggle flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors text-slate-600">
                              <i class="fas fa-user-tie mr-2"></i>Hiệu suất Giao việc
                          </button>
                          <button id="perfTabToggleBranch" class="perf-tab-toggle flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors text-slate-600">
                              <i class="fas fa-building mr-2"></i>Hiệu suất Chi nhánh
                          </button>
                      </div>
                      <div id="employeePerformanceContent">
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Tỷ lệ hoàn thành đúng hạn TB</p><p id="avgOnTimeRate" class="text-3xl font-bold">0%</p></div>
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Thời gian xử lý TB</p><p id="avgProcessingTime" class="text-3xl font-bold">0 giờ</p></div>
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Top nhân viên</p><p id="topPerformer" class="text-3xl font-bold truncate">N/A</p></div>
                          </div>
                          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                              <div class="lg:col-span-2">
                                  <h4 class="font-semibold text-slate-700 mb-2 text-center">Top 5 Nhân viên (theo số sự cố đã giải quyết)</h4>
                                  <div class="h-80"><canvas id="topEmployeesChart"></canvas></div>
                              </div>
                              <div class="lg:col-span-3">
                                  <h4 class="font-semibold text-slate-700 mb-2">Chi tiết hiệu suất nhân viên</h4>
                                  <div class="max-h-80 overflow-y-auto">
                                      <table class="min-w-full responsive-table">
                                          <thead class="bg-slate-100 sticky top-0">
                                              <tr>
                                                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Nhân viên</th>
                                                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Đã xử lý / Được giao</th>
                                                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Thời gian xử lý TB (giờ)</th>
                                                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Đúng hạn</th>
                                              </tr>
                                          </thead>
                                          <tbody id="employeePerformanceTableBody" class="bg-white divide-y divide-slate-200"></tbody>
                                      </table>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div id="managerPerformanceContent" class="hidden">
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Thời gian giao việc TB</p><p id="avgAssignmentTime" class="text-3xl font-bold">0 giờ</p></div>
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Tỷ lệ giải quyết thành công</p><p id="overallSuccessRate" class="text-3xl font-bold">0%</p></div>
                              <div class="card p-4 bg-slate-50"><p class="text-sm text-slate-500">Tổng số lần Escalated</p><p id="totalEscalations" class="text-3xl font-bold text-red-500">0</p></div>
                          </div>
                          <div>
                              <h4 class="font-semibold text-slate-700 mb-2">Chi tiết hiệu suất giao việc</h4>
                              <div class="max-h-96 overflow-y-auto">
                                  <table class="min-w-full responsive-table">
                                      <thead class="bg-slate-100 sticky top-0">
                                          <tr>
                                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Quản lý</th>
                                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Tổng sự cố đã giao</th>
                                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Tỷ lệ thành công</th>
                                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Thời gian giao việc TB (giờ)</th>
                                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Số lần Escalated</th>
                                          </tr>
                                      </thead>
                                      <tbody id="managerPerformanceTableBody" class="bg-white divide-y divide-slate-200"></tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                      <div id="branchPerformanceContent" class="hidden">
                          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                  <h4 class="font-semibold text-slate-700 text-center mb-2">Số Lượng Sự Cố Theo Trạng Thái</h4>
                                  <div class="h-80"><canvas id="branchStatusChart" class="clickable-chart"></canvas></div>
                              </div>
                              <div>
                                  <h4 class="font-semibold text-slate-700 text-center mb-2">Thời Gian Xử Lý Trung Bình (giờ)</h4>
                                  <div class="h-80"><canvas id="branchTimeChart" class="clickable-chart"></canvas></div>
                              </div>
                          </div>
                      </div>
                  </div>`,
      },
      predictive: {
        title: "Bảo trì Dự đoán",
        content: `<div class="card p-6"><h3 class="font-semibold text-slate-800 mb-4">Dự Báo Bảo Trì</h3><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><h4 class="font-semibold text-slate-700 mb-2">Hạng mục Rủi ro Cao nhất</h4><div id="pdmSummaryStats" class="flex justify-around text-center mb-4 p-4 bg-slate-50 rounded-lg"></div><div class="h-80"><canvas id="pdmRiskChart"></canvas></div></div><div class="lg:col-span-1"><h4 class="font-semibold text-slate-700 mb-2">Danh sách Chi tiết</h4><div class="table-responsive max-h-96 overflow-y-auto"><table class="min-w-full responsive-table"><thead class="bg-slate-50 sticky top-0"><tr><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Hạng mục</th><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Rủi Ro</th></tr></thead><tbody id="pdmTableBody" class="bg-white divide-y divide-slate-200"></tbody></table></div></div></div></div>`,
      },
      locationAnalysis: {
        title: "Phân tích Vị trí",
        content: `
              <div class="card p-6">
                  <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                      <h3 id="locationAnalysisTitle" class="text-xl font-bold text-slate-800">Tổng quan lỗi toàn hệ thống</h3>
                      <div>
                          <label for="locationBranchFilter" class="text-sm font-medium mr-2">Chọn chi nhánh:</label>
                          <select id="locationBranchFilter" class="select-field w-full sm:w-64"></select>
                      </div>
                  </div>

                  <div id="locationDashboardContent">
                      </div>
              </div>
          `,
      },
    };

    // Clear existing content and build tabs
    tabContainer.innerHTML = "";
    tabContentContainer.innerHTML = "";

    Object.keys(tabs).forEach((key, index) => {
      const tab = tabs[key];
      // Create tab button
      const button = document.createElement("button");
      button.dataset.tabTarget = key;
      button.className =
        index === 0
          ? "dashboard-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-indigo-600 border-indigo-500"
          : "dashboard-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300";
      button.textContent = tab.title;
      tabContainer.appendChild(button);

      // Create tab panel
      const panel = document.createElement("div");
      panel.id = `tab-panel-${key}`;
      panel.className = "dashboard-tab-panel" + (index > 0 ? " hidden" : "");
      panel.innerHTML = tab.content;
      tabContentContainer.appendChild(panel);
    });

    // Add tab switching logic
    const tabButtons = mainContentContainer.querySelectorAll(".dashboard-tab");
    const tabPanels = mainContentContainer.querySelectorAll(
      ".dashboard-tab-panel"
    );

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetPanelId = `tab-panel-${button.dataset.tabTarget}`;

        tabPanels.forEach((panel) => {
          panel.classList.toggle("hidden", panel.id !== targetPanelId);
        });

        tabButtons.forEach((btn) => {
          const isTarget = btn.dataset.tabTarget === button.dataset.tabTarget;
          btn.classList.toggle("text-indigo-600", isTarget);
          btn.classList.toggle("border-indigo-500", isTarget);
          btn.classList.toggle("text-slate-500", !isTarget);
          btn.classList.toggle("border-transparent", !isTarget);
          btn.classList.toggle("hover:text-slate-700", !isTarget);
          btn.classList.toggle("hover:border-slate-300", !isTarget);
        });
      });
    });

    // Re-populate and re-bind listeners for filters and performance toggles
    const branchFilter = mainContentContainer.querySelector("#filterBranch");
    const issueTypeFilter =
      mainContentContainer.querySelector("#filterIssueType");
    const employeeFilter = mainContentContainer.querySelector("#filterEmployee");

    branchFilter.innerHTML =
      '<option value="">Tất cả chi nhánh</option>' +
      ALL_BRANCHES.map((b) => `<option value="${b}">${b}</option>`).join("");
    issueTypeFilter.innerHTML =
      '<option value="">Tất cả loại sự cố</option>' +
      ISSUE_TYPES.map((t) => `<option value="${t}">${t}</option>`).join("");

    const usersQuery = query(collection(db, `/artifacts/${canvasAppId}/users`));
    getDocs(usersQuery).then((snapshot) => {
      const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      employeeFilter.innerHTML =
        '<option value="">Tất cả nhân viên</option>' +
        users
          .map((u) => `<option value="${u.uid}">${u.displayName}</option>`)
          .join("");
    });

    mainContentContainer
      .querySelector("#applyFiltersBtn")
      .addEventListener("click", () => {
        loadDashboardWithFilters();
      });
    mainContentContainer
      .querySelector("#resetFiltersBtn")
      .addEventListener("click", () => {
        mainContentContainer.querySelector("#filterBranch").value = "";
        mainContentContainer.querySelector("#filterIssueType").value = "";
        mainContentContainer.querySelector("#filterEmployee").value = "";
        mainContentContainer.querySelector("#filterStartDate").value = "";
        mainContentContainer.querySelector("#filterEndDate").value = "";
        applyFiltersAndRender(dashboardReportsCache);
      });

    // Quick Date Filter Buttons
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Today filter
    mainContentContainer
      .querySelector("#quickFilterToday")
      .addEventListener("click", () => {
        const today = new Date();
        const startDateInput = mainContentContainer.querySelector("#filterStartDate");
        const endDateInput = mainContentContainer.querySelector("#filterEndDate");
        if (startDateInput && endDateInput) {
          startDateInput.value = formatDateForInput(today);
          endDateInput.value = formatDateForInput(today);
          loadDashboardWithFilters();
        }
      });

    // 7 days ago filter
    mainContentContainer
      .querySelector("#quickFilter7Days")
      .addEventListener("click", () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const startDateInput = mainContentContainer.querySelector("#filterStartDate");
        const endDateInput = mainContentContainer.querySelector("#filterEndDate");
        if (startDateInput && endDateInput) {
          startDateInput.value = formatDateForInput(sevenDaysAgo);
          endDateInput.value = formatDateForInput(today);
          loadDashboardWithFilters();
        }
      });

    // 30 days ago filter
    mainContentContainer
      .querySelector("#quickFilter30Days")
      .addEventListener("click", () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const startDateInput = mainContentContainer.querySelector("#filterStartDate");
        const endDateInput = mainContentContainer.querySelector("#filterEndDate");
        if (startDateInput && endDateInput) {
          startDateInput.value = formatDateForInput(thirtyDaysAgo);
          endDateInput.value = formatDateForInput(today);
          loadDashboardWithFilters();
        }
      });

    // Performance Sub-tab logic
    const perfToggleEmployee = mainContentContainer.querySelector(
      "#perfTabToggleEmployee"
    );
    const perfToggleManager = mainContentContainer.querySelector(
      "#perfTabToggleManager"
    );
    const perfToggleBranch = mainContentContainer.querySelector(
      "#perfTabToggleBranch"
    );
    const employeeContent = mainContentContainer.querySelector(
      "#employeePerformanceContent"
    );
    const managerContent = mainContentContainer.querySelector(
      "#managerPerformanceContent"
    );
    const branchContent = mainContentContainer.querySelector(
      "#branchPerformanceContent"
    );

    const updatePerfTabStyles = (activeTab) => {
      const tabs = [
        { button: perfToggleEmployee, content: employeeContent },
        { button: perfToggleManager, content: managerContent },
        { button: perfToggleBranch, content: branchContent },
      ];
      tabs.forEach((tab) => {
        const isActive = tab.button === activeTab;
        tab.button.classList.toggle("bg-white", isActive);
        tab.button.classList.toggle("text-indigo-600", isActive);
        tab.button.classList.toggle("shadow", isActive);
        tab.button.classList.toggle("text-slate-600", !isActive);
        tab.content.classList.toggle("hidden", !isActive);
      });
    };

    if (perfToggleEmployee) {
      perfToggleEmployee.addEventListener("click", () =>
        updatePerfTabStyles(perfToggleEmployee)
      );
    }
    if (perfToggleManager) {
      perfToggleManager.addEventListener("click", () =>
        updatePerfTabStyles(perfToggleManager)
      );
    }
    if (perfToggleBranch) {
      perfToggleBranch.addEventListener("click", () =>
        updatePerfTabStyles(perfToggleBranch)
      );
    }

    // Try to load aggregated data first (optimized path)
    loadDashboardAggregatedData();
  };

  /**
   * Loads dashboard data from aggregated document (optimized)
   * Falls back to loading all reports if aggregated data is not available
   */
  async function loadDashboardAggregatedData() {
    try {
      // Try to get aggregated data
      const aggregationDocRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/dashboardAggregation/main`
      );
      const aggregationDoc = await getDoc(aggregationDocRef);

      if (aggregationDoc.exists()) {
        const aggregatedData = aggregationDoc.data();
        console.log("Using aggregated dashboard data");

        // Use aggregated data for initial render
        renderDashboardFromAggregatedData(aggregatedData);

        // Set up real-time listener for aggregated data updates
        const unsubscribe = onSnapshot(
          aggregationDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              renderDashboardFromAggregatedData(snapshot.data());
            }
          },
          (error) => {
            // Xử lý các loại lỗi kết nối Firebase
            if (error.code === 'unavailable' || error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
              console.warn("⚠️ Lỗi kết nối Firebase: Không thể kết nối đến Firestore. Đang thử lại...");
            } else {
              console.error("Lỗi khi lắng nghe dữ liệu đã tổng hợp:", error);
            }
            // Fallback to loading all reports
            loadDashboardAllReports();
          }
        );
        unsubscribeListeners.push(unsubscribe);

        // For filtering, we still need to load reports (but can be optimized later)
        // For now, load reports in background for filtering functionality
        loadDashboardReportsForFiltering();
      } else {
        console.log("Không tìm thấy dữ liệu đã tổng hợp, đang tải tất cả báo cáo (fallback)");
        // Fallback: load all reports if aggregated data doesn't exist
        loadDashboardAllReports();
      }
    } catch (error) {
      console.error("Error loading aggregated data:", error);
      // Fallback to loading all reports
      loadDashboardAllReports();
    }
  }

  /**
   * Loads all reports for dashboard (fallback method)
   * This is used when aggregated data is not available
   */
  function loadDashboardAllReports() {
    const q = getScopedIssuesQuery();
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        dashboardReportsCache = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        applyFiltersAndRender(dashboardReportsCache);
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          console.warn("⚠️ Lỗi kết nối Firebase: Không thể kết nối đến Firestore. Ứng dụng sẽ hoạt động ở chế độ offline.");
        } else {
          console.error("Lỗi listener dashboard:", error);
        }
      }
    );

    unsubscribeListeners.push(unsubscribe);
  }

  /**
   * Loads reports for filtering purposes (can be paginated later)
   * This is a lighter load than loading everything
   */
  function loadDashboardReportsForFiltering() {
    // For now, load a limited set for filtering
    // Can be optimized to load only when filters are applied
    const q = query(
      getScopedIssuesQuery(),
      orderBy("reportDate", "desc"),
      limit(1000) // Limit to recent 1000 reports for filtering
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        dashboardReportsCache = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Don't auto-render, wait for filter application
      },
      (error) => {
        if (error.code === 'unavailable' || error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          console.warn("⚠️ Lỗi kết nối Firebase: Không thể tải dữ liệu lọc. Ứng dụng sẽ hoạt động ở chế độ offline.");
        } else {
          console.error("Lỗi listener dữ liệu lọc dashboard:", error);
        }
      }
    );

    unsubscribeListeners.push(unsubscribe);
  }

  /**
   * Renders dashboard using aggregated data
   * @param {Object} aggregatedData - The aggregated statistics from Firestore
   */
  function renderDashboardFromAggregatedData(aggregatedData) {
    // Update quick stats
    const errorsTodayEl = document.getElementById("errorsToday");
    const errorsThisWeekEl = document.getElementById("errorsThisWeek");
    const errorsThisMonthEl = document.getElementById("errorsThisMonth");

    if (errorsTodayEl) errorsTodayEl.textContent = aggregatedData.errorsToday || 0;
    if (errorsThisWeekEl) errorsThisWeekEl.textContent = aggregatedData.errorsThisWeek || 0;
    if (errorsThisMonthEl) errorsThisMonthEl.textContent = aggregatedData.errorsThisMonth || 0;

    // Render charts from aggregated data
    if (aggregatedData.typeCounts) {
      renderIssueTypePieChart(aggregatedData.typeCounts);
    }

    if (aggregatedData.statusCounts) {
      renderStatusSummary(
        aggregatedData.statusCounts,
        aggregatedData.totalReports || 0
      );
    }

    // Update comparative analysis
    if (aggregatedData.comparative) {
      renderComparisonCard(
        "compareWeek",
        "Tuần Này vs Tuần Trước",
        aggregatedData.comparative.thisWeek || 0,
        aggregatedData.comparative.lastWeek || 0
      );
      renderComparisonCard(
        "compareMonth",
        "Tháng Này vs Tháng Trước",
        aggregatedData.comparative.thisMonth || 0,
        aggregatedData.comparative.lastMonth || 0
      );
      renderComparisonCard(
        "compareYear",
        "Năm Này vs Năm Trước",
        aggregatedData.comparative.thisYear || 0,
        aggregatedData.comparative.lastYear || 0
      );
    }

    // Update warnings
    if (aggregatedData.employeeBacklog || aggregatedData.branchBacklog) {
      updateDashboardWarningsFromAggregated(aggregatedData);
    }

    // Render trend chart if available
    if (aggregatedData.trendData) {
      renderIncidentTrendChartFromAggregated(aggregatedData.trendData);
    }

    // Render heatmap if available
    if (aggregatedData.heatmapData) {
      renderIncidentHeatmapFromAggregated(aggregatedData.heatmapData);
    }

    // Render scope analysis if available
    if (aggregatedData.scopeAnalysis) {
      renderScopeAnalysisFromAggregated(aggregatedData.scopeAnalysis);
    }

    // Note: Performance analysis (employee, manager, branch) still needs full data
    // These can be added to aggregation later if needed
  }

  /**
   * Updates dashboard warnings from aggregated data
   */
  function updateDashboardWarningsFromAggregated(aggregatedData) {
    const dailySpikeEl = document.getElementById("dailySpikeWarning");
    const backlogEl = document.getElementById("backlogWarning");

    if (!dailySpikeEl || !backlogEl) return;

    // Daily spike warning (simplified - can be enhanced)
    const errorsToday = aggregatedData.errorsToday || 0;
    const avgDaily = aggregatedData.totalReports
      ? Math.round(aggregatedData.totalReports / 30)
      : 0;
    const spikeThreshold = avgDaily * 2;

    if (errorsToday > spikeThreshold && errorsToday > 10) {
      dailySpikeEl.className =
        "alert-warning p-4 rounded-lg flex items-start";
      dailySpikeEl.innerHTML = `
              <i class="fas fa-exclamation-triangle fa-lg mr-3 mt-1"></i>
              <div>
                  <h4 class="font-bold">Cảnh báo: Sự cố tăng đột biến hôm nay</h4>
                  <p class="text-sm mt-1">Hôm nay có <strong>${errorsToday}</strong> sự cố được báo cáo, cao hơn mức trung bình (${avgDaily}/ngày).</p>
              </div>
          `;
      dailySpikeEl.classList.remove("hidden");
    } else {
      dailySpikeEl.classList.add("hidden");
    }

    // Backlog warning
    const EMPLOYEE_BACKLOG_THRESHOLD = 5;
    const BRANCH_BACKLOG_THRESHOLD = 10;

    const highBacklogEmployees =
      aggregatedData.employeeBacklog?.filter(
        (e) => e.count >= EMPLOYEE_BACKLOG_THRESHOLD
      ) || [];
    const highBacklogBranches =
      aggregatedData.branchBacklog?.filter(
        (b) => b.count >= BRANCH_BACKLOG_THRESHOLD
      ) || [];

    if (highBacklogEmployees.length > 0 || highBacklogBranches.length > 0) {
      let warningHTML = `
              <i class="fas fa-exclamation-circle fa-lg mr-3 mt-1"></i>
              <div>
                  <h4 class="font-bold">Cảnh báo: Tồn đọng công việc</h4>`;

      if (highBacklogEmployees.length > 0) {
        warningHTML += `<p class="text-sm mt-1">Các nhân viên sau có nhiều công việc chưa hoàn thành:</p><ul class="list-disc pl-5 text-sm">`;
        highBacklogEmployees.forEach(({ name, count }) => {
          warningHTML += `<li><strong>${name}</strong>: ${count} công việc tồn đọng</li>`;
        });
        warningHTML += `</ul>`;
      }

      if (highBacklogBranches.length > 0) {
        warningHTML += `<p class="text-sm mt-2">Các chi nhánh sau có nhiều sự cố chưa được giải quyết:</p><ul class="list-disc pl-5 text-sm">`;
        highBacklogBranches.forEach(({ branch, count }) => {
          warningHTML += `<li><strong>${branch}</strong>: ${count} sự cố tồn đọng</li>`;
        });
        warningHTML += `</ul>`;
      }

      warningHTML += `</div>`;

      backlogEl.className = "alert-info p-4 rounded-lg flex items-start";
      backlogEl.innerHTML = warningHTML;
      backlogEl.classList.remove("hidden");
    } else {
      backlogEl.classList.add("hidden");
    }
  }

  /**
   * Renders trend chart from aggregated data
   */
  function renderIncidentTrendChartFromAggregated(trendData) {
    const canvas = document.getElementById("incidentTrendChart");
    if (!canvas) return;
    if (incidentTrendChart) incidentTrendChart.destroy();

    const sortedDates = Object.keys(trendData).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    if (sortedDates.length === 0) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center";
      ctx.fillText(
        "Không có dữ liệu để hiển thị.",
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }

    const labels = sortedDates.map((date) =>
      new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    );
    const data = sortedDates.map((date) => trendData[date]);

    incidentTrendChart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số lượng sự cố",
            data: data,
            borderColor: "var(--primary-color)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  /**
   * Renders heatmap from aggregated data
   */
  function renderIncidentHeatmapFromAggregated(heatmapData) {
    const container = document.getElementById("incidentHeatmapContainer");
    if (!container) return;

    const heatmap = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));
    let maxCount = 0;

    // Parse aggregated heatmap data
    Object.entries(heatmapData).forEach(([key, count]) => {
      const [dayOfWeek, hour] = key.split("-").map(Number);
      if (dayOfWeek >= 0 && dayOfWeek < 7 && hour >= 0 && hour < 24) {
        heatmap[dayOfWeek][hour] = count;
        if (count > maxCount) {
          maxCount = count;
        }
      }
    });

    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    let html = '<div class="heatmap">';
    // Header Row for hours
    html += "<div></div>"; // Empty corner
    for (let i = 0; i < 24; i++) {
      html += `<div class="heatmap-header">${i}</div>`;
    }

    // Data Rows (Day labels + cells)
    days.forEach((dayLabel, dayIndex) => {
      html += `<div class="heatmap-label">${dayLabel}</div>`;
      for (let hour = 0; hour < 24; hour++) {
        const count = heatmap[dayIndex][hour];
        // Non-linear scale to make smaller values more visible
        const opacity = maxCount > 0 ? Math.sqrt(count / maxCount) : 0;
        const style = `background-color: rgba(79, 70, 229, ${opacity.toFixed(
          2
        )});`;
        const tooltipText = `${count} sự cố`;
        html += `<div class="heatmap-cell" style="${style}"><span class="tooltip">${tooltipText}</span></div>`;
      }
    });

    html += "</div>";
    container.innerHTML = html;
  }

  /**
   * Renders scope analysis from aggregated data
   */
  function renderScopeAnalysisFromAggregated(scopeAnalysis) {
    const tableContainer = document.getElementById(
      "problematicRoomsTableContainer"
    );
    const scopeCanvas = document.getElementById("scopeAnalysisChart");

    if (!tableContainer || !scopeCanvas) return;

    // Render pie chart for scope distribution
    const allRoomsCount = scopeAnalysis.allRooms || 0;
    const specificRoomsCount = scopeAnalysis.specificRooms || 0;
    const total = allRoomsCount + specificRoomsCount;

    if (scopeAnalysisChart) scopeAnalysisChart.destroy();

    if (total > 0) {
      scopeAnalysisChart = new Chart(scopeCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["Tất cả phòng", "Phòng cụ thể"],
          datasets: [
            {
              data: [allRoomsCount, specificRoomsCount],
              backgroundColor: ["#3B82F6", "#10B981"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Render problematic rooms table
    const roomCountsByBranch = scopeAnalysis.roomCountsByBranch || {};
    const allRooms = [];

    Object.entries(roomCountsByBranch).forEach(([branch, rooms]) => {
      Object.entries(rooms).forEach(([room, count]) => {
        allRooms.push({ branch, room, count });
      });
    });

    allRooms.sort((a, b) => b.count - a.count);
    const topRooms = allRooms.slice(0, 10);

    if (topRooms.length > 0) {
      tableContainer.innerHTML = `
              <table class="min-w-full responsive-table">
                  <thead class="bg-slate-50 sticky top-0">
                      <tr>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Chi nhánh</th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Phòng</th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Số lần</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-slate-200">
                      ${topRooms
                        .map(
                          (item) => `
                          <tr>
                              <td class="px-4 py-2">${item.branch}</td>
                              <td class="px-4 py-2">${item.room}</td>
                              <td class="px-4 py-2 font-semibold">${item.count}</td>
                          </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>
          `;
    } else {
      tableContainer.innerHTML = `<p class="text-center text-slate-500 p-4">Không có dữ liệu phòng cụ thể.</p>`;
    }
  }

  window.setup_issueReportView = function () {
    if (!currentUserProfile) return;

    // --- Lấy các DOM element cần thiết ---
    const reporterNameInput = mainContentContainer.querySelector("#reporterName");
    const branchSelect = mainContentContainer.querySelector("#issueBranch");
    const floorSelect = mainContentContainer.querySelector("#issueFloor");
    const reportBtn = mainContentContainer.querySelector("#reportIssueBtn");
    const scopeRadios = mainContentContainer.querySelectorAll(
      'input[name="issueScope"]'
    );
    const issueScopeContainer = mainContentContainer.querySelector(
      "#issueScopeContainer"
    );
    const floorSelectorContainer = mainContentContainer.querySelector(
      "#floorSelectorContainer"
    ); // Mới
    const specificRoomsContainer = mainContentContainer.querySelector(
      "#specificRoomsContainer"
    );
    const roomsTrigger = mainContentContainer.querySelector(
      "#specificRoomsTrigger"
    );
    const roomsOptions = mainContentContainer.querySelector(
      "#specificRoomsOptions"
    );
    const locationSearchInput = mainContentContainer.querySelector("#locationSearch");
    const locationSearchResults = mainContentContainer.querySelector("#locationSearchResults");

    // --- Thiết lập ban đầu ---
    reporterNameInput.value = currentUserProfile.displayName;
    branchSelect.innerHTML = '<option value="">-- Chọn chi nhánh --</option>' + ALL_BRANCHES.map(
      (b) => `<option value="${b}">${b}</option>`
    ).join("");
    reportBtn.addEventListener("click", handleReportIssue);
    
    // Prevent form submission on Enter key
    const issueReportForm = mainContentContainer.querySelector("#issueReportForm");
    if (issueReportForm) {
      issueReportForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleReportIssue();
      });
    }

    // --- Logic ẩn/hiện phần "Phạm vi sự cố" dựa trên chi nhánh ---
    const updateIssueScopeVisibility = () => {
      const selectedBranch = branchSelect.value;
      // Ẩn phần "Phạm vi sự cố" nếu là "Văn phòng" hoặc "SPACE A&A"
      const shouldHideScope = selectedBranch === "Văn phòng" || selectedBranch === "SPACE A&A";
      
      if (issueScopeContainer) {
        issueScopeContainer.classList.toggle("hidden", shouldHideScope);
      }
      
      // Nếu ẩn, set giá trị mặc định là "all_rooms" và ẩn các phần liên quan
      if (shouldHideScope) {
        const allRoomsRadio = mainContentContainer.querySelector(
          'input[name="issueScope"][value="all_rooms"]'
        );
        if (allRoomsRadio) {
          allRoomsRadio.checked = true;
        }
        floorSelectorContainer.classList.add("hidden");
        specificRoomsContainer.classList.add("hidden");
      }
    };

    // Thêm event listener cho branchSelect
    branchSelect.addEventListener("change", updateIssueScopeVisibility);

    // --- Logic ẩn/hiện mục chọn Tầng và Phòng ---
    const updateScopeVisibility = () => {
      const selectedBranch = branchSelect.value;
      // Nếu là "Văn phòng" hoặc "SPACE A&A", không hiển thị phần này
      if (selectedBranch === "Văn phòng" || selectedBranch === "SPACE A&A") {
        floorSelectorContainer.classList.add("hidden");
        specificRoomsContainer.classList.add("hidden");
        return;
      }
      
      const isSpecificScope = mainContentContainer.querySelector(
        'input[name="issueScope"][value="specific_rooms"]'
      ).checked;
      floorSelectorContainer.classList.toggle("hidden", !isSpecificScope);
      specificRoomsContainer.classList.toggle("hidden", !isSpecificScope);
    };

    scopeRadios.forEach((radio) => {
      radio.addEventListener("change", updateScopeVisibility);
    });

    if (roomsTrigger && roomsOptions && floorSelect) {
      // --- Hàm cập nhật giao diện các thẻ tag phòng đã chọn ---
      const updateSelectedRoomsUI = () => {
        const selectedCheckboxes = roomsOptions.querySelectorAll(
          ".room-checkbox:checked"
        );
        roomsTrigger.innerHTML = "";
        if (selectedCheckboxes.length === 0) {
          roomsTrigger.innerHTML = `<span class="placeholder-text">Chọn phòng...</span><i class="fas fa-chevron-down text-xs text-slate-500 ml-auto"></i>`;
        } else {
          selectedCheckboxes.forEach((checkbox) => {
            const tag = document.createElement("div");
            tag.className = "custom-select-tag";
            tag.innerHTML = `<span>${checkbox.value}</span><span class="tag-close-btn" data-value="${checkbox.value}">&times;</span>`;
            roomsTrigger.appendChild(tag);
          });
          roomsTrigger.insertAdjacentHTML(
            "beforeend",
            '<i class="fas fa-chevron-down text-xs text-slate-500 ml-auto"></i>'
          );
        }
      };

      // --- Hàm tải danh sách phòng dựa trên chi nhánh và tầng ---
      const populateRooms = (branchName, floorName) => {
        const branch = BRANCH_DATA[branchName] || BRANCH_DATA.default;
        const rooms = branch[floorName] || [];

        roomsOptions.innerHTML = rooms
          .map(
            (room) => `
                  <div class="custom-select-option">
                      <label>
                          <input type="checkbox" class="room-checkbox" value="${room}">
                          <span>${room}</span>
                      </label>
                  </div>
              `
          )
          .join("");

        updateSelectedRoomsUI();
      };

      // --- Hàm tải danh sách tầng dựa trên chi nhánh ---
      const populateFloors = (branchName) => {
        const branch = BRANCH_DATA[branchName] || BRANCH_DATA.default;
        const floors = Object.keys(branch);

        floorSelect.innerHTML = floors
          .map((floor) => `<option value="${floor}">${floor}</option>`)
          .join("");

        if (floors.length > 0) {
          populateRooms(branchName, floors[0]);
        } else {
          populateRooms(branchName, "");
        }
      };

      // --- Gán sự kiện ---
      branchSelect.addEventListener("change", () =>
        populateFloors(branchSelect.value)
      );
      floorSelect.addEventListener("change", () =>
        populateRooms(branchSelect.value, floorSelect.value)
      );

      roomsTrigger.addEventListener("click", (e) => {
        if (e.target.classList.contains("tag-close-btn")) {
          e.stopPropagation();
          const roomValue = e.target.dataset.value;
          const checkboxToUncheck = roomsOptions.querySelector(
            `input[value="${roomValue}"]`
          );
          if (checkboxToUncheck) {
            checkboxToUncheck.checked = false;
            updateSelectedRoomsUI();
          }
        } else {
          roomsOptions.classList.toggle("show");
        }
      });

      roomsOptions.addEventListener("change", (e) => {
        if (e.target.classList.contains("room-checkbox")) updateSelectedRoomsUI();
      });

      // --- Tải dữ liệu và cập nhật giao diện lần đầu ---
      populateFloors(branchSelect.value);
      updateScopeVisibility(); // Chạy lần đầu để ẩn các mục không cần thiết
    }

    // Cập nhật hiển thị phần "Phạm vi sự cố" khi khởi tạo
    updateIssueScopeVisibility();

    // --- Đóng dropdown khi click ra ngoài ---
    document.addEventListener("click", function (event) {
      if (
        roomsTrigger &&
        !roomsTrigger.contains(event.target) &&
        !roomsOptions.contains(event.target)
      ) {
        roomsOptions.classList.remove("show");
      }
      // Close location search results when clicking outside
      if (
        locationSearchResults &&
        locationSearchInput &&
        !locationSearchResults.contains(event.target) &&
        !locationSearchInput.contains(event.target)
      ) {
        locationSearchResults.classList.add("hidden");
      }
    });

    // --- Tìm kiếm vị trí thông minh ---
    if (locationSearchInput && locationSearchResults) {
      // Lưu kết quả tìm kiếm hiện tại để truy cập khi click
      let currentSearchResults = [];

      /**
       * Tìm kiếm phòng hoặc chi nhánh trong BRANCH_DATA
       * @param {string} searchTerm - Từ khóa tìm kiếm (tên phòng hoặc chi nhánh)
       * @returns {Array} Mảng các kết quả tìm thấy
       */
      const searchLocation = (searchTerm) => {
        if (!searchTerm || searchTerm.trim().length < 2) return [];

        const term = searchTerm.trim().toLowerCase();
        const results = [];

        // Tìm kiếm theo tên phòng
        Object.entries(BRANCH_DATA).forEach(([branchName, floors]) => {
          Object.entries(floors).forEach(([floorName, rooms]) => {
            rooms.forEach((room) => {
              if (room.toLowerCase().includes(term)) {
                results.push({
                  type: "room",
                  room: room,
                  floor: floorName,
                  branch: branchName,
                  displayText: `${room} - ${floorName} - ${branchName}`,
                });
              }
            });
          });
        });

        // Tìm kiếm theo tên chi nhánh
        Object.keys(BRANCH_DATA).forEach((branchName) => {
          if (branchName.toLowerCase().includes(term)) {
            results.push({
              type: "branch",
              branch: branchName,
              displayText: `${branchName} (Chi nhánh)`,
            });
          }
        });

        // Sắp xếp: phòng trước, chi nhánh sau
        results.sort((a, b) => {
          if (a.type === "room" && b.type === "branch") return -1;
          if (a.type === "branch" && b.type === "room") return 1;
          return 0;
        });

        return results.slice(0, 10); // Giới hạn 10 kết quả
      };

      /**
       * Áp dụng kết quả tìm kiếm: tự động điền branch và floor
       */
      const applySearchResult = (result) => {
        if (!result) return;

        if (result.type === "room") {
          // Tự động điền branch và floor
          branchSelect.value = result.branch;
          populateFloors(result.branch);
          updateIssueScopeVisibility(); // Cập nhật hiển thị phần "Phạm vi sự cố"
          
          // Đợi một chút để floor select được cập nhật
          setTimeout(() => {
            floorSelect.value = result.floor;
            populateRooms(result.branch, result.floor);
            
            // Chỉ tự động chọn phòng cụ thể nếu không phải "Văn phòng" hoặc "SPACE A&A"
            if (result.branch !== "Văn phòng" && result.branch !== "SPACE A&A") {
              const specificRoomsRadio = mainContentContainer.querySelector(
                'input[name="issueScope"][value="specific_rooms"]'
              );
              if (specificRoomsRadio) {
                specificRoomsRadio.checked = true;
                updateScopeVisibility();
                
                // Check phòng đã tìm
                setTimeout(() => {
                  const roomCheckbox = roomsOptions.querySelector(
                    `input[value="${result.room}"]`
                  );
                  if (roomCheckbox) {
                    roomCheckbox.checked = true;
                    updateSelectedRoomsUI();
                  }
                }, 100);
              }
            }
          }, 50);

          // Hiển thị thông báo thành công
          locationSearchInput.value = result.room;
          locationSearchResults.classList.add("hidden");
        } else if (result.type === "branch") {
          // Chỉ điền branch
          branchSelect.value = result.branch;
          populateFloors(result.branch);
          updateIssueScopeVisibility(); // Cập nhật hiển thị phần "Phạm vi sự cố"
          
          locationSearchInput.value = result.branch;
          locationSearchResults.classList.add("hidden");
        }
      };

      // Sử dụng event delegation cho dropdown results
      locationSearchResults.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn event bubbling
        
        const resultElement = e.target.closest("[data-result-index]");
        if (resultElement) {
          const index = parseInt(resultElement.dataset.resultIndex);
          if (currentSearchResults[index]) {
            applySearchResult(currentSearchResults[index]);
          }
        }
      });

      // Event listener cho input tìm kiếm
      let searchTimeout;
      locationSearchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (searchTerm.length < 2) {
          locationSearchResults.classList.add("hidden");
          currentSearchResults = [];
          return;
        }

        // Debounce để tránh tìm kiếm quá nhiều
        searchTimeout = setTimeout(() => {
          const results = searchLocation(searchTerm);
          currentSearchResults = results; // Lưu kết quả để dùng khi click
          
          if (results.length === 0) {
            locationSearchResults.innerHTML = `
              <div class="p-3 text-sm text-slate-500 text-center">
                <i class="fas fa-search mr-2"></i>Không tìm thấy kết quả
              </div>
            `;
            locationSearchResults.classList.remove("hidden");
            return;
          }

          // Hiển thị kết quả
          locationSearchResults.innerHTML = results
            .map(
              (result, index) => `
                <div class="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors" 
                     data-result-index="${index}">
                  <div class="flex items-center space-x-2">
                    <i class="fas ${result.type === "room" ? "fa-door-open" : "fa-building"} text-indigo-600"></i>
                    <div class="flex-1">
                      <div class="font-medium text-slate-800">${result.displayText}</div>
                      ${result.type === "room" ? `
                        <div class="text-xs text-slate-500 mt-0.5">
                          <i class="fas fa-layer-group mr-1"></i>${result.floor} • 
                          <i class="fas fa-building mr-1"></i>${result.branch.replace("ICOOL ", "")}
                        </div>
                      ` : ""}
                    </div>
                    <i class="fas fa-arrow-left text-xs text-slate-400"></i>
                  </div>
                </div>
              `
            )
            .join("");

          locationSearchResults.classList.remove("hidden");
        }, 300); // Debounce 300ms
      });

      // Xử lý Enter key để chọn kết quả đầu tiên
      locationSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (currentSearchResults.length > 0) {
            applySearchResult(currentSearchResults[0]);
          }
        } else if (e.key === "Escape") {
          locationSearchResults.classList.add("hidden");
        }
      });
    }
  };

  // Populate reporter filter dropdown with unique reporter names
  // Note: With server-side pagination, this only shows reporters from loaded data
  // For a complete list, would need a separate query to get all unique reporters
  async function populateReporterFilter() {
    const reporterFilter = mainContentContainer.querySelector("#filterReporter");
    if (!reporterFilter) return;

    // Preserve current selection
    const currentValue = reporterFilter.value;

    // Get unique reporter names from currently loaded/filtered data
    const uniqueReporters = [...new Set(
      issueHistoryFiltered
        .map(report => report.reporterName)
        .filter(name => name && name.trim())
    )].sort();
    
    // Optionally: Load all unique reporters from server for complete filter
    // This would require a separate query, but for now we use loaded data only

    // Clear existing options except "Tất cả"
    reporterFilter.innerHTML = '<option value="">Tất cả</option>';

    // Add unique reporters
    uniqueReporters.forEach(reporterName => {
      const option = document.createElement("option");
      option.value = reporterName;
      option.textContent = reporterName;
      reporterFilter.appendChild(option);
    });

    // Restore previous selection if it still exists
    if (currentValue && uniqueReporters.includes(currentValue)) {
      reporterFilter.value = currentValue;
    }
  }

  // Update active filters count badge
  function updateActiveFiltersCount() {
    const activeFiltersCount = mainContentContainer.querySelector("#activeFiltersCount");
    if (!activeFiltersCount) return;

    const branchFilter = mainContentContainer.querySelector("#filterBranch")?.value || "";
    const issueTypeFilter = mainContentContainer.querySelector("#filterIssueType")?.value || "";
    const statusFilter = mainContentContainer.querySelector("#filterStatus")?.value || "";
    const reporterFilter = mainContentContainer.querySelector("#filterReporter")?.value || "";
    const dateFromFilter = mainContentContainer.querySelector("#filterDateFrom")?.value || "";
    const dateToFilter = mainContentContainer.querySelector("#filterDateTo")?.value || "";

    let count = 0;
    if (branchFilter) count++;
    if (issueTypeFilter) count++;
    if (statusFilter) count++;
    if (reporterFilter) count++;
    if (dateFromFilter) count++;
    if (dateToFilter) count++;

    if (count > 0) {
      activeFiltersCount.textContent = `${count} bộ lọc đang hoạt động`;
      activeFiltersCount.classList.remove("hidden");
    } else {
      activeFiltersCount.classList.add("hidden");
    }
  }

  /**
   * Loads issue history page with server-side pagination and filtering
   * @param {boolean} resetPage - Whether to reset to page 1
   * @param {boolean} loadNext - Whether to load next page (for pagination)
   */
  async function loadIssueHistoryPage(resetPage = false, loadNext = false) {
    const tableBody = mainContentContainer.querySelector("#issueHistoryTableBody");
    if (!tableBody) return;

    // For archive mode, check if month is selected
    if (issueHistoryMode === "archive" && !issueHistorySelectedMonth) {
      tableBody.innerHTML = `<tr>
        <td colspan="7" class="text-center p-8 text-slate-500">
          <i class="fas fa-calendar-check text-4xl mb-4 text-slate-300"></i>
          <p class="text-base font-medium">Chưa chọn tháng/năm để xem báo cáo</p>
          <p class="text-sm mt-2">Vui lòng chọn tháng/năm ở trên và nhấn "Xem Báo Cáo"</p>
        </td>
      </tr>`;
      return;
    }

    if (resetPage) {
      issueHistoryCurrentPage = 1;
      issueHistoryLastVisible = null;
    }

    // Show loading state
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4">Đang tải...</td></tr>`;

    try {
      // Get filter values
      const branchFilter = mainContentContainer.querySelector("#filterBranch")?.value || "";
      const issueTypeFilter = mainContentContainer.querySelector("#filterIssueType")?.value || "";
      const statusFilter = mainContentContainer.querySelector("#filterStatus")?.value || "";
      const reporterFilter = mainContentContainer.querySelector("#filterReporter")?.value || "";
      const dateFromFilter = mainContentContainer.querySelector("#filterDateFrom")?.value || "";
      const dateToFilter = mainContentContainer.querySelector("#filterDateTo")?.value || "";

      // Build query based on mode
      let q;
      
      if (issueHistoryMode === "current") {
        // Current mode: Query from issueReports
        // Tất cả quyền (Admin, Manager, Nhân viên) xem tất cả
        // Chỉ role "Chi nhánh" bị giới hạn theo branch
        q = getScopedIssuesQuery();
      } else {
        // Archive mode: Query from issueReports_archive with month filter
        // Parse selected month to get date range
        const [year, month] = issueHistorySelectedMonth.split("-");
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1); // First day of month
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999); // Last day of month

        // Build query for archive collection
        q = collection(db, `/artifacts/${canvasAppId}/public/data/issueReports_archive`);
        
        // Chỉ filter cho role "Chi nhánh" - chỉ xem báo cáo của chi nhánh đó
        if (currentUserProfile.role === "Chi nhánh") {
          const userBranch = currentUserProfile.branch;
          if (userBranch) {
            q = query(q, where("issueBranch", "==", userBranch));
          } else {
            // Nếu không có branch, trả về empty result
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-slate-500">Không có dữ liệu trong tháng này.</td></tr>`;
            issueHistoryFiltered = [];
            return;
          }
        }
        // Admin, Manager, Nhân viên: xem tất cả (không filter theo role)
        
        // Filter by month (using reportDate)
        q = query(
          q,
          where("reportDate", ">=", Timestamp.fromDate(startDate)),
          where("reportDate", "<=", Timestamp.fromDate(endDate))
        );
      }

      // Apply additional filters at server-side (if any beyond month)
      if (branchFilter) {
        q = query(q, where("issueBranch", "==", branchFilter));
      }
      if (issueTypeFilter) {
        q = query(q, where("issueType", "==", issueTypeFilter));
      }
      if (statusFilter) {
        q = query(q, where("status", "==", statusFilter));
      }
      // Note: reporterName filter cannot be done server-side, will filter client-side
      // Additional date filters (within the selected month) will be handled client-side

      // Add ordering and pagination
      q = query(q, orderBy("reportDate", "desc"), limit(ITEMS_PER_PAGE));

      // Add startAfter for pagination
      if (loadNext && issueHistoryLastVisible) {
        q = query(q, startAfter(issueHistoryLastVisible));
      }

      // Execute query
      let snapshot;
      let usingFallback = false;
      
      try {
        snapshot = await getDocs(q);
        
        // If archive returns no results, try fallback to current reports
        if (snapshot.empty) {
          console.log("Archive collection is empty, trying fallback to current reports...");
          usingFallback = true;
          
          // Fallback: Query from current reports (without date filter at server-side)
          // We'll filter by month at client-side to avoid index issues
          q = getScopedIssuesQuery();
          
          // Apply other filters (but not date filter - will filter client-side)
          if (branchFilter) {
            q = query(q, where("issueBranch", "==", branchFilter));
          }
          if (issueTypeFilter) {
            q = query(q, where("issueType", "==", issueTypeFilter));
          }
          if (statusFilter) {
            q = query(q, where("status", "==", statusFilter));
          }
          
          // Add ordering and pagination (without date filter)
          // Increase limit significantly to ensure we get enough data for the month
          // Note: We'll filter by month client-side, so we need more records
          q = query(q, orderBy("reportDate", "desc"), limit(500)); // Get more records to filter client-side
          
          if (loadNext && issueHistoryLastVisible) {
            q = query(q, startAfter(issueHistoryLastVisible));
          }
          
          snapshot = await getDocs(q);
        }
      } catch (error) {
        console.error("Error querying issue history:", error);
        
        // If archive query fails, try fallback to current reports
        console.log("Archive query failed, trying fallback to current reports...");
        usingFallback = true;
        
        // Fallback: Query from current reports (without date filter at server-side)
        // We'll filter by month at client-side to avoid index issues
        q = getScopedIssuesQuery();
        
        // Apply other filters (but not date filter - will filter client-side)
        if (branchFilter) {
          q = query(q, where("issueBranch", "==", branchFilter));
        }
        if (issueTypeFilter) {
          q = query(q, where("issueType", "==", issueTypeFilter));
        }
        if (statusFilter) {
          q = query(q, where("status", "==", statusFilter));
        }
        
        // Add ordering and pagination (without date filter)
        // Increase limit significantly to ensure we get enough data for the month
        // Note: We'll filter by month client-side, so we need more records
        q = query(q, orderBy("reportDate", "desc"), limit(500)); // Get more records to filter client-side
        
        if (loadNext && issueHistoryLastVisible) {
          q = query(q, startAfter(issueHistoryLastVisible));
        }
        
        try {
          snapshot = await getDocs(q);
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw fallbackError;
        }
      }
      
      // Convert to array
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      if (usingFallback) {
        console.log(`Archive collection empty/not found. Loaded ${reports.length} reports from current collection (fallback mode)`);
      } else {
        console.log(`Loaded ${reports.length} reports from archive`);
      }

      // Client-side filtering
      let filteredReports = reports;
      
      // Tất cả quyền (Admin, Manager, Nhân viên) xem tất cả
      // Chỉ role "Chi nhánh" đã được filter ở server-side theo branch
      
      // If using fallback, filter by selected month
      if (usingFallback && issueHistorySelectedMonth) {
        const [year, month] = issueHistorySelectedMonth.split("-");
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
        
        console.log(`Filtering reports for month ${issueHistorySelectedMonth}: ${startDate.toISOString()} to ${endDate.toISOString()}`);
        
        filteredReports = reports.filter((report) => {
          // Handle both Timestamp and Date formats
          let reportDate;
          if (report.reportDate && report.reportDate.toDate) {
            reportDate = report.reportDate.toDate();
          } else if (report.reportDate) {
            reportDate = new Date(report.reportDate);
          } else {
            console.warn("Report missing reportDate:", report.id);
            return false;
          }
          
          const isInRange = reportDate >= startDate && reportDate <= endDate;
          if (!isInRange) {
            console.log(`Report ${report.id} date ${reportDate.toISOString()} is outside range`);
          }
          return isInRange;
        });
        
        console.log(`Filtered to ${filteredReports.length} reports for month ${issueHistorySelectedMonth} (from ${reports.length} total)`);
        
        // If still no results after filtering, try loading more data
        if (filteredReports.length === 0 && reports.length > 0) {
          console.warn("No reports found in selected month. This might be because:");
          console.warn(`- Selected month: ${issueHistorySelectedMonth}`);
          console.warn(`- Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
          console.warn(`- Sample report dates:`, reports.slice(0, 3).map(r => {
            const rd = r.reportDate?.toDate ? r.reportDate.toDate() : new Date(r.reportDate);
            return rd.toISOString();
          }));
        }
      }
      
      // Tất cả quyền (Admin, Manager, Nhân viên) xem tất cả - không cần filter client-side
      // Chỉ role "Chi nhánh" đã được filter ở server-side theo branch
      
      // Additional client-side filtering for reporterName and date range
      if (reporterFilter || dateFromFilter || dateToFilter) {
        filteredReports = filteredReports.filter((report) => {
          if (reporterFilter && report.reporterName !== reporterFilter) {
            return false;
          }
          if (dateFromFilter || dateToFilter) {
            // Handle both Timestamp and Date formats
            let reportDate;
            if (report.reportDate && report.reportDate.toDate) {
              reportDate = report.reportDate.toDate();
            } else if (report.reportDate) {
              reportDate = new Date(report.reportDate);
            } else {
              return false;
            }
            
            reportDate.setHours(0, 0, 0, 0);
            if (dateFromFilter) {
              const fromDate = new Date(dateFromFilter);
              fromDate.setHours(0, 0, 0, 0);
              if (reportDate < fromDate) return false;
            }
            if (dateToFilter) {
              const toDate = new Date(dateToFilter);
              toDate.setHours(23, 59, 59, 999);
              if (reportDate > toDate) return false;
            }
          }
          return true;
        });
      }

      // Update cache and state
      if (resetPage) {
        issueHistoryFiltered = filteredReports;
      } else if (loadNext) {
        issueHistoryFiltered = [...issueHistoryFiltered, ...filteredReports];
      } else {
        issueHistoryFiltered = filteredReports;
      }

      // Update pagination state
      issueHistoryLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      issueHistoryHasMore = snapshot.docs.length === ITEMS_PER_PAGE;

      // Show fallback message if using fallback
      if (usingFallback) {
        const resultsSubtitle = mainContentContainer.querySelector("#issueHistoryResultsSubtitle");
        if (resultsSubtitle) {
          const originalText = resultsSubtitle.textContent;
          // Create informative message about data source and count
          const message = `Báo cáo archive đang lấy dữ liệu từ báo cáo hiện tại (đã tải ${reports.length} bản ghi, hiển thị ${filteredReports.length} bản ghi trong tháng này)`;
          resultsSubtitle.innerHTML = `${originalText} <span class="text-amber-600 text-xs ml-2 block mt-1" title="Archive collection chưa có dữ liệu. Hệ thống đang lấy từ báo cáo hiện tại và lọc theo tháng/năm đã chọn.">${message}</span>`;
        }
      }

      // Update UI
    updateActiveFiltersCount();
    renderIssueHistoryTable(issueHistoryFiltered);
      
      // Build room map if needed
      buildRoomToLocationMap();
      
      // Update reporter filter dropdown (load all unique reporters for filter)
      if (resetPage) {
        populateReporterFilter();
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử sự cố:", error);
      
      // Kiểm tra nếu là lỗi thiếu index
      if (error.code === "failed-precondition" && error.message.includes("index")) {
        // Extract index creation URL if available
        const indexUrlMatch = error.message.match(/https:\/\/[^\s]+/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
        
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center p-6">
              <div class="max-w-md mx-auto">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">Cần tạo Index cho Firestore</h3>
                <p class="text-sm text-slate-600 mb-4">
                  Query này cần composite index để hoạt động. Vui lòng tạo index trong Firebase Console.
                </p>
                ${indexUrl ? `
                  <a href="${indexUrl}" target="_blank" class="btn-primary inline-block mb-2">
                    <i class="fas fa-external-link-alt mr-2"></i>Tạo Index (Tự động)
                  </a>
                  <p class="text-xs text-slate-500 mt-2">
                    Sau khi tạo index, đợi 1-5 phút rồi refresh trang này.
                  </p>
                ` : `
                  <p class="text-xs text-slate-500">
                    Vào Firebase Console > Firestore > Indexes để tạo index thủ công.
                  </p>
                `}
              </div>
            </td>
          </tr>
        `;
      } else {
        // Other errors
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-red-500">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
      }
    }
  }

  // Filter function for issue history (now triggers server-side load)
  function filterIssueHistory() {
    loadIssueHistoryPage(true); // Reset to page 1 and reload
  }

  window.setup_issueHistoryView = function () {
    if (!currentUserProfile) return;
    
    // Reset state
    issueHistoryCurrentPage = 1;
    issueHistorySelectedMonth = "";
    issueHistoryFiltered = [];
    issueHistoryCache = [];
    issueHistoryLastVisible = null;
    issueHistoryMode = "current"; // Default to current reports mode
    
    // Get elements
    const resultsSection = mainContentContainer.querySelector("#issueHistoryResults");
    const archiveSelector = mainContentContainer.querySelector("#issueHistoryArchiveSelector");
    const modeDescription = mainContentContainer.querySelector("#issueHistoryModeDescription");
    const modeCurrentBtn = mainContentContainer.querySelector("#issueHistoryModeCurrent");
    const modeArchiveBtn = mainContentContainer.querySelector("#issueHistoryModeArchive");
    const tableBody = mainContentContainer.querySelector("#issueHistoryTableBody");
    const monthInput = mainContentContainer.querySelector("#issueHistoryMonth");
    const loadBtn = mainContentContainer.querySelector("#loadIssueHistoryBtn");
    
    // Setup mode toggle function
    function switchMode(mode) {
      issueHistoryMode = mode;
      
      // Update button states
      if (modeCurrentBtn && modeArchiveBtn) {
        if (mode === "current") {
          modeCurrentBtn.classList.add("active", "bg-indigo-600", "text-white");
          modeCurrentBtn.classList.remove("bg-slate-200", "text-slate-700");
          modeArchiveBtn.classList.remove("active", "bg-indigo-600", "text-white");
          modeArchiveBtn.classList.add("bg-slate-200", "text-slate-700");
          
          // Hide archive selector
          if (archiveSelector) archiveSelector.classList.add("hidden");
          
          // Update description
          if (modeDescription) {
            modeDescription.textContent = "Xem tất cả báo cáo hiện tại (tự động tải)";
          }
          
          // Clear selected month
          issueHistorySelectedMonth = "";
          
          // Show results section
          if (resultsSection) {
            resultsSection.classList.remove("hidden");
            // Update title
            const resultsTitle = mainContentContainer.querySelector("#issueHistoryResultsTitle");
            const resultsSubtitle = mainContentContainer.querySelector("#issueHistoryResultsSubtitle");
            if (resultsTitle) resultsTitle.textContent = "Báo Cáo Hiện Tại";
            if (resultsSubtitle) resultsSubtitle.textContent = "Tất cả báo cáo sự cố hiện tại";
          }
          
          // Load current reports immediately
          loadIssueHistoryPage(true);
        } else {
          modeArchiveBtn.classList.add("active", "bg-indigo-600", "text-white");
          modeArchiveBtn.classList.remove("bg-slate-200", "text-slate-700");
          modeCurrentBtn.classList.remove("active", "bg-indigo-600", "text-white");
          modeCurrentBtn.classList.add("bg-slate-200", "text-slate-700");
          
          // Show archive selector
          if (archiveSelector) archiveSelector.classList.remove("hidden");
          
          // Update description
          if (modeDescription) {
            modeDescription.textContent = "Xem báo cáo từ archive (chọn tháng/năm)";
          }
          
          // Clear table and show message
          if (tableBody) {
            tableBody.innerHTML = `<tr>
              <td colspan="7" class="text-center p-8 text-slate-500">
                <i class="fas fa-calendar-check text-4xl mb-4 text-slate-300"></i>
                <p class="text-base font-medium">Chưa chọn tháng/năm để xem báo cáo</p>
                <p class="text-sm mt-2">Vui lòng chọn tháng/năm ở trên và nhấn "Xem Báo Cáo"</p>
              </td>
            </tr>`;
          }
          
          // Hide results section initially for archive mode
          if (resultsSection) {
            resultsSection.classList.add("hidden");
          }
          
          // Clear selected month
          issueHistorySelectedMonth = "";
        }
      }
    }
    
    // Setup mode toggle event listeners
    if (modeCurrentBtn) {
      modeCurrentBtn.addEventListener("click", () => switchMode("current"));
    }
    if (modeArchiveBtn) {
      modeArchiveBtn.addEventListener("click", () => switchMode("archive"));
    }
    
    // Initialize to current mode (load immediately)
    switchMode("current");
    
    // Setup month selector - default to current month (for archive mode)
    if (monthInput) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      monthInput.value = `${year}-${month}`;
    }

    // Setup load button (only for archive mode)
    if (loadBtn) {
      loadBtn.type = "button"; // Prevent form submission
      loadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLoadIssueHistory();
      });
      
      // Also allow Enter key on month input
      if (monthInput) {
        monthInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter" && issueHistoryMode === "archive") {
            e.preventDefault();
            handleLoadIssueHistory();
          }
        });
      }
    }
    
    // Setup clear button
    const clearBtn = mainContentContainer.querySelector("#clearIssueHistoryBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        issueHistorySelectedMonth = "";
        if (monthInput) monthInput.value = "";
        if (resultsSection) resultsSection.classList.add("hidden");
        if (tableBody) {
          tableBody.innerHTML = `<tr>
            <td colspan="7" class="text-center p-8 text-slate-500">
              <i class="fas fa-calendar-check text-4xl mb-4 text-slate-300"></i>
              <p class="text-base font-medium">Chưa chọn tháng/năm để xem báo cáo</p>
              <p class="text-sm mt-2">Vui lòng chọn tháng/năm ở trên và nhấn "Xem Báo Cáo"</p>
            </td>
          </tr>`;
        }
        clearBtn.classList.add("hidden");
        issueHistoryFiltered = [];
      });
    }

    // Populate branch filter dropdown (for when results are shown)
    const branchFilter = mainContentContainer.querySelector("#filterBranch");
    if (branchFilter) {
      branchFilter.innerHTML = '<option value="">Tất cả</option>';
      ALL_BRANCHES.forEach((branch) => {
        const option = document.createElement("option");
        option.value = branch;
        option.textContent = branch;
        branchFilter.appendChild(option);
      });
    }

    // Populate status filter dropdown from ISSUE_STATUSES constant (excluding "Đã hủy")
    const statusFilter = mainContentContainer.querySelector("#filterStatus");
    if (statusFilter) {
      statusFilter.innerHTML = '<option value="">Tất cả</option>';
      ISSUE_STATUSES.filter(status => status !== "Đã hủy").forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
      });
    }

    // Set up toggle filter section
    const toggleFiltersBtn = mainContentContainer.querySelector("#toggleFiltersBtn");
    const filterSection = mainContentContainer.querySelector("#filterSection");
    
    if (toggleFiltersBtn && filterSection) {
      toggleFiltersBtn.addEventListener("click", () => {
        filterSection.classList.toggle("hidden");
        const icon = toggleFiltersBtn.querySelector("i");
        if (filterSection.classList.contains("hidden")) {
          icon.className = "fas fa-filter mr-2";
        } else {
          icon.className = "fas fa-filter mr-2";
          updateActiveFiltersCount();
        }
      });
    }

    // Set up filter event listeners
    const applyFiltersBtn = mainContentContainer.querySelector("#applyFiltersBtn");
    const clearFiltersBtn = mainContentContainer.querySelector("#clearFiltersBtn");
    
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", filterIssueHistory);
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        // Clear all filter inputs
        const branchFilter = mainContentContainer.querySelector("#filterBranch");
        const issueTypeFilter = mainContentContainer.querySelector("#filterIssueType");
        const statusFilter = mainContentContainer.querySelector("#filterStatus");
        const reporterFilter = mainContentContainer.querySelector("#filterReporter");
        const dateFromFilter = mainContentContainer.querySelector("#filterDateFrom");
        const dateToFilter = mainContentContainer.querySelector("#filterDateTo");

        if (branchFilter) branchFilter.value = "";
        if (issueTypeFilter) issueTypeFilter.value = "";
        if (statusFilter) statusFilter.value = "";
        if (reporterFilter) reporterFilter.value = "";
        if (dateFromFilter) dateFromFilter.value = "";
        if (dateToFilter) dateToFilter.value = "";

        // Reload from archive with current selected month and cleared filters
        if (issueHistorySelectedMonth) {
          loadIssueHistoryPage(true);
        }
      });
    }

    // Export to Excel button (only enabled when data is loaded)
    const exportIssueHistoryBtn = mainContentContainer.querySelector("#exportIssueHistoryBtn");
    if (exportIssueHistoryBtn) {
      exportIssueHistoryBtn.addEventListener("click", handleExportIssueHistory);
      exportIssueHistoryBtn.disabled = !issueHistorySelectedMonth;
    }

    // Update filter count when filter inputs change
    const filterSelects = [
      mainContentContainer.querySelector("#filterBranch"),
      mainContentContainer.querySelector("#filterIssueType"),
      mainContentContainer.querySelector("#filterStatus"),
      mainContentContainer.querySelector("#filterReporter")
    ];

    const filterInputs = [
      mainContentContainer.querySelector("#filterDateFrom"),
      mainContentContainer.querySelector("#filterDateTo")
    ];

    filterSelects.forEach((select) => {
      if (select) {
        select.addEventListener("change", updateActiveFiltersCount);
      }
    });

    filterInputs.forEach((input) => {
      if (input) {
        input.addEventListener("change", updateActiveFiltersCount);
        input.addEventListener("input", updateActiveFiltersCount);
      }
    });

    // Don't load data initially - wait for user to select month/year
  };

  /**
   * Handles loading issue history when user selects month/year
   */
  async function handleLoadIssueHistory() {
    // Only works in archive mode
    if (issueHistoryMode !== "archive") {
      return;
    }
    
    const monthInput = mainContentContainer.querySelector("#issueHistoryMonth");
    const messageEl = mainContentContainer.querySelector("#issueHistorySelectorMessage");
    const loadBtn = mainContentContainer.querySelector("#loadIssueHistoryBtn");
    const clearBtn = mainContentContainer.querySelector("#clearIssueHistoryBtn");
    const resultsSection = mainContentContainer.querySelector("#issueHistoryResults");
    const resultsTitle = mainContentContainer.querySelector("#issueHistoryResultsTitle");
    const resultsSubtitle = mainContentContainer.querySelector("#issueHistoryResultsSubtitle");
    const exportBtn = mainContentContainer.querySelector("#exportIssueHistoryBtn");
    
    if (!monthInput || !resultsSection) {
      console.error("Missing required elements for issue history:", { monthInput, resultsSection });
      return;
    }

    const selectedMonth = monthInput.value;
    
    if (!selectedMonth) {
      messageEl.textContent = "Vui lòng chọn tháng/năm để xem báo cáo.";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    // Set selected month
    issueHistorySelectedMonth = selectedMonth;
    
    // Show loading state
    loadBtn.disabled = true;
    loadBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...`;
    messageEl.classList.add("hidden");
    
    try {
      // Format month display
      const [year, month] = selectedMonth.split("-");
      const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                          "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
      const monthName = monthNames[parseInt(month) - 1];
      
      // Update results title
      if (resultsTitle) {
        resultsTitle.textContent = `Báo cáo ${monthName}/${year}`;
      }
      if (resultsSubtitle) {
        resultsSubtitle.textContent = `Dữ liệu từ archive - ${monthName}/${year}`;
      }
      
      // Show results section
      resultsSection.classList.remove("hidden");
      if (clearBtn) clearBtn.classList.remove("hidden");
      if (exportBtn) exportBtn.disabled = false;
      
      // Load data from archive
      await loadIssueHistoryPage(true);
      
    } catch (error) {
      console.error("Lỗi khi tải lịch sử sự cố:", error);
      
      // Kiểm tra nếu là lỗi thiếu index
      if (error.code === "failed-precondition" && error.message.includes("index")) {
        const indexUrlMatch = error.message.match(/https:\/\/[^\s]+/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
        
        messageEl.innerHTML = `
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
            <p class="font-semibold text-slate-800 mb-2">Cần tạo Index cho Firestore</p>
            <p class="text-sm text-slate-600 mb-3">
              Query này cần composite index để hoạt động.
            </p>
            ${indexUrl ? `
              <a href="${indexUrl}" target="_blank" class="btn-primary inline-block mb-2">
                <i class="fas fa-external-link-alt mr-2"></i>Tạo Index (Tự động)
              </a>
              <p class="text-xs text-slate-500 mt-2">
                Sau khi tạo index, đợi 1-5 phút rồi refresh trang này.
              </p>
            ` : `
              <p class="text-xs text-slate-500">
                Vào Firebase Console > Firestore > Indexes để tạo index thủ công.
              </p>
            `}
          </div>
        `;
        messageEl.className = "p-4 rounded-lg text-sm text-center bg-yellow-50 border border-yellow-200";
      } else {
        messageEl.textContent = `Lỗi tải dữ liệu: ${error.message}`;
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      }
      messageEl.classList.remove("hidden");
    } finally {
      loadBtn.disabled = false;
      loadBtn.innerHTML = `<i class="fas fa-search mr-2"></i>Xem Báo Cáo`;
    }
  }

  /**
   * Loads my tasks page with server-side pagination
   * @param {boolean} resetPage - Whether to reset to page 1
   * @param {boolean} loadNext - Whether to load next page
   */
  async function loadMyTasksPage(resetPage = false, loadNext = false) {
    if (!currentUser || !currentUserProfile) return;
    
    const tableBody = mainContentContainer.querySelector("#myTasksTableBody");
    if (!tableBody) return;

    if (resetPage) {
      myTasksCurrentPage = 1;
      myTasksLastVisible = null;
      myTasksCache = [];
    }

    // Show loading state
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4">Đang tải...</td></tr>`;

    try {
      // Build query with server-side pagination
      let q = query(
        collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`),
        where("assigneeId", "==", currentUser.uid),
        orderBy("reportDate", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      // Add startAfter for pagination
      if (loadNext && myTasksLastVisible) {
        q = query(q, startAfter(myTasksLastVisible));
      }

      // Execute query
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      // Update cache and state
      if (resetPage) {
        myTasksCache = tasks;
      } else if (loadNext) {
        myTasksCache = [...myTasksCache, ...tasks];
      } else {
        myTasksCache = tasks;
      }

      // Update pagination state
      myTasksLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      myTasksHasMore = snapshot.docs.length === ITEMS_PER_PAGE;

      // Update UI
      renderMyTasksTable(myTasksCache);
    } catch (error) {
      console.error("Error loading my tasks:", error);

      // Check if error is about missing index
      if (error.code === "failed-precondition" && error.message.includes("index")) {
        // Extract index creation URL if available
        const indexUrlMatch = error.message.match(/https:\/\/[^\s]+/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
        
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center p-6">
              <div class="max-w-md mx-auto">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">Cần tạo Index cho Firestore</h3>
                <p class="text-sm text-slate-600 mb-4">
                  Query này cần composite index để hoạt động. Vui lòng tạo index trong Firebase Console.
                </p>
                ${indexUrl ? `
                  <a href="${indexUrl}" target="_blank" class="btn-primary inline-block mb-2">
                    <i class="fas fa-external-link-alt mr-2"></i>Tạo Index (Tự động)
                  </a>
                  <p class="text-xs text-slate-500 mt-2">
                    Sau khi tạo index, đợi 1-5 phút rồi refresh trang này.
                  </p>
                ` : `
                  <p class="text-xs text-slate-500">
                    Vào Firebase Console > Firestore > Indexes để tạo index thủ công.
                  </p>
                `}
              </div>
            </td>
          </tr>
        `;
        } else {
        // Other errors
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center p-4 text-red-500">
              <i class="fas fa-exclamation-circle mr-2"></i>
              Lỗi tải dữ liệu: ${error.message}
            </td>
          </tr>
        `;
      }
    }
  }

  window.setup_myTasksView = function () {
    if (!currentUser || !currentUserProfile) return;
    myTasksCurrentPage = 1; // Reset page
    
    // Load initial page with server-side pagination
    loadMyTasksPage(true);
  };

  /**
   * Loads activity log page with server-side pagination
   * @param {boolean} resetPage - Whether to reset to page 1
   * @param {boolean} loadNext - Whether to load next page
   */
  async function loadActivityLogPage(resetPage = false, loadNext = false) {
    const tableBody = mainContentContainer.querySelector("#activityLogTableBody");
    if (!tableBody) return;

    if (resetPage) {
      activityLogCurrentPage = 1;
      activityLogLastVisible = null;
      activityLogsCache = [];
    }

    // Show loading state
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4">Đang tải...</td></tr>`;

    try {
      // Build query with pagination
      let q = query(
      collection(db, `/artifacts/${canvasAppId}/public/data/activityLogs`),
        orderBy("timestamp", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      // Add startAfter for pagination
      if (loadNext && activityLogLastVisible) {
        q = query(q, startAfter(activityLogLastVisible));
      }

      // Execute query
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((doc) => doc.data());

      // Update cache and state
      if (resetPage) {
        activityLogsCache = logs;
      } else if (loadNext) {
        activityLogsCache = [...activityLogsCache, ...logs];
      } else {
        activityLogsCache = logs;
      }

      // Update pagination state
      activityLogLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      activityLogHasMore = snapshot.docs.length === ITEMS_PER_PAGE;

      // Update UI
      renderActivityLogTable(activityLogsCache);
      
      // Populate filter dropdowns after data is loaded
      await populateActivityLogFilters();
    } catch (error) {
      console.error("Error loading activity logs:", error);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-red-500">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
    }
  }

  window.setup_activityLogView = function () {
    if (!currentUserProfile) return;
    activityLogCurrentPage = 1; // Reset page
    
    // Search input event listener
    const activityLogSearchInput = mainContentContainer.querySelector("#activityLogSearchInput");
    if (activityLogSearchInput) {
      activityLogSearchInput.value = activityLogSearchTerm; // Restore previous search term
      activityLogSearchInput.addEventListener("input", (e) => {
        activityLogSearchTerm = e.target.value.trim().toLowerCase();
        // Re-render table with current cache using the search filter
        renderActivityLogTable(activityLogsCache);
      });
    }

    // Populate filter dropdowns (async, will complete after data loads)
    populateActivityLogFilters().catch((error) => {
      console.error("Error populating activity log filters:", error);
    });

    // Set up toggle filter section
    const toggleFiltersBtn = mainContentContainer.querySelector("#toggleActivityLogFiltersBtn");
    const filterSection = mainContentContainer.querySelector("#activityLogFilterSection");
    
    if (toggleFiltersBtn && filterSection) {
      toggleFiltersBtn.addEventListener("click", () => {
        filterSection.classList.toggle("hidden");
        if (!filterSection.classList.contains("hidden")) {
          updateActiveActivityLogFiltersCount();
        }
      });
    }

    // Set up filter event listeners
    const applyFiltersBtn = mainContentContainer.querySelector("#applyActivityLogFiltersBtn");
    const clearFiltersBtn = mainContentContainer.querySelector("#clearActivityLogFiltersBtn");
    
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", filterActivityLog);
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        // Clear all filter inputs
        const actorFilter = mainContentContainer.querySelector("#activityLogFilterActor");
        const actionFilter = mainContentContainer.querySelector("#activityLogFilterAction");
        const dateFromFilter = mainContentContainer.querySelector("#activityLogFilterDateFrom");
        const dateToFilter = mainContentContainer.querySelector("#activityLogFilterDateTo");

        if (actorFilter) actorFilter.value = "";
        if (actionFilter) actionFilter.value = "";
        if (dateFromFilter) dateFromFilter.value = "";
        if (dateToFilter) dateToFilter.value = "";

        activityLogFilters = {
          actor: "",
          action: "",
          dateFrom: "",
          dateTo: ""
        };

        // Re-render table with cleared filters
        renderActivityLogTable(activityLogsCache);
        updateActiveActivityLogFiltersCount();
      });
    }

    // Update filter count when filter inputs change
    const filterSelects = [
      mainContentContainer.querySelector("#activityLogFilterActor"),
      mainContentContainer.querySelector("#activityLogFilterAction")
    ];

    const filterInputs = [
      mainContentContainer.querySelector("#activityLogFilterDateFrom"),
      mainContentContainer.querySelector("#activityLogFilterDateTo")
    ];

    filterSelects.forEach((select) => {
      if (select) {
        select.addEventListener("change", updateActiveActivityLogFiltersCount);
      }
    });

    filterInputs.forEach((input) => {
      if (input) {
        input.addEventListener("change", updateActiveActivityLogFiltersCount);
        input.addEventListener("input", updateActiveActivityLogFiltersCount);
      }
    });
    
    // Load initial page with server-side pagination
    loadActivityLogPage(true);
  };

  /**
   * Opens the My Profile modal and populates it with current user data
   */
  function openMyProfileModal() {
    if (!currentUserProfile || !currentUser) {
      console.error("Cannot open profile modal: missing user data");
      return;
    }
    
    if (!myProfileModal) {
      console.error("Cannot open profile modal: myProfileModal not found");
      myProfileModal = document.getElementById("myProfileModal");
      if (!myProfileModal) {
        alert("Không thể mở hồ sơ. Vui lòng tải lại trang.");
        return;
      }
    }
    
    // Ngăn chặn mở modal hồ sơ nếu chưa đổi mật khẩu
    if (currentUserProfile.requiresPasswordChange) {
      promptForcePasswordChange();
      return;
    }

    // Populate profile fields
    const emailInput = myProfileModal.querySelector("#profileEmail");
    const employeeIdInput = myProfileModal.querySelector("#profileEmployeeId");
    const roleInput = myProfileModal.querySelector("#profileRole");
    const displayNameInput = myProfileModal.querySelector("#profileDisplayName");

    if (emailInput) emailInput.value = currentUserProfile.email || currentUser.email || "";
    if (employeeIdInput) employeeIdInput.value = currentUserProfile.employeeId || "N/A";
    if (roleInput) roleInput.value = currentUserProfile.role || "N/A";
    if (displayNameInput) displayNameInput.value = currentUserProfile.displayName || "";

    // Clear password fields
    const currentPasswordInput = myProfileModal.querySelector("#profileCurrentPassword");
    const newPasswordInput = myProfileModal.querySelector("#profileNewPassword");
    const confirmPasswordInput = myProfileModal.querySelector("#profileConfirmPassword");
    if (currentPasswordInput) currentPasswordInput.value = "";
    if (newPasswordInput) newPasswordInput.value = "";
    if (confirmPasswordInput) confirmPasswordInput.value = "";

    // Clear messages
    const profileUpdateMessage = myProfileModal.querySelector("#profileUpdateMessage");
    const passwordChangeMessage = myProfileModal.querySelector("#passwordChangeMessage");
    if (profileUpdateMessage) {
      profileUpdateMessage.classList.add("hidden");
      profileUpdateMessage.textContent = "";
    }
    if (passwordChangeMessage) {
      passwordChangeMessage.classList.add("hidden");
      passwordChangeMessage.textContent = "";
    }

    // Setup event listeners
    setupMyProfileModalListeners();

    // Show modal
    myProfileModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  /**
   * Closes the My Profile modal
   */
  function closeMyProfileModal() {
    if (!myProfileModal) return;
    myProfileModal.style.display = "none";
    document.body.style.overflow = "";
  }

  /**
   * Sets up event listeners for My Profile modal buttons
   */
  function setupMyProfileModalListeners() {
    if (!myProfileModal) return;

    // Update Profile button
    const updateProfileBtn = myProfileModal.querySelector("#updateProfileBtn");
    if (updateProfileBtn) {
      updateProfileBtn.replaceWith(updateProfileBtn.cloneNode(true)); // Remove old listeners
      myProfileModal.querySelector("#updateProfileBtn").addEventListener("click", handleUpdateProfile);
    }

    // Change Password button
    const changePasswordBtn = myProfileModal.querySelector("#changePasswordBtn");
    if (changePasswordBtn) {
      changePasswordBtn.replaceWith(changePasswordBtn.cloneNode(true)); // Remove old listeners
      myProfileModal.querySelector("#changePasswordBtn").addEventListener("click", handleChangePassword);
    }
  }

  /**
   * Populates activity log filter dropdowns
   * - Actor filter: queries all users from users collection
   * - Action filter: populated from activity logs cache
   */
  async function populateActivityLogFilters() {
    const actorFilter = mainContentContainer.querySelector("#activityLogFilterActor");
    const actionFilter = mainContentContainer.querySelector("#activityLogFilterAction");
    
    // Populate actor filter from users collection (all users, not just from cache)
    if (actorFilter) {
      const currentValue = actorFilter.value;
      
      try {
        // Query all users from users collection
        // Try with orderBy first, fallback to no orderBy if index doesn't exist
        let usersSnapshot;
        try {
          const usersQuery = query(
            collection(db, `/artifacts/${canvasAppId}/users`),
            orderBy("displayName")
          );
          usersSnapshot = await getDocs(usersQuery);
        } catch (orderByError) {
          // If orderBy fails (likely missing index), query without orderBy and sort client-side
          console.warn("orderBy('displayName') failed, querying without orderBy:", orderByError);
          const usersQuery = query(collection(db, `/artifacts/${canvasAppId}/users`));
          usersSnapshot = await getDocs(usersQuery);
        }

        const users = usersSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        // Filter out disabled users (optional, you might want to show all)
        const activeUsers = users.filter((user) => !user.disabled && user.status !== "disabled");

        // Sort by displayName (client-side if orderBy wasn't used)
        activeUsers.sort((a, b) => {
          const nameA = (a.displayName || a.email || "").toLowerCase();
          const nameB = (b.displayName || b.email || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        // Build actor options
        actorFilter.innerHTML = '<option value="">Tất cả</option>';
        activeUsers.forEach((user) => {
          const displayName = user.displayName || "";
          const email = user.email || "";
          const displayText = displayName || email || "N/A";
          // Use displayName as primary value, fallback to email
          const filterValue = displayName || email;
          
          if (filterValue) {
            const option = document.createElement("option");
            option.value = filterValue;
            option.textContent = displayText;
            // Store email as data attribute for filtering
            if (email && email !== filterValue) {
              option.setAttribute("data-email", email);
            }
            actorFilter.appendChild(option);
          }
        });

        // Restore previous selection if it still exists
        if (currentValue) {
          const optionExists = Array.from(actorFilter.options).some(
            (opt) => opt.value === currentValue
          );
          if (optionExists) {
            actorFilter.value = currentValue;
          }
        }
      } catch (error) {
        console.error("Error loading users for activity log filter:", error);
        // Fallback to cache if query fails
        if (activityLogsCache.length > 0) {
          const currentValue = actorFilter.value;
          const uniqueActors = new Set();
          
          activityLogsCache.forEach((log) => {
            const actorName = log.actor?.displayName || "";
            const actorEmail = log.actor?.email || "";
            if (actorName) uniqueActors.add(actorName);
            if (actorEmail) uniqueActors.add(actorEmail);
          });
          
          actorFilter.innerHTML = '<option value="">Tất cả</option>';
          Array.from(uniqueActors).sort().forEach((actor) => {
            const option = document.createElement("option");
            option.value = actor;
            option.textContent = actor;
            actorFilter.appendChild(option);
          });
          
          if (currentValue && uniqueActors.has(currentValue)) {
            actorFilter.value = currentValue;
          }
        }
      }
    }

    // Populate action filter from cache (actions are not stored in users collection)
    if (actionFilter && activityLogsCache.length > 0) {
      const currentValue = actionFilter.value;
      const uniqueActions = new Set();
      
      activityLogsCache.forEach((log) => {
        if (log.action) uniqueActions.add(log.action);
      });
      
      actionFilter.innerHTML = '<option value="">Tất cả</option>';
      Array.from(uniqueActions).sort().forEach((action) => {
        const option = document.createElement("option");
        option.value = action;
        option.textContent = action;
        actionFilter.appendChild(option);
      });
      
      if (currentValue && uniqueActions.has(currentValue)) {
        actionFilter.value = currentValue;
      }
    }
  }

  /**
   * Updates the active filters count badge
   */
  function updateActiveActivityLogFiltersCount() {
    const activeFiltersCount = mainContentContainer.querySelector("#activeActivityLogFiltersCount");
    if (!activeFiltersCount) return;

    const actorFilter = mainContentContainer.querySelector("#activityLogFilterActor")?.value || "";
    const actionFilter = mainContentContainer.querySelector("#activityLogFilterAction")?.value || "";
    const dateFromFilter = mainContentContainer.querySelector("#activityLogFilterDateFrom")?.value || "";
    const dateToFilter = mainContentContainer.querySelector("#activityLogFilterDateTo")?.value || "";

    let count = 0;
    if (actorFilter) count++;
    if (actionFilter) count++;
    if (dateFromFilter) count++;
    if (dateToFilter) count++;

    if (count > 0) {
      activeFiltersCount.textContent = `${count} bộ lọc đang hoạt động`;
      activeFiltersCount.classList.remove("hidden");
    } else {
      activeFiltersCount.classList.add("hidden");
    }
  }

  /**
   * Applies filters to activity log
   */
  function filterActivityLog() {
    const actorFilter = mainContentContainer.querySelector("#activityLogFilterActor")?.value || "";
    const actionFilter = mainContentContainer.querySelector("#activityLogFilterAction")?.value || "";
    const dateFromFilter = mainContentContainer.querySelector("#activityLogFilterDateFrom")?.value || "";
    const dateToFilter = mainContentContainer.querySelector("#activityLogFilterDateTo")?.value || "";

    activityLogFilters = {
      actor: actorFilter,
      action: actionFilter,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter
    };

    // Re-render table with filters applied
    renderActivityLogTable(activityLogsCache);
    updateActiveActivityLogFiltersCount();
  }

  // --- Table Rendering ---
  function renderActivityLogTable(logs) {
    const tableBody = mainContentContainer.querySelector("#activityLogTableBody");
    if (!tableBody) return;

    // Apply search filter if search term exists
    let filteredLogs = logs;
    if (activityLogSearchTerm) {
      filteredLogs = filteredLogs.filter((log) => {
        const actorName = (log.actor?.displayName || "").toLowerCase();
        const actorEmail = (log.actor?.email || "").toLowerCase();
        const action = (log.action || "").toLowerCase();
        const details = JSON.stringify(log.details || {}).toLowerCase();
        const timestamp = log.timestamp 
          ? new Date(log.timestamp.toDate()).toLocaleString("vi-VN").toLowerCase()
          : "";
        
        return (
          actorName.includes(activityLogSearchTerm) ||
          actorEmail.includes(activityLogSearchTerm) ||
          action.includes(activityLogSearchTerm) ||
          details.includes(activityLogSearchTerm) ||
          timestamp.includes(activityLogSearchTerm)
        );
      });
    }

    // Apply filters
    if (activityLogFilters.actor) {
      filteredLogs = filteredLogs.filter((log) => {
        const actorName = log.actor?.displayName || "";
        const actorEmail = log.actor?.email || "";
        return actorName === activityLogFilters.actor || actorEmail === activityLogFilters.actor;
      });
    }

    if (activityLogFilters.action) {
      filteredLogs = filteredLogs.filter((log) => {
        return (log.action || "") === activityLogFilters.action;
      });
    }

    if (activityLogFilters.dateFrom) {
      const dateFrom = new Date(activityLogFilters.dateFrom);
      dateFrom.setHours(0, 0, 0, 0);
      filteredLogs = filteredLogs.filter((log) => {
        if (!log.timestamp) return false;
        const logDate = log.timestamp.toDate();
        logDate.setHours(0, 0, 0, 0);
        return logDate >= dateFrom;
      });
    }

    if (activityLogFilters.dateTo) {
      const dateTo = new Date(activityLogFilters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      filteredLogs = filteredLogs.filter((log) => {
        if (!log.timestamp) return false;
        const logDate = log.timestamp.toDate();
        return logDate <= dateTo;
      });
    }

    // With server-side pagination, show all loaded logs (no client-side slicing)
    tableBody.innerHTML =
      filteredLogs.length > 0
        ? filteredLogs
            .map(
              (log) => `
          <tr class="hover:bg-gray-50">
              <td data-label="Thời Gian" class="px-4 py-3">${
                log.timestamp
                  ? new Date(log.timestamp.toDate()).toLocaleString("vi-VN")
                  : ""
              }</td>
              <td data-label="Người Thực Hiện" class="px-4 py-3">${
                log.actor.displayName || log.actor.email
              }</td>
              <td data-label="Hành Động" class="px-4 py-3">${log.action}</td>
              <td data-label="Chi Tiết" class="px-4 py-3 text-xs font-mono">${JSON.stringify(
                log.details
              )}</td>
          </tr>
      `
            )
            .join("")
        : `<tr><td colspan="4" class="text-center p-4">Không có hoạt động nào.</td></tr>`;

    renderActivityLogPagination(filteredLogs.length);
  }

  function renderActivityLogPagination(totalLogs) {
    const paginationContainer = mainContentContainer.querySelector(
      "#activityLogPagination"
    );
    if (!paginationContainer) return;

    // Server-side pagination with Load More button
    if (activityLogHasMore) {
      paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalLogs}</strong> kết quả (còn thêm dữ liệu)
          </div>
          <div class="flex items-center space-x-2">
              <button id="loadMoreActivityLogBtn" class="btn-primary !py-1 !px-3">
                  <i class="fas fa-chevron-down mr-1"></i>Tải thêm
              </button>
          </div>`;

      const loadMoreBtn = mainContentContainer.querySelector("#loadMoreActivityLogBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", async () => {
          loadMoreBtn.disabled = true;
          loadMoreBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang tải...`;
          await loadActivityLogPage(false, true);
          loadMoreBtn.disabled = false;
          loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down mr-1"></i>Tải thêm`;
      });
    }
    } else {
      paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalLogs}</strong> kết quả
          </div>`;
    }
  }

  function renderIssueHistoryTable(reports) {
    const tableBody = mainContentContainer.querySelector(
      "#issueHistoryTableBody"
    );
    if (!tableBody) return;

    // With server-side pagination, show all loaded reports (no client-side slicing)
    tableBody.innerHTML =
      reports.length > 0
        ? reports
            .map((report) => {
              // Logic mới để tạo chi tiết vị trí
              let locationDetail = "";
              if (report.issueScope === "all_rooms") {
                locationDetail = `<span class="italic text-slate-500">Tất cả phòng</span>`;
              } else if (report.specificRooms) {
                const firstRoom = report.specificRooms.split(", ")[0];
                const locationInfo = roomToLocationMap[firstRoom];
                const floorName = locationInfo ? `${locationInfo.floor}` : "N/A";

                locationDetail = `
                      <div class="text-xs">
                          <span class="font-semibold">Tầng:</span> ${floorName}<br>
                          <span class="font-semibold">Phòng:</span> ${report.specificRooms}
                      </div>
                    `;
              }

              return `
                  <tr class="hover:bg-gray-50">
                      <td data-label="Chi nhánh" class="px-4 py-3">${
                        report.issueBranch
                      }</td>
                      <td data-label="Vị trí cụ thể" class="px-4 py-3">${locationDetail}</td>
                      <td data-label="Người gửi" class="px-4 py-3">${
                        report.reporterName
                      }</td>
                      <td data-label="Loại sự cố" class="px-4 py-3">${
                        report.issueType
                      }</td>
                      <td data-label="Ngày báo cáo" class="px-4 py-3">${new Date(
                        report.reportDate
                      ).toLocaleString("vi-VN")}</td>
                      <td data-label="Trạng thái" class="px-4 py-3">${
                        report.status
                      }</td>
                      <td data-label="Hành động" class="px-4 py-3 text-right">
                          <button class="detail-issue-btn btn-secondary !text-sm !py-1 !px-2" data-id="${report.id}">Chi tiết</button>
                      </td>
                  </tr>
                `;
            })
            .join("")
        : `<tr><td colspan="7" class="text-center p-4">Không có báo cáo nào.</td></tr>`;

    tableBody.querySelectorAll(".detail-issue-btn").forEach((btn) => {
      btn.addEventListener("click", () => openIssueDetailModal(btn.dataset.id));
    });
    renderIssueHistoryPagination(reports.length);
  }

  function renderIssueHistoryPagination(totalItems) {
    const paginationContainer = mainContentContainer.querySelector(
      "#issueHistoryPagination"
    );
    if (!paginationContainer) return;

    paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalItems}</strong> kết quả
              ${issueHistoryHasMore ? `(còn thêm dữ liệu)` : ``}
          </div>
          <div class="flex items-center space-x-2">
              ${issueHistoryHasMore ? `
              <button id="loadMoreIssueHistoryBtn" class="btn-primary !py-1 !px-3">
                  <i class="fas fa-chevron-down mr-1"></i>Tải thêm
              </button>
              ` : ``}
          </div>`;

    // Add event listener for Load More button
    if (issueHistoryHasMore) {
      const loadMoreBtn = mainContentContainer.querySelector("#loadMoreIssueHistoryBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", async () => {
          loadMoreBtn.disabled = true;
          loadMoreBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang tải...`;
          await loadIssueHistoryPage(false, true); // Load next page
          loadMoreBtn.disabled = false;
          loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down mr-1"></i>Tải thêm`;
        });
        }
    }
  }

  function renderMyTasksTable(tasks) {
    const tableBody = mainContentContainer.querySelector("#myTasksTableBody");
    if (!tableBody) return;

    // With server-side pagination, show all loaded tasks (no client-side slicing)
    tableBody.innerHTML =
      tasks.length > 0
        ? tasks
            .map(
              (task) => `
          <tr class="hover:bg-gray-50">
              <td data-label="Chi nhánh" class="px-4 py-3">${
                task.issueBranch
              }</td>
              <td data-label="Loại sự cố" class="px-4 py-3">${
                task.issueType
              }</td>
              <td data-label="Ngày báo cáo" class="px-4 py-3">${new Date(
                task.reportDate
              ).toLocaleString("vi-VN")}</td>
              <td data-label="Trạng thái" class="px-4 py-3">${task.status}</td>
              <td data-label="Hành động" class="px-4 py-3 text-right">
                  <button class="detail-issue-btn btn-secondary !text-sm !py-1 !px-2" data-id="${
                    task.id
                  }">Chi tiết</button>
              </td>
          </tr>
      `
            )
            .join("")
        : `<tr><td colspan="5" class="text-center p-4" style="text-align: center !important; display: table-cell !important; width: 100%;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem;">
              <i class="fas fa-tasks text-4xl text-slate-300 mb-3"></i>
              <p class="text-sm sm:text-base text-slate-600">Bạn không có nhiệm vụ nào được giao.</p>
            </div>
          </td></tr>`;

    tableBody.querySelectorAll(".detail-issue-btn").forEach((btn) => {
      btn.addEventListener("click", () => openIssueDetailModal(btn.dataset.id));
    });
    renderMyTasksPagination(tasks.length);
  }

  function renderMyTasksPagination(totalTasks) {
    const paginationContainer = mainContentContainer.querySelector(
      "#myTasksPagination"
    );
    if (!paginationContainer) return;

    // Server-side pagination with Load More button
    if (myTasksHasMore) {
    paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalTasks}</strong> kết quả (còn thêm dữ liệu)
          </div>
          <div class="flex items-center space-x-2">
              <button id="loadMoreMyTasksBtn" class="btn-primary !py-1 !px-3">
                  <i class="fas fa-chevron-down mr-1"></i>Tải thêm
              </button>
          </div>`;

      const loadMoreBtn = mainContentContainer.querySelector("#loadMoreMyTasksBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", async () => {
          loadMoreBtn.disabled = true;
          loadMoreBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang tải...`;
          await loadMyTasksPage(false, true);
          loadMoreBtn.disabled = false;
          loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down mr-1"></i>Tải thêm`;
        });
        }
    } else {
      paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalTasks}</strong> kết quả
          </div>`;
        }
  }

  // TÌM VÀ THAY THẾ TOÀN BỘ HÀM NÀY TRONG app.js

  /**
   * Updates the accounts count display
   * @param {number} totalAllAccounts - Total number of all accounts (including disabled)
   * @param {number} totalCount - Total number of accounts (after disabled filter)
   * @param {number} displayedCount - Number of accounts currently displayed (after search filter)
   * @param {string} searchTerm - Current search term (if any)
   */
  function updateAccountsCountDisplay(totalAllAccounts, totalCount, displayedCount, searchTerm) {
    const countTextEl = mainContentContainer.querySelector("#accountsCountText");
    if (!countTextEl) return;

    if (searchTerm && searchTerm.trim()) {
      // Show filtered count vs visible count vs total all
      if (displayedCount < totalCount) {
        countTextEl.innerHTML = `Hiển thị <span class="font-semibold text-indigo-600">${displayedCount}</span> / <span class="font-semibold">${totalCount}</span> (Tổng: <span class="font-semibold">${totalAllAccounts}</span>) tài khoản`;
      } else {
        countTextEl.innerHTML = `Hiển thị <span class="font-semibold">${totalCount}</span> (Tổng: <span class="font-semibold">${totalAllAccounts}</span>) tài khoản`;
      }
    } else {
      // Always show total all accounts
      if (showDisabledAccounts || totalCount === totalAllAccounts) {
        // If showing disabled accounts or no disabled accounts, show total with "Tổng:"
        countTextEl.innerHTML = `Tổng: <span class="font-semibold">${totalAllAccounts}</span> tài khoản`;
      } else {
        // Show visible count and total all
        countTextEl.innerHTML = `Hiển thị <span class="font-semibold">${totalCount}</span> / Tổng: <span class="font-semibold">${totalAllAccounts}</span> tài khoản`;
      }
    }
  }

  function renderAccountsTable(users) {
    const tableBody = mainContentContainer.querySelector("#accountsTableBody");
    if (!tableBody) return;

    // Store total all accounts (including disabled) from unfiltered cache
    // If we have unfiltered cache, use it; otherwise use current users array length
    const totalAllAccounts = allUsersCacheUnfiltered.length > 0 
      ? allUsersCacheUnfiltered.length 
      : users.length;

    // Filter disabled accounts if needed (already filtered in loadAccountsPage, but double-check)
    let filteredUsers = showDisabledAccounts
      ? users
      : users.filter((user) => user.status !== "disabled" && !user.disabled);

    // Store total count after disabled filter (before search filter)
    const totalCount = filteredUsers.length;

    // Apply search filter if search term exists
    if (accountsSearchTerm) {
      filteredUsers = filteredUsers.filter((user) => {
        // Convert all values to string before calling toLowerCase()
        const displayName = String(user.displayName || "").toLowerCase();
        const email = String(user.email || "").toLowerCase();
        const employeeId = String(user.employeeId || "").toLowerCase();
        const role = String(user.role || "").toLowerCase();
        const branch = String(user.branch || "").toLowerCase();
        
        return (
          displayName.includes(accountsSearchTerm) ||
          email.includes(accountsSearchTerm) ||
          employeeId.includes(accountsSearchTerm) ||
          role.includes(accountsSearchTerm) ||
          branch.includes(accountsSearchTerm)
        );
      });
    }

    // Update accounts count display (pass total all, visible after disabled filter, displayed after search)
    updateAccountsCountDisplay(totalAllAccounts, totalCount, filteredUsers.length, accountsSearchTerm);

    // With server-side pagination, show all loaded users (no client-side slicing)

    tableBody.innerHTML =
      filteredUsers.length > 0
        ? filteredUsers.map((user) => {
          const isDisabled = user.status === "disabled";
          // Thêm ': '' vào cuối để hoàn thiện biểu thức điều kiện
          const exportButtonHTML =
            currentUserProfile.role === "Admin" ||
            currentUserProfile.role === "Manager"
              ? `<button class="export-user-attendance-btn btn-secondary !text-xs !py-1 !px-2 mr-2" data-uid="${user.uid}" data-name="${user.displayName}" title="Xuất file chấm công">
                  <i class="fas fa-file-alt"></i> CC
              </button>`
              : ""; // Thêm phần else để trả về chuỗi rỗng nếu không phải Admin/Manager

          return `
              <tr class="hover:bg-gray-50 ${
                isDisabled ? "opacity-60 bg-slate-50" : ""
              }">
                  <td data-label="MSNV" class="px-4 py-3">${
                    user.employeeId || "N/A"
                  }</td>
                  <td data-label="Tên Người Dùng" class="px-4 py-3">${
                    user.displayName
                  } ${
            isDisabled
              ? '<span class="text-xs text-red-500 font-semibold">(Đã vô hiệu hóa)</span>'
              : ""
          }</td>
                  <td data-label="Email" class="px-4 py-3">${user.email}</td>
                  <td data-label="Vai Trò" class="px-4 py-3">${user.role}</td>
                  <td data-label="Chi Nhánh" class="px-4 py-3">${user.branch || "N/A"}</td>
                  <td data-label="Hành động" class="px-4 py-3 text-right">
                      ${exportButtonHTML}
                      <button class="edit-user-btn btn-secondary !text-sm !py-1 !px-2 mr-2" data-uid="${
                        user.uid
                      }" ${isDisabled ? "disabled" : ""}>Sửa</button>
                      ${
                        user.uid !== currentUser.uid
                          ? isDisabled
                            ? `<button class="enable-user-btn btn-primary !text-sm !py-1 !px-2" data-uid="${user.uid}">Kích hoạt</button>`
                            : `<button class="delete-user-btn btn-danger !text-sm !py-1 !px-2" data-uid="${user.uid}" data-name="${user.displayName}">Vô hiệu hóa</button>`
                          : ""
                      }
                  </td>
              </tr>
          `;
        })
        .join("")
        : `<tr><td colspan="6" class="text-center p-4">Không có tài khoản nào.</td></tr>`;

    // Gắn sự kiện cho các nút Sửa, Xóa...
    tableBody.querySelectorAll(".edit-user-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const userToEdit = users.find((u) => u.uid === btn.dataset.uid);
        if (userToEdit) populateEditAccountModal(userToEdit);
      });
    });

    tableBody.querySelectorAll(".delete-user-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openDeleteAccountModal(btn.dataset.uid, btn.dataset.name);
      });
    });

    tableBody.querySelectorAll(".enable-user-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        handleEnableAccount(btn.dataset.uid);
      });
    });

    // Gắn sự kiện cho các nút Xuất CC
    tableBody.querySelectorAll(".export-user-attendance-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const { uid, name } = e.currentTarget.dataset;
        handleExportSingleUserAttendance(uid, name, e.currentTarget);
      });
    });

    renderAccountsPagination(filteredUsers.length);
  }

  function renderAccountsPagination(totalItems) {
    const paginationContainer = mainContentContainer.querySelector(
      "#accountsPagination"
    );
    if (!paginationContainer) return;

    // Server-side pagination with Load More button
    if (accountsHasMore) {
    paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalItems}</strong> kết quả (còn thêm dữ liệu)
          </div>
          <div class="flex items-center space-x-2">
              <button id="loadMoreAccountsBtn" class="btn-primary !py-1 !px-3">
                  <i class="fas fa-chevron-down mr-1"></i>Tải thêm
              </button>
          </div>`;

      const loadMoreBtn = mainContentContainer.querySelector("#loadMoreAccountsBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", async () => {
          loadMoreBtn.disabled = true;
          loadMoreBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang tải...`;
          await loadAccountsPage(false, true);
          loadMoreBtn.disabled = false;
          loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down mr-1"></i>Tải thêm`;
        });
        }
    } else {
      paginationContainer.innerHTML = `
          <div class="text-sm text-slate-600">
              Hiển thị <strong>${totalItems}</strong> kết quả
          </div>`;
        }
  }

  // --- Dashboard & Analytics ---
  function updateDashboardWarnings(allReports) {
    const dailySpikeEl = document.getElementById("dailySpikeWarning");
    const backlogEl = document.getElementById("backlogWarning");

    if (!dailySpikeEl || !backlogEl) return;

    // --- 1. Abnormal Daily Incident Increase Logic ---
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgoStart = new Date(
      todayStart.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const todaysIncidentsCount = allReports.filter(
      (r) => new Date(r.reportDate) >= todayStart
    ).length;

    const last7DaysIncidents = allReports.filter((r) => {
      const reportDate = new Date(r.reportDate);
      return reportDate >= sevenDaysAgoStart && reportDate < todayStart;
    });

    const uniqueDaysInPast = new Set(
      last7DaysIncidents.map(
        (r) => new Date(r.reportDate).toISOString().split("T")[0]
      )
    ).size;
    const daysToAverage = uniqueDaysInPast > 0 ? uniqueDaysInPast : 1; // Avoid division by zero
    const averageDailyIncidents = last7DaysIncidents.length / daysToAverage;

    // Define thresholds for what constitutes a spike
    const SPIKE_PERCENTAGE_THRESHOLD = 1.5; // 50% increase
    const SPIKE_ABSOLUTE_THRESHOLD = 3; // At least 3 more incidents than average

    if (
      todaysIncidentsCount > averageDailyIncidents * SPIKE_PERCENTAGE_THRESHOLD &&
      todaysIncidentsCount > averageDailyIncidents + SPIKE_ABSOLUTE_THRESHOLD
    ) {
      dailySpikeEl.className = "alert-error p-4 rounded-lg flex items-start";
      dailySpikeEl.innerHTML = `
              <i class="fas fa-chart-line fa-lg mr-3 mt-1"></i>
              <div>
                  <h4 class="font-bold">Cảnh báo: Số lượng sự cố tăng đột biến</h4>
                  <p class="text-sm">Hôm nay đã ghi nhận <strong>${todaysIncidentsCount}</strong> sự cố, cao hơn đáng kể so với mức trung bình <strong>${averageDailyIncidents.toFixed(
        1
      )}</strong> sự cố/ngày trong 7 ngày qua.</p>
              </div>
          `;
      dailySpikeEl.classList.remove("hidden");
    } else {
      dailySpikeEl.classList.add("hidden");
    }

    // --- 2. Employee/Branch Backlog Warning ---
    const EMPLOYEE_BACKLOG_THRESHOLD = 5;
    const BRANCH_BACKLOG_THRESHOLD = 10;

    const unresolvedReports = allReports.filter(
      (r) => r.status !== "Đã giải quyết"
    );

    const employeeBacklog = unresolvedReports.reduce((acc, report) => {
      if (report.assigneeName) {
        acc[report.assigneeName] = (acc[report.assigneeName] || 0) + 1;
      }
      return acc;
    }, {});

    const branchBacklog = unresolvedReports.reduce((acc, report) => {
      if (report.issueBranch) {
        acc[report.issueBranch] = (acc[report.issueBranch] || 0) + 1;
      }
      return acc;
    }, {});

    const highBacklogEmployees = Object.entries(employeeBacklog)
      .filter(([name, count]) => count >= EMPLOYEE_BACKLOG_THRESHOLD)
      .sort((a, b) => b[1] - a[1]); // Sort by count desc

    const highBacklogBranches = Object.entries(branchBacklog)
      .filter(([name, count]) => count >= BRANCH_BACKLOG_THRESHOLD)
      .sort((a, b) => b[1] - a[1]);

    if (highBacklogEmployees.length > 0 || highBacklogBranches.length > 0) {
      let warningHTML = `
              <i class="fas fa-exclamation-circle fa-lg mr-3 mt-1"></i>
              <div>
                  <h4 class="font-bold">Cảnh báo: Tồn đọng công việc</h4>`;

      if (highBacklogEmployees.length > 0) {
        warningHTML += `<p class="text-sm mt-1">Các nhân viên sau có nhiều công việc chưa hoàn thành:</p><ul class="list-disc pl-5 text-sm">`;
        highBacklogEmployees.forEach(([name, count]) => {
          warningHTML += `<li><strong>${name}</strong>: ${count} công việc tồn đọng</li>`;
        });
        warningHTML += `</ul>`;
      }

      if (highBacklogBranches.length > 0) {
        warningHTML += `<p class="text-sm mt-2">Các chi nhánh sau có nhiều sự cố chưa được giải quyết:</p><ul class="list-disc pl-5 text-sm">`;
        highBacklogBranches.forEach(([name, count]) => {
          warningHTML += `<li><strong>${name}</strong>: ${count} sự cố tồn đọng</li>`;
        });
        warningHTML += `</ul>`;
      }

      warningHTML += `</div>`;

      backlogEl.className = "alert-info p-4 rounded-lg flex items-start";
      backlogEl.innerHTML = warningHTML;
      backlogEl.classList.remove("hidden");
    } else {
      backlogEl.classList.add("hidden");
    }
  }

  /**
   * Loads dashboard data with server-side filtering
   * Similar to loadIssueHistoryPage but for dashboard
   */
  async function loadDashboardWithFilters() {
    const branch = mainContentContainer.querySelector("#filterBranch")?.value || "";
    const issueType = mainContentContainer.querySelector("#filterIssueType")?.value || "";
    const employeeId = mainContentContainer.querySelector("#filterEmployee")?.value || "";
    const startDate = mainContentContainer.querySelector("#filterStartDate")?.value || "";
    const endDate = mainContentContainer.querySelector("#filterEndDate")?.value || "";

    // Check if any filters are applied
    const hasFilters = branch || issueType || employeeId || startDate || endDate;

    if (!hasFilters) {
      // No filters: use aggregated data or cached data
      const aggregationDocRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/dashboardAggregation/main`
      );
      try {
        const aggregationDoc = await getDoc(aggregationDocRef);
        if (aggregationDoc.exists()) {
          renderDashboardFromAggregatedData(aggregationDoc.data());
          // Still load warnings from full cache
          updateDashboardWarnings(dashboardReportsCache);
          return;
        }
      } catch (error) {
        console.error("Error loading aggregated data:", error);
      }
      
      // Fallback: use cached data if no aggregation
      if (dashboardReportsCache && dashboardReportsCache.length > 0) {
        applyFiltersAndRenderClientSide(dashboardReportsCache);
        return;
      }
    }

    // Has filters: query from Firestore with server-side filtering
    try {
      // Build base query with scope restrictions
      let q = getScopedIssuesQuery();

      // Apply server-side filters
      if (branch) {
        q = query(q, where("issueBranch", "==", branch));
      }
      if (issueType) {
        q = query(q, where("issueType", "==", issueType));
      }
      if (employeeId) {
        // For employee filter, we need to check both reporterId and assigneeId
        // Firestore doesn't support OR queries easily, so we'll do two queries and merge
        // Or we can filter client-side for employeeId
      }
      // Note: Firestore date queries work with ISO strings or Timestamp
      // Since reportDate is stored as ISO string, we can query directly
      // But we need orderBy before where for date range queries
      // So we'll add orderBy first, then where clauses
      q = query(q, orderBy("reportDate", "desc"));
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        // reportDate is stored as ISO string, so compare as string
        q = query(q, where("reportDate", ">=", start.toISOString()));
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        q = query(q, where("reportDate", "<=", end.toISOString()));
      }

      // Limit to reasonable amount for dashboard (e.g., 5000 most recent)
      q = query(q, limit(5000));

      // Execute query
      const snapshot = await getDocs(q);
      let filteredReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Client-side filtering for employeeId (can't do OR query server-side easily)
      if (employeeId) {
        filteredReports = filteredReports.filter(
          (report) =>
            report.reporterId === employeeId || report.assigneeId === employeeId
        );
      }

      // Use filtered reports for dashboard rendering
      applyFiltersAndRenderClientSide(filteredReports, dashboardReportsCache);
    } catch (error) {
      console.error("Error loading dashboard with filters:", error);
      // Fallback to client-side filtering if server-side fails
      if (dashboardReportsCache && dashboardReportsCache.length > 0) {
        applyFiltersAndRenderClientSide(dashboardReportsCache);
      }
    }
  }

  /**
   * Client-side filtering and rendering (used when no filters or as fallback)
   */
  function applyFiltersAndRenderClientSide(allReports, fullReportsForWarnings = null) {
    const branch = mainContentContainer.querySelector("#filterBranch")?.value;
    const issueType =
      mainContentContainer.querySelector("#filterIssueType")?.value;
    const employeeId =
      mainContentContainer.querySelector("#filterEmployee")?.value;
    const startDate =
      mainContentContainer.querySelector("#filterStartDate")?.value;
    const endDate = mainContentContainer.querySelector("#filterEndDate")?.value;

    // If elements don't exist (because the tab isn't active), don't filter
    if (branch === undefined) {
      // Try to use aggregated data if available
      const aggregationDocRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/dashboardAggregation/main`
      );
      getDoc(aggregationDocRef).then((doc) => {
        if (doc.exists()) {
          updateDashboardWarningsFromAggregated(doc.data());
        } else if (allReports && allReports.length > 0) {
          updateDashboardWarnings(allReports);
        }
      });
      return;
    }

    // If we have filters applied, filter the reports
    const filteredReports = (allReports || []).filter((report) => {
      const reportDate = new Date(report.reportDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const branchMatch = !branch || report.issueBranch === branch;
      const typeMatch = !issueType || report.issueType === issueType;
      const employeeMatch =
        !employeeId ||
        report.reporterId === employeeId ||
        report.assigneeId === employeeId;
      const startDateMatch = !start || reportDate >= start;
      const endDateMatch = !end || reportDate <= end;

      return (
        branchMatch &&
        typeMatch &&
        employeeMatch &&
        startDateMatch &&
        endDateMatch
      );
    });

    // Use full reports for warnings (not affected by filters)
    const reportsForWarnings = fullReportsForWarnings || dashboardReportsCache;
    updateDashboardWarnings(reportsForWarnings);

    updateDashboardUI(filteredReports);
    updateComparativeAnalysis(allReports);
    runPredictiveAnalysis(filteredReports);
    renderIncidentTrendChart(filteredReports);
    renderIncidentHeatmap(filteredReports);
    renderEmployeePerformanceAnalysis(filteredReports);
    renderManagerPerformanceAnalysis(filteredReports);
    renderBranchPerformanceAnalysis(filteredReports);
    renderScopeAnalysis(filteredReports);
    renderLocationAnalysis(filteredReports);
  }

  /**
   * Main filter function - checks if filters are applied and routes accordingly
   */
  function applyFiltersAndRender(allReports) {
    // Check if any filters are applied
    const branch = mainContentContainer.querySelector("#filterBranch")?.value || "";
    const issueType = mainContentContainer.querySelector("#filterIssueType")?.value || "";
    const employeeId = mainContentContainer.querySelector("#filterEmployee")?.value || "";
    const startDate = mainContentContainer.querySelector("#filterStartDate")?.value || "";
    const endDate = mainContentContainer.querySelector("#filterEndDate")?.value || "";

    const hasFilters = branch || issueType || employeeId || startDate || endDate;

    if (hasFilters) {
      // Has filters: use server-side filtering
      loadDashboardWithFilters();
    } else {
      // No filters: use aggregated data or client-side with cached data
      applyFiltersAndRenderClientSide(allReports || dashboardReportsCache);
    }
  }

  function updateDashboardUI(reports) {
    // This function might be called when the view isn't active.
    const errorsTodayEl = document.getElementById("errorsToday");
    if (!errorsTodayEl) return;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(
      weekStart.getDate() -
        (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1)
    ); // Monday as start of week
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    document.getElementById("errorsToday").textContent = reports.filter(
      (r) => new Date(r.reportDate) >= todayStart
    ).length;
    document.getElementById("errorsThisWeek").textContent = reports.filter(
      (r) => new Date(r.reportDate) >= weekStart
    ).length;
    document.getElementById("errorsThisMonth").textContent = reports.filter(
      (r) => new Date(r.reportDate) >= monthStart
    ).length;

    const typeCounts = reports.reduce((acc, report) => {
      acc[report.issueType] = (acc[report.issueType] || 0) + 1;
      return acc;
    }, {});
    renderIssueTypePieChart(typeCounts);

    const statusCounts = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});
    renderStatusSummary(statusCounts, reports.length);
  }

  function updateComparativeAnalysis(allReports) {
    const now = new Date();

    // Helper to get week range (Mon-Sun)
    const getWeekRange = (date) => {
      const start = new Date(date);
      const day = start.getDay(); // 0=Sun, 1=Mon,...
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    // This Week vs Last Week
    const thisWeekRange = getWeekRange(now);
    const lastWeekDate = new Date(now);
    lastWeekDate.setDate(now.getDate() - 7);
    const lastWeekRange = getWeekRange(lastWeekDate);

    // This Month vs Last Month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // This Year vs Last Year
    const thisYearStart = new Date(now.getFullYear(), 0, 1);
    const thisYearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

    const countInDateRange = (reports, start, end) =>
      reports.filter((r) => {
        const d = new Date(r.reportDate);
        return d >= start && d <= end;
      }).length;

    const thisWeekCount = countInDateRange(
      allReports,
      thisWeekRange.start,
      thisWeekRange.end
    );
    const lastWeekCount = countInDateRange(
      allReports,
      lastWeekRange.start,
      lastWeekRange.end
    );

    const thisMonthCount = countInDateRange(
      allReports,
      thisMonthStart,
      thisMonthEnd
    );
    const lastMonthCount = countInDateRange(
      allReports,
      lastMonthStart,
      lastMonthEnd
    );

    const thisYearCount = countInDateRange(
      allReports,
      thisYearStart,
      thisYearEnd
    );
    const lastYearCount = countInDateRange(
      allReports,
      lastYearStart,
      lastYearEnd
    );

    renderComparisonCard(
      "compareWeek",
      "Tuần Này vs Tuần Trước",
      thisWeekCount,
      lastWeekCount
    );
    renderComparisonCard(
      "compareMonth",
      "Tháng Này vs Tháng Trước",
      thisMonthCount,
      lastMonthCount
    );
    renderComparisonCard(
      "compareYear",
      "Năm Này vs Năm Trước",
      thisYearCount,
      lastYearCount
    );
  }

  function renderComparisonCard(elementId, title, current, previous) {
    const container = document.getElementById(elementId);
    if (!container) return;

    let percentageChange = 0;
    if (previous > 0) {
      percentageChange = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      percentageChange = 100; // From 0 to something is a 100% increase
    }

    const isIncrease = percentageChange > 0;
    const isDecrease = percentageChange < 0;
    const colorClass = isIncrease
      ? "text-red-500"
      : isDecrease
      ? "text-green-500"
      : "text-slate-500";
    const iconClass = isIncrease
      ? "fa-arrow-up"
      : isDecrease
      ? "fa-arrow-down"
      : "fa-minus";

    container.innerHTML = `
          <p class="text-sm text-slate-500 font-medium">${title}</p>
          <div class="flex items-baseline justify-between mt-2">
              <p class="text-3xl font-bold">${current}</p>
              <div class="flex items-center text-sm font-semibold ${colorClass}">
                  <i class="fas ${iconClass} mr-1"></i>
                  <span>${percentageChange.toFixed(0)}%</span>
              </div>
          </div>
          <p class="text-xs text-slate-400 mt-1">Kỳ trước: ${previous}</p>
      `;
  }

  function renderIssueTypePieChart(data) {
    const canvas = document.getElementById("issueTypePieChart");
    if (!canvas) return;
    if (issueTypeChart) issueTypeChart.destroy();

    const ctx = canvas.getContext("2d");
    issueTypeChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#8B5CF6",
              "#EF4444",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const label = issueTypeChart.data.labels[chartElement.index];
            showDrillDownModal(
              "issueType",
              label,
              `Chi tiết Sự cố: Loại "${label}"`
            );
          }
        },
      },
    });
  }

  function renderStatusSummary(data, total) {
    const container = document.getElementById("statusSummary");
    if (!container) return;
    const statuses = {
      "Chờ xử lý": "bg-blue-500",
      "Đang xử lý": "bg-yellow-500",
      "Đã giải quyết": "bg-green-500",
      "Đã hủy": "bg-red-500",
    };
    container.innerHTML = Object.entries(statuses)
      .map(([status, color]) => {
        const count = data[status] || 0;
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
        return `<div><div class="flex justify-between mb-1"><span class="text-sm font-medium">${status} (${count})</span><span class="text-sm">${percentage}%</span></div><div class="w-full bg-slate-200 rounded-full h-2"><div class="${color} h-2 rounded-full" style="width: ${percentage}%"></div></div></div>`;
      })
      .join("");
  }

  function renderIncidentTrendChart(reports) {
    const canvas = document.getElementById("incidentTrendChart");
    if (!canvas) return;
    if (incidentTrendChart) incidentTrendChart.destroy();

    if (reports.length === 0) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center";
      ctx.fillText(
        "Không có dữ liệu để hiển thị.",
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }

    // Group data by day
    const countsByDate = reports.reduce((acc, report) => {
      const date = new Date(report.reportDate).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(countsByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const labels = sortedDates.map((date) =>
      new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    );
    const data = sortedDates.map((date) => countsByDate[date]);

    incidentTrendChart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số lượng sự cố",
            data: data,
            borderColor: "var(--primary-color)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  function renderIncidentHeatmap(reports) {
    const container = document.getElementById("incidentHeatmapContainer");
    if (!container) return;

    const heatmapData = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));
    let maxCount = 0;

    reports.forEach((report) => {
      const date = new Date(report.reportDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
      const hour = date.getHours();
      heatmapData[dayOfWeek][hour]++;
      if (heatmapData[dayOfWeek][hour] > maxCount) {
        maxCount = heatmapData[dayOfWeek][hour];
      }
    });

    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    let html = '<div class="heatmap">';
    // Header Row for hours
    html += "<div></div>"; // Empty corner
    for (let i = 0; i < 24; i++) {
      html += `<div class="heatmap-header">${i}</div>`;
    }

    // Data Rows (Day labels + cells)
    days.forEach((dayLabel, dayIndex) => {
      html += `<div class="heatmap-label">${dayLabel}</div>`;
      for (let hour = 0; hour < 24; hour++) {
        const count = heatmapData[dayIndex][hour];
        // Non-linear scale to make smaller values more visible
        const opacity = maxCount > 0 ? Math.sqrt(count / maxCount) : 0;
        const style = `background-color: rgba(79, 70, 229, ${opacity.toFixed(
          2
        )});`;
        const tooltipText = `${count} sự cố`;
        html += `<div class="heatmap-cell" style="${style}"><span class="tooltip">${tooltipText}</span></div>`;
      }
    });

    html += "</div>";
    container.innerHTML = html;
  }

  // TÌM VÀ THAY THẾ TOÀN BỘ HÀM NÀY
  function renderScopeAnalysis(reports) {
    const tableContainer = document.getElementById(
      "problematicRoomsTableContainer"
    );
    const scopeCanvas = document.getElementById("scopeAnalysisChart");

    if (!tableContainer || !scopeCanvas) return;

    // --- BƯỚC 1: Xử lý và cấu trúc lại dữ liệu (Tương tự trước) ---
    const roomCountsByBranch = {};
    const branchesWithRooms = new Set();

    reports.forEach((report) => {
      if (
        report.issueScope === "specific_rooms" &&
        report.specificRooms &&
        report.issueBranch
      ) {
        branchesWithRooms.add(report.issueBranch);
        if (!roomCountsByBranch[report.issueBranch]) {
          roomCountsByBranch[report.issueBranch] = {};
        }

        const rooms = report.specificRooms
          .split(",")
          .map((room) => room.trim().toLowerCase());
        rooms.forEach((room) => {
          if (room) {
            roomCountsByBranch[report.issueBranch][room] =
              (roomCountsByBranch[report.issueBranch][room] || 0) + 1;
          }
        });
      }
    });

    // --- BƯỚC 2: Tạo HTML cho bộ lọc ---
    let filterOptions = `<option value="all">Tất cả Chi nhánh</option>`;
    // Chỉ thêm các chi nhánh có báo cáo phòng cụ thể vào dropdown để tránh thừa
    const branchesInReports = [
      ...new Set(reports.map((r) => r.issueBranch)),
    ].sort();
    branchesInReports.forEach((branch) => {
      filterOptions += `<option value="${branch}">${branch}</option>`;
    });

    tableContainer.innerHTML = `
          <div class="mb-4">
              <label for="branchFilterForRooms" class="text-sm font-medium text-slate-600">Lọc theo chi nhánh:</label>
              <select id="branchFilterForRooms" class="select-field text-sm mt-1">
                  ${filterOptions}
              </select>
          </div>
          <div id="problematicRoomsTable"></div>
      `;

    // --- BƯỚC 3: Tạo hàm cập nhật ĐỒNG BỘ cho cả biểu đồ và bảng ---
    const updateScopeAnalytics = (selectedBranch) => {
      // Lọc báo cáo dựa trên chi nhánh được chọn
      const branchSpecificReports =
        selectedBranch === "all"
          ? reports
          : reports.filter((r) => r.issueBranch === selectedBranch);

      // --- Cập nhật Biểu đồ tròn ---
      const scopeCounts = branchSpecificReports.reduce((acc, report) => {
        const scope =
          report.issueScope === "all_rooms"
            ? "Tất cả phòng"
            : "Phòng cụ thể";
        acc[scope] = (acc[scope] || 0) + 1;
        return acc;
      }, {});

      if (scopeAnalysisChart) scopeAnalysisChart.destroy();
      scopeAnalysisChart = new Chart(scopeCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: Object.keys(scopeCounts),
          datasets: [
            {
              data: Object.values(scopeCounts),
              backgroundColor: ["#34D399", "#FBBF24"],
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
          cutout: "70%",
        },
      });

      // --- Cập nhật Bảng Top 10 Phòng ---
      const tableDiv = document.getElementById("problematicRoomsTable");
      let roomCounts = {};

      // Chỉ tính toán lại roomCounts cho bảng nếu chọn "Tất cả" hoặc chi nhánh có dữ liệu
      if (selectedBranch === "all") {
        branchSpecificReports.forEach((report) => {
          if (report.issueScope === "specific_rooms" && report.specificRooms) {
            const rooms = report.specificRooms
              .split(",")
              .map((room) => room.trim().toLowerCase());
            rooms.forEach((room) => {
              if (room) roomCounts[room] = (roomCounts[room] || 0) + 1;
            });
          }
        });
      } else if (roomCountsByBranch[selectedBranch]) {
        roomCounts = roomCountsByBranch[selectedBranch];
      }

      const sortedRooms = Object.entries(roomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      if (sortedRooms.length === 0) {
        tableDiv.innerHTML = `<p class="text-center text-slate-500 p-4">Không có dữ liệu về phòng cụ thể cho lựa chọn này.</p>`;
      } else {
        let tableHTML = `
                  <table class="min-w-full">
                      <thead class="bg-slate-50 sticky top-0">
                          <tr>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Tên Phòng</th>
                              <th class="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Số Lần Báo Lỗi</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200">
              `;
        sortedRooms.forEach(([room, count]) => {
          tableHTML += `
                      <tr class="hover:bg-slate-50">
                          <td class="px-4 py-2 font-medium capitalize">${room}</td>
                          <td class="px-4 py-2 text-right font-bold">${count}</td>
                      </tr>
                  `;
        });
        tableHTML += `</tbody></table>`;
        tableDiv.innerHTML = tableHTML;
      }
    };

    // --- BƯỚC 4: Gán sự kiện và gọi hàm cập nhật lần đầu ---
    const branchFilterDropdown = document.getElementById("branchFilterForRooms");
    if (branchFilterDropdown) {
      branchFilterDropdown.addEventListener("change", (e) => {
        updateScopeAnalytics(e.target.value);
      });
    }

    updateScopeAnalytics("all"); // Hiển thị dữ liệu lần đầu
  }

  // --- NEW/UPDATED PERFORMANCE ANALYSIS FUNCTIONS ---
  function renderEmployeePerformanceAnalysis(reports) {
    const tableBody = document.getElementById("employeePerformanceTableBody");
    const avgOnTimeRateEl = document.getElementById("avgOnTimeRate");
    const avgProcessingTimeEl = document.getElementById("avgProcessingTime");
    const topPerformerEl = document.getElementById("topPerformer");
    if (!tableBody) return;

    const employeeStats = {};

    // Hàm helper để tạo một đối tượng thống kê trống
    const createEmptyStat = (name) => ({
      name: name,
      assigned: 0,
      resolved: 0,
      onTime: 0,
      totalProcessingHours: 0,
    });

    // ▼▼▼ LOGIC TÍNH TOÁN MỚI HOÀN TOÀN ▼▼▼

    // Bước 1: Khởi tạo tất cả nhân viên có liên quan (được giao hoặc đã giải quyết)
    reports.forEach((report) => {
      if (report.assigneeId && !employeeStats[report.assigneeId]) {
        employeeStats[report.assigneeId] = createEmptyStat(report.assigneeName);
      }
      if (report.resolverId && !employeeStats[report.resolverId]) {
        employeeStats[report.resolverId] = createEmptyStat(report.resolverName);
      }
    });

    // Bước 2: Tính toán các chỉ số
    reports.forEach((report) => {
      // Tăng số lượt được giao cho người được giao
      if (report.assigneeId && employeeStats[report.assigneeId]) {
        employeeStats[report.assigneeId].assigned++;
      }

      // Nếu công việc đã giải quyết, tính điểm cho người giải quyết
      if (
        report.status === "Đã giải quyết" &&
        report.resolverId &&
        employeeStats[report.resolverId]
      ) {
        const stats = employeeStats[report.resolverId];
        stats.resolved++;

        // Tính thời gian xử lý:
        // - Nếu được giao: tính từ lúc giao (assignedDate)
        // - Nếu tự xử lý: tính từ lúc báo cáo (reportDate)
        const startDate = report.assignedDate || report.reportDate;
        if (report.resolvedDate && startDate) {
          const start = new Date(startDate);
          const resolved = new Date(report.resolvedDate);
          const processingHours = (resolved - start) / (1000 * 60 * 60);
          if (processingHours >= 0) {
            // Đảm bảo không phải số âm
            stats.totalProcessingHours += processingHours;
          }
        }

        // Tính đúng hạn (dựa vào dueDate)
        if (report.dueDate && report.resolvedDate) {
          const due = new Date(report.dueDate);
          const resolved = new Date(report.resolvedDate);
          if (resolved <= due) {
            stats.onTime++;
          }
        }
      }
    });

    // ▲▲▲ KẾT THÚC LOGIC MỚI ▲▲▲

    const statsArray = Object.values(employeeStats);

    // Phần hiển thị bảng và các chỉ số tổng quan giữ nguyên
    tableBody.innerHTML =
      statsArray
        .map((stats) => {
          const onTimeRate =
            stats.resolved > 0 ? (stats.onTime / stats.resolved) * 100 : 0;
          const avgTime =
            stats.resolved > 0 ? stats.totalProcessingHours / stats.resolved : 0;
          return `
              <tr>
                  <td data-label="Nhân viên" class="px-4 py-3">${stats.name}</td>
                  <td data-label="Đã xử lý / Được giao" class="px-4 py-3">${
                    stats.resolved
                  } / ${stats.assigned}</td>
                  <td data-label="Thời gian xử lý TB (giờ)" class="px-4 py-3">${avgTime.toFixed(
                    1
                  )}</td>
                  <td data-label="Đúng hạn" class="px-4 py-3">${onTimeRate.toFixed(
                    0
                  )}%</td>
              </tr>
          `;
        })
        .join("") ||
      `<tr><td colspan="4" class="p-4 text-center">Không có dữ liệu.</td></tr>`;

    let totalOnTime = 0,
      totalResolvedForRate = 0,
      totalProcessingHours = 0,
      topResolvedCount = -1;
    let topPerformerName = "N/A";

    statsArray.forEach((s) => {
      if (s.resolved > 0) {
        totalOnTime += s.onTime;
        totalResolvedForRate += s.resolved;
        totalProcessingHours += s.totalProcessingHours;
      }
      if (s.resolved > topResolvedCount) {
        topResolvedCount = s.resolved;
        topPerformerName = s.name;
      }
    });

    const overallOnTimeRate =
      totalResolvedForRate > 0 ? (totalOnTime / totalResolvedForRate) * 100 : 0;
    const overallAvgProcessingTime =
      totalResolvedForRate > 0 ? totalProcessingHours / totalResolvedForRate : 0;

    avgOnTimeRateEl.textContent = `${overallOnTimeRate.toFixed(0)}%`;
    avgProcessingTimeEl.textContent = `${overallAvgProcessingTime.toFixed(
      1
    )} giờ`;
    topPerformerEl.textContent = topPerformerName;

    const sortedByResolved = statsArray
      .sort((a, b) => b.resolved - a.resolved)
      .slice(0, 5);
    const chartLabels = sortedByResolved.map((s) => s.name);
    const chartData = sortedByResolved.map((s) => s.resolved);
    // Create mapping from employee name to resolverId for drill-down
    const employeeNameToIdMap = {};
    reports.forEach((report) => {
      if (report.resolverId && report.resolverName) {
        employeeNameToIdMap[report.resolverName] = report.resolverId;
      }
    });

    renderTopEmployeesChart(chartLabels, chartData, employeeNameToIdMap);
  }

  function renderTopEmployeesChart(labels, data, nameToIdMap = {}) {
    const canvas = document.getElementById("topEmployeesChart");
    if (!canvas) return;
    if (topEmployeesChart) topEmployeesChart.destroy();

    topEmployeesChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số sự cố đã giải quyết",
            data: data,
            backgroundColor: "#4f46e5",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const employeeName = labels[chartElement.index];
            // Try to find by resolverId first, then fallback to resolverName
            const resolverId = nameToIdMap[employeeName];
            if (resolverId) {
              showDrillDownModal(
                "resolverId",
                resolverId,
                `Chi tiết Sự cố đã giải quyết bởi: ${employeeName}`,
                "resolved"
              );
            } else {
              // Fallback: filter by resolverName
              showDrillDownModal(
                "resolverName",
                employeeName,
                `Chi tiết Sự cố đã giải quyết bởi: ${employeeName}`,
                "resolved"
              );
            }
          }
        },
      },
    });
  }

  function renderManagerPerformanceAnalysis(reports) {
    const tableBody = document.getElementById("managerPerformanceTableBody");
    const avgAssignmentTimeEl = document.getElementById("avgAssignmentTime");
    const overallSuccessRateEl = document.getElementById("overallSuccessRate");
    const totalEscalationsEl = document.getElementById("totalEscalations");
    if (!tableBody) return;

    const managerStats = {};
    let totalEscalations = 0;

    reports.forEach((report) => {
      if (report.escalated) totalEscalations++;
      if (!report.assignerId) return;

      if (!managerStats[report.assignerId]) {
        managerStats[report.assignerId] = {
          name: report.assignerName,
          assigned: 0,
          resolved: 0,
          escalated: 0,
          totalAssignmentHours: 0,
        };
      }

      const stats = managerStats[report.assignerId];
      stats.assigned++;
      if (report.escalated) stats.escalated++;
      if (report.status === "Đã giải quyết") stats.resolved++;

      if (report.assignedDate && report.reportDate) {
        const created = new Date(report.reportDate);
        const assigned = new Date(report.assignedDate);
        stats.totalAssignmentHours += (assigned - created) / (1000 * 60 * 60);
      }
    });

    const statsArray = Object.values(managerStats);
    tableBody.innerHTML =
      statsArray
        .map((stats) => {
          const successRate =
            stats.assigned > 0 ? (stats.resolved / stats.assigned) * 100 : 0;
          const avgTime =
            stats.assigned > 0 ? stats.totalAssignmentHours / stats.assigned : 0;
          return `
              <tr>
                  <td data-label="Quản lý" class="px-4 py-3">${stats.name}</td>
                  <td data-label="Tổng sự cố đã giao" class="px-4 py-3">${
                    stats.assigned
                  }</td>
                  <td data-label="Tỷ lệ thành công" class="px-4 py-3">${successRate.toFixed(
                    0
                  )}%</td>
                  <td data-label="Thời gian giao việc TB (giờ)" class="px-4 py-3">${avgTime.toFixed(
                    1
                  )}</td>
                  <td data-label="Số lần Escalated" class="px-4 py-3">${
                    stats.escalated
                  }</td>
              </tr>
          `;
        })
        .join("") ||
      `<tr><td colspan="5" class="p-4 text-center">Không có dữ liệu.</td></tr>`;

    let totalAssigned = 0,
      totalResolved = 0,
      totalAssignmentHours = 0;
    statsArray.forEach((s) => {
      totalAssigned += s.assigned;
      totalResolved += s.resolved;
      totalAssignmentHours += s.totalAssignmentHours;
    });

    const overallSuccessRate =
      totalAssigned > 0 ? (totalResolved / totalAssigned) * 100 : 0;
    const overallAvgAssignmentTime =
      totalAssigned > 0 ? totalAssignmentHours / totalAssigned : 0;

    avgAssignmentTimeEl.textContent = `${overallAvgAssignmentTime.toFixed(
      1
    )} giờ`;
    overallSuccessRateEl.textContent = `${overallSuccessRate.toFixed(0)}%`;
    totalEscalationsEl.textContent = totalEscalations;
  }

  function renderBranchPerformanceAnalysis(reports) {
    const statusCanvas = document.getElementById("branchStatusChart");
    const timeCanvas = document.getElementById("branchTimeChart");
    if (!statusCanvas || !timeCanvas) return;

    const branchStats = {};
    reports.forEach((report) => {
      if (!report.issueBranch) return;

      if (!branchStats[report.issueBranch]) {
        branchStats[report.issueBranch] = {
          name: report.issueBranch,
          total: 0,
          resolved: 0,
          totalProcessingHours: 0,
          resolvedForTimeCalc: 0,
        };
      }

      const stats = branchStats[report.issueBranch];
      stats.total++;

      if (report.status === "Đã giải quyết") {
        stats.resolved++;
        if (report.resolvedDate && report.reportDate) {
          const created = new Date(report.reportDate);
          const resolved = new Date(report.resolvedDate);
          const diffHours = (resolved - created) / (1000 * 60 * 60);
          if (diffHours >= 0) {
            stats.totalProcessingHours += diffHours;
            stats.resolvedForTimeCalc++;
          }
        }
      }
    });

    const statsArray = Object.values(branchStats);

    const sortedByTotal = [...statsArray]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    const statusLabels = sortedByTotal.map((s) => s.name.replace("ICOOL ", ""));
    const fullBranchNames = sortedByTotal.map((s) => s.name); // Keep full names for filtering
    const resolvedData = sortedByTotal.map((s) => s.resolved);
    const unresolvedData = sortedByTotal.map((s) => s.total - s.resolved);
    renderBranchStatusChart(statusLabels, resolvedData, unresolvedData, fullBranchNames);

    const sortedByTime = [...statsArray]
      .filter((s) => s.resolvedForTimeCalc > 0)
      .sort(
        (a, b) =>
          b.totalProcessingHours / b.resolvedForTimeCalc -
          a.totalProcessingHours / a.resolvedForTimeCalc
      )
      .slice(0, 10);
    const timeLabels = sortedByTime.map((s) => s.name.replace("ICOOL ", ""));
    const fullTimeBranchNames = sortedByTime.map((s) => s.name); // Keep full names for filtering
    const timeData = sortedByTime.map((s) =>
      parseFloat((s.totalProcessingHours / s.resolvedForTimeCalc).toFixed(2))
    );
    renderBranchTimeChart(timeLabels, timeData, fullTimeBranchNames);
  }

  function renderBranchStatusChart(labels, resolvedData, unresolvedData, fullBranchNames = []) {
    const canvas = document.getElementById("branchStatusChart");
    if (!canvas) return;
    if (branchStatusChart) branchStatusChart.destroy();

    branchStatusChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Đã giải quyết",
            data: resolvedData,
            backgroundColor: "#22c55e",
          },
          {
            label: "Chưa giải quyết",
            data: unresolvedData,
            backgroundColor: "#f97316",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
        },
        plugins: { legend: { position: "bottom" } },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const barIndex = chartElement.index;
            const datasetIndex = chartElement.datasetIndex;
            const branchLabel = labels[barIndex];
            const fullBranchName = fullBranchNames[barIndex] || branchLabel;
            
            // datasetIndex 0 = "Đã giải quyết", 1 = "Chưa giải quyết"
            if (datasetIndex === 0) {
              // Resolved issues
              showDrillDownModal(
                "issueBranch",
                fullBranchName,
                `Chi tiết Sự cố đã giải quyết tại: ${fullBranchName}`,
                "resolved"
              );
            } else if (datasetIndex === 1) {
              // Unresolved issues
              showDrillDownModal(
                "issueBranch",
                fullBranchName,
                `Chi tiết Sự cố chưa giải quyết tại: ${fullBranchName}`,
                "unresolved"
              );
            }
          }
        },
      },
    });
  }

  function renderBranchTimeChart(labels, data, fullBranchNames = []) {
    const canvas = document.getElementById("branchTimeChart");
    if (!canvas) return;
    if (branchTimeChart) branchTimeChart.destroy();

    branchTimeChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Thời gian xử lý TB (giờ)",
            data: data,
            backgroundColor: "#6366f1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const barIndex = chartElement.index;
            const branchLabel = labels[barIndex];
            const fullBranchName = fullBranchNames[barIndex] || branchLabel;
            
            showDrillDownModal(
              "issueBranch",
              fullBranchName,
              `Chi tiết Sự cố tại: ${fullBranchName}`,
              "resolved" // Show only resolved issues since this chart is about processing time
            );
          }
        },
      },
    });
  }

  function runPredictiveAnalysis(reports) {
    const pdmContainer = document.getElementById("pdmTableBody");
    if (!pdmContainer) return;

    if (reports.length === 0) {
      pdmContainer.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500">Chưa có đủ dữ liệu.</td></tr>`;
      document.getElementById("pdmSummaryStats").innerHTML = "";
      if (pdmRiskChart) pdmRiskChart.destroy();
      return;
    }

    const groupedData = reports.reduce((acc, report) => {
      const key = `${report.issueBranch}|${report.issueType}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(report);
      return acc;
    }, {});

    const priorityMap = { "Nghiêm trọng": 3, "Trung bình": 2, Thấp: 1 };

    let analysisResults = Object.entries(groupedData).map(([key, reports]) => {
      const [branch, type] = key.split("|");
      const sortedReports = reports.sort(
        (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
      );
      const lastFailureDate = new Date(sortedReports[0].reportDate);
      const daysSinceLastFailure =
        (new Date() - lastFailureDate) / (1000 * 60 * 60 * 24);

      const failureCount = reports.length;
      const totalPriorityScore = reports.reduce(
        (sum, r) => sum + (priorityMap[r.priority] || 1),
        0
      );
      const avgPriorityScore = totalPriorityScore / failureCount;
      const recencyScore = Math.exp(-0.1 * daysSinceLastFailure);
      const frequencyScore = Math.log1p(failureCount);
      const severityScore = avgPriorityScore / 3;
      const riskScore =
        (0.5 * recencyScore + 0.3 * frequencyScore + 0.2 * severityScore) * 100;

      return { branch, type, riskScore: Math.min(riskScore, 100) };
    });

    analysisResults.sort((a, b) => b.riskScore - a.riskScore);

    renderPdmSummaryStats(analysisResults);
    renderPdmChart(analysisResults);
    renderPdmTable(analysisResults);
  }

  function renderPdmSummaryStats(analysisResults) {
    const container = document.getElementById("pdmSummaryStats");
    if (!container) return;
    const highRiskCount = analysisResults.filter((r) => r.riskScore > 75).length;
    const mediumRiskCount = analysisResults.filter(
      (r) => r.riskScore > 50 && r.riskScore <= 75
    ).length;
    const lowRiskCount = analysisResults.filter((r) => r.riskScore <= 50).length;

    container.innerHTML = `
          <div class="px-2"><p class="text-2xl font-bold text-red-500">${highRiskCount}</p><p class="text-xs text-slate-500">Rủi ro Cao</p></div>
          <div class="px-2"><p class="text-2xl font-bold text-yellow-500">${mediumRiskCount}</p><p class="text-xs text-slate-500">Rủi ro TB</p></div>
          <div class="px-2"><p class="text-2xl font-bold text-green-500">${lowRiskCount}</p><p class="text-xs text-slate-500">Rủi ro Thấp</p></div>
      `;
  }

  function renderPdmChart(analysisResults) {
    const canvas = document.getElementById("pdmRiskChart");
    if (!canvas) return;
    if (pdmRiskChart) pdmRiskChart.destroy();

    const top5Data = analysisResults.slice(0, 5);
    const labels = top5Data.map(
      (item) => `${item.branch.replace("ICOOL ", "")} - ${item.type}`
    );
    const data = top5Data.map((item) => item.riskScore);
    const backgroundColors = data.map((score) =>
      score > 75
        ? "rgba(239, 68, 68, 0.7)"
        : score > 50
        ? "rgba(245, 158, 11, 0.7)"
        : "rgba(34, 197, 94, 0.7)"
    );

    pdmRiskChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Điểm Rủi Ro",
            data: data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((c) => c.replace("0.7", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  function renderPdmTable(analysisResults) {
    const tableBody = document.getElementById("pdmTableBody");
    if (!tableBody) return;
    const getRiskColor = (score) =>
      score > 75
        ? "text-red-600"
        : score > 50
        ? "text-yellow-600"
        : "text-green-600";
    tableBody.innerHTML = analysisResults
      .map(
        (item) => `
          <tr class="hover:bg-slate-50">
              <td data-label="Hạng mục" class="px-4 py-3 text-sm"><p class="font-semibold text-slate-800">${
                item.type
              }</p><p class="text-xs text-slate-500">${item.branch}</p></td>
              <td data-label="Rủi Ro" class="px-4 py-3 text-sm font-bold ${getRiskColor(
                item.riskScore
              )}">${item.riskScore.toFixed(0)} / 100</td>
          </tr>
      `
      )
      .join("");
  }

  // --- Modal Handlers: Account & Issue Management ---
  async function openIssueDetailModal(issueId) {
    const modal = document.getElementById("issueDetailModal");
    if (!modal) return;

    modal.style.display = "flex";
    buildRoomToLocationMap();

    // Xóa dữ liệu cũ
    modal.querySelector("#detailIssueId").value = "";
    modal.querySelector("#detailIssueLocation").textContent =
      "Đang tải vị trí...";
    modal.querySelector("#detailIssueLocation").title = "";
    modal.querySelector("#detailIssueDescription").textContent = "Đang tải...";
    modal.querySelector("#detailIssueImageContainer").innerHTML = "";
    modal.querySelector("#detailRepairedImageContainer").innerHTML = "";
    modal.querySelector("#detailIssueComments").innerHTML = "";
    // Clear message element
    const messageEl = modal.querySelector("#detailIssueMessage");
    if (messageEl) {
      messageEl.classList.add("hidden");
      messageEl.textContent = "";
    }

    const docRef = doc(
      db,
      `/artifacts/${canvasAppId}/public/data/issueReports`,
      issueId
    );
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      modal.querySelector("#detailIssueDescription").textContent =
        "Không tìm thấy sự cố.";
      return;
    }
    const report = docSnap.data();

    modal.querySelector("#detailIssueId").value = issueId;

    // ▼▼▼ THAY ĐỔI LOGIC HIỂN THỊ VỊ TRÍ ▼▼▼
    const locationEl = modal.querySelector("#detailIssueLocation");
    // Thêm "Vị trí: " vào đầu chuỗi
    let locationString = `Vị trí: ${
      report.issueBranch.replace("ICOOL ", "") || "Không xác định"
    }`;

    if (report.issueScope === "all_rooms") {
      locationString += " / Tất cả phòng";
    } else if (report.specificRooms) {
      const firstRoom = report.specificRooms.split(", ")[0];
      const locationInfo = roomToLocationMap[firstRoom];
      const floorName = locationInfo ? locationInfo.floor : "Không xác định";
      locationString += ` / ${floorName} / ${report.specificRooms}`;
    }
    locationEl.textContent = locationString;
    locationEl.title = locationString; // Thêm tooltip để xem đầy đủ nếu tên quá dài
    // ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲

    // Phần còn lại của hàm giữ nguyên...
    modal.querySelector("#detailReporterName").textContent = report.reporterName;
    modal.querySelector("#detailReportDate").textContent = new Date(
      report.reportDate
    ).toLocaleString("vi-VN");
    modal.querySelector("#detailIssuePriority").textContent = report.priority;
    modal.querySelector("#detailIssueDescription").textContent =
      report.issueDescription;

    const initialImageContainer = modal.querySelector(
      "#detailIssueImageContainer"
    );
    if (report.issueImageUrl) {
      initialImageContainer.innerHTML = `<a href="${report.issueImageUrl}" target="_blank"><img src="${report.issueImageUrl}" class="w-full h-48 object-cover rounded-lg shadow-md"></a>`;
    } else {
      initialImageContainer.innerHTML =
        '<p class="text-sm text-slate-500 italic">Chưa có ảnh ban đầu.</p>';
    }

    const repairedImageContainer = modal.querySelector(
      "#detailRepairedImageContainer"
    );
    if (report.repairedImageUrl) {
      repairedImageContainer.innerHTML = `<a href="${report.repairedImageUrl}" target="_blank"><img src="${report.repairedImageUrl}" class="w-full h-48 object-cover rounded-lg shadow-md"></a>`;
    } else {
      repairedImageContainer.innerHTML =
        '<p class="text-sm text-slate-500 italic">Chưa có ảnh sửa chữa.</p>';
    }

    // --- LOGIC QUẢN LÝ & KHÓA VẤN ĐỀ ---

    // Cho phép quản lý nếu:
    // 1. Là Admin hoặc Manager (luôn có quyền)
    // 2. HOẶC là Nhân viên VÀ (chưa giao cho ai HOẶC đã giao cho chính họ)
    const isNotAssigned = !report.assigneeId || report.assigneeId === null || report.assigneeId === "";
    const isAssignedToMe = report.assigneeId === currentUser.uid;
    const canManage =
      currentUserProfile.role === "Admin" ||
      currentUserProfile.role === "Manager" ||
      (currentUserProfile.role === "Nhân viên" && (isNotAssigned || isAssignedToMe)) ||
      (currentUserProfile.role !== "Nhân viên" && isAssignedToMe); // Các role khác (nếu có) chỉ quản lý được khi được giao
    const isResolved = report.status === "Đã giải quyết";

    // Lấy các element
    const statusSelect = modal.querySelector("#detailIssueStatus");
    const assigneeSelect = modal.querySelector("#detailIssueAssignee");
    const updateBtn = modal.querySelector("#updateIssueBtn");
    const repairedImageUploadContainer = modal.querySelector(
      "#repairedImageUploadContainer"
    );
    const repairedImageInput = modal.querySelector("#repairedImageInput");
    const newCommentInput = modal.querySelector("#newCommentInput");
    const addCommentBtn = modal.querySelector("#addCommentBtn");
    const resolutionInfoContainer = modal.querySelector(
      "#resolutionInfoContainer"
    );
    const actionsContainer = updateBtn.closest(".pt-4.border-t"); // Tìm container của "Hành Động"

    // 1. Hiển thị thông tin giải quyết (nếu có)
    if (isResolved) {
      modal.querySelector("#detailResolverName").textContent =
        report.resolverName || "Không rõ";
      modal.querySelector("#detailResolvedDate").textContent = report.resolvedDate
        ? new Date(report.resolvedDate).toLocaleString("vi-VN")
        : "Không rõ";
      resolutionInfoContainer.classList.remove("hidden");
    } else {
      resolutionInfoContainer.classList.add("hidden");
    }

    // 2. Điền dữ liệu cho Status (bao gồm "Đã hủy" nếu status hiện tại là "Đã hủy")
    const statusOptions = report.status === "Đã hủy" 
      ? ISSUE_STATUSES 
      : ISSUE_STATUSES.filter((s) => s !== "Đã hủy");
    
    statusSelect.innerHTML = statusOptions
      .map(
        (s) =>
          `<option value="${s}" ${
            report.status === s ? "selected" : ""
          }>${s}</option>`
      )
      .join("");

    // 3. Điền dữ liệu cho Assignee
    // Ẩn field "Giao cho" nếu user có role "Chi nhánh"
    const assigneeFieldContainer = assigneeSelect.closest("div");
    if (currentUserProfile.role === "Chi nhánh") {
      if (assigneeFieldContainer) {
        assigneeFieldContainer.classList.add("hidden");
      }
    } else {
      if (assigneeFieldContainer) {
        assigneeFieldContainer.classList.remove("hidden");
      }
      
      if (canManage) {
        // Use cached users instead of calling getDocs
        // Ensure cache is loaded
        if (!usersCacheLoaded) {
          await loadUsersIntoCache();
        }
        
        // Filter from cache: Loại bỏ "Chi nhánh", disabled users
        // Và nếu là Manager, chỉ hiển thị Nhân viên trong các chi nhánh được quản lý
        const users = allUsersCache.filter((u) => {
          // Loại bỏ tài khoản "Chi nhánh" và tài khoản bị disabled
          if (u.role === "Chi nhánh" || u.status === "disabled" || u.disabled) {
            return false;
          }
          
          // Nếu là Manager, chỉ hiển thị Nhân viên trong các chi nhánh được quản lý
          if (currentUserProfile.role === "Manager") {
            const managedBranches = currentUserProfile.managedBranches || [];
            if (u.role === "Nhân viên") {
              // Nhân viên phải có branch và branch phải nằm trong managedBranches
              return u.branch && managedBranches.includes(u.branch);
            }
            // Manager và Admin vẫn hiển thị (để Manager có thể gán cho Manager khác nếu cần)
            return true;
          }
          
          // Admin thấy tất cả (trừ Chi nhánh và disabled)
          return true;
        });
        
        assigneeSelect.innerHTML =
          `<option value="">Chưa giao</option>` +
          users
            .map(
              (u) =>
                `<option value="${u.uid}" ${
                  report.assigneeId === u.uid ? "selected" : ""
                }>${u.displayName}</option>`
            )
            .join("");
      } else {
        // Nếu là nhân viên, chỉ hiển thị người được giao (nếu có)
        // Nếu assignee là "Chi nhánh", hiển thị "Chưa giao"
        const assigneeName = report.assigneeName || "Chưa giao";
        const isBranchName = ALL_BRANCHES.includes(assigneeName);
        if (isBranchName || report.assigneeId === null) {
          assigneeSelect.innerHTML = `<option value="">Chưa giao</option>`;
        } else {
          assigneeSelect.innerHTML = `<option value="">${assigneeName}</option>`;
        }
      }
    }

    // 4. KHÓA CÁC TRƯỜNG NẾU (KHÔNG THỂ QUẢN LÝ) HOẶC (ĐÃ GIẢI QUYẾT)
    const shouldLock = !canManage || isResolved;
    
    // Phân biệt quyền: Admin/Manager có thể quản lý tất cả, assignee chỉ có thể cập nhật trạng thái
    const canManageAll = currentUserProfile.role === "Admin" || currentUserProfile.role === "Manager";
    const isAssignee = report.assigneeId === currentUser.uid && !canManageAll;

    statusSelect.disabled = shouldLock;
    // Assignee không thể thay đổi người được giao, chỉ Admin/Manager mới có thể
    assigneeSelect.disabled = shouldLock || isAssignee;
    repairedImageInput.disabled = shouldLock;
    newCommentInput.disabled = isResolved; // Cho phép comment nếu chưa giải quyết, kể cả là nhân viên
    addCommentBtn.disabled = isResolved; // Tương tự

    // Ẩn toàn bộ phần "Hành Động" nếu đã giải quyết
    if (isResolved) {
      actionsContainer.classList.add("hidden");
    } else {
      actionsContainer.classList.remove("hidden");
    }

    // Ẩn nút "Cập nhật" (dùng riêng cho trường hợp nhân viên xem)
    updateBtn.classList.toggle("hidden", !canManage);

    // Ẩn/hiện ô upload ảnh sửa chữa
    const toggleRepairedImageInput = () => {
      // Chỉ hiện khi CHUẨN BỊ chuyển sang "Đã giải quyết" VÀ chưa bị khóa
      const showUpload = statusSelect.value === "Đã giải quyết" && !isResolved;
      repairedImageUploadContainer.classList.toggle("hidden", !showUpload);
    };

    toggleRepairedImageInput();
    // Xóa listener cũ (nếu có) và thêm listener mới để tránh lỗi
    statusSelect.removeEventListener("change", toggleRepairedImageInput);
    statusSelect.addEventListener("change", toggleRepairedImageInput);

    // 5. Mở listener cho comment
    listenToIssueComments(issueId);
    
    // 6. Setup mention autocomplete
    setupMentionAutocomplete(issueId);
    // --- KẾT THÚC LOGIC QUẢN LÝ ---
  }

  /**
   * Mở modal xác nhận hủy sự cố
   */
  function openConfirmCancelModal(issueId, issueType, issueBranch) {
    const modal = document.getElementById("confirmCancelModal");
    const messageEl = modal.querySelector("#confirmCancelMessage");
    
    messageEl.textContent = `Bạn có chắc chắn muốn hủy sự cố "${issueType}" tại "${issueBranch}" không?`;
    
    // Lưu issueId vào modal để dùng khi confirm
    modal.dataset.issueId = issueId;
    modal.style.display = "flex";
  }

  /**
   * Xử lý xác nhận hủy sự cố
   */
  async function handleConfirmCancelIssue() {
    const modal = document.getElementById("confirmCancelModal");
    const issueId = modal.dataset.issueId;
    
    if (!issueId) return;

    const confirmBtn = modal.querySelector("#confirmCancelBtn");
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...`;

    try {
      const docRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/issueReports`,
        issueId
      );
      
      await updateDoc(docRef, {
        status: "Đã hủy",
      });

      await logActivity("Cancel Issue", { issueId });

      // Đóng modal xác nhận
      modal.style.display = "none";
      
      // Đóng modal chi tiết sự cố
      closeIssueDetailModal();
      
      // Hiển thị thông báo thành công
      const issueDetailModal = document.getElementById("issueDetailModal");
      const messageEl = issueDetailModal.querySelector("#detailIssueMessage");
      messageEl.textContent = "Sự cố đã được hủy thành công!";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");
      
    } catch (error) {
      console.error("Cancel Issue Error: ", error);
      alert(`Lỗi khi hủy sự cố: ${error.message}`);
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fas fa-check mr-2"></i>Có, hủy sự cố`;
    }
  }

  async function handleUpdateIssueDetails() {
    const modal = document.getElementById("issueDetailModal");
    const issueId = modal.querySelector("#detailIssueId").value;
    const newStatus = modal.querySelector("#detailIssueStatus").value;
    const assigneeSelect = modal.querySelector("#detailIssueAssignee");
    // Skip assignee if user has "Chi nhánh" role
    const newAssigneeId = (currentUserProfile.role === "Chi nhánh" || !assigneeSelect || assigneeSelect.closest("div").classList.contains("hidden"))
      ? null
      : assigneeSelect.value;
    const newAssigneeName = (newAssigneeId && assigneeSelect)
      ? assigneeSelect.options[assigneeSelect.selectedIndex].text
      : "";
    const repairedImageFile = modal.querySelector("#repairedImageInput").files[0];

    const messageEl = modal.querySelector("#detailIssueMessage");
    const saveBtn = modal.querySelector("#updateIssueBtn");

    // Kiểm tra nếu đang chọn "Đã hủy" và status hiện tại chưa phải "Đã hủy"
    if (newStatus === "Đã hủy") {
      try {
        const docRef = doc(
          db,
          `/artifacts/${canvasAppId}/public/data/issueReports`,
          issueId
        );
        const originalDoc = await getDoc(docRef);
        const originalData = originalDoc.data();
        
        // Nếu status hiện tại chưa phải "Đã hủy", hiển thị modal xác nhận
        if (originalData.status !== "Đã hủy") {
          openConfirmCancelModal(issueId, originalData.issueType, originalData.issueBranch);
          // Reset status select về giá trị cũ
          modal.querySelector("#detailIssueStatus").value = originalData.status;
          return;
        }
      } catch (error) {
        console.error("Error checking issue status:", error);
      }
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...`;

    try {
      const docRef = doc(
        db,
        `/artifacts/${canvasAppId}/public/data/issueReports`,
        issueId
      );
      const originalDoc = await getDoc(docRef);
      const originalData = originalDoc.data();

      if (
        newStatus === "Đã giải quyết" &&
        !repairedImageFile &&
        !originalData.repairedImageUrl
      ) {
        messageEl.textContent =
          "Vui lòng tải lên ảnh đã sửa chữa để hoàn tất sự cố.";
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
        messageEl.classList.remove("hidden");
        saveBtn.disabled = false;
        saveBtn.innerHTML = `Cập nhật`;
        return;
      }

      const updateData = {
        status: newStatus,
      };
      
      // Chỉ cho phép thay đổi assignee nếu:
      // 1. Không phải role "Chi nhánh"
      // 2. VÀ là Admin/Manager (không phải chỉ là assignee)
      const canChangeAssignee = currentUserProfile.role !== "Chi nhánh" && 
                                 (currentUserProfile.role === "Admin" || currentUserProfile.role === "Manager");
      
      if (canChangeAssignee) {
        updateData.assigneeId = newAssigneeId || null;
        updateData.assigneeName = newAssigneeName || null;
        
        if (newAssigneeId && originalData.assigneeId !== newAssigneeId) {
          updateData.assignerId = currentUser.uid;
          updateData.assignerName = currentUserProfile.displayName;
          updateData.assignedDate = new Date().toISOString();
        }
      }
      // Nếu chỉ là assignee (không phải Admin/Manager), giữ nguyên assigneeId và assigneeName

      // ▼▼▼ THAY ĐỔI QUAN TRỌNG ▼▼▼
      // Ghi nhận người giải quyết và ngày giải quyết
      if (
        newStatus === "Đã giải quyết" &&
        originalData.status !== "Đã giải quyết"
      ) {
        updateData.resolvedDate = new Date().toISOString();
        updateData.resolverId = currentUser.uid; // Ghi nhận ai là người giải quyết
        updateData.resolverName = currentUserProfile.displayName; // Ghi nhận tên người giải quyết
      }
      // ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲

      if (repairedImageFile) {
        // Compress repaired image before upload
        const compressedRepairedImage = await compressImage(repairedImageFile);
        
        const storageRef = ref(
          storage,
          `repaired_images/${issueId}/${Date.now()}-${compressedRepairedImage.name || repairedImageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, compressedRepairedImage);
        updateData.repairedImageUrl = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(docRef, updateData);

      logActivity("Update Issue", { issueId, newStatus, newAssigneeName });

      // Gửi thông báo khi gán sự cố cho nhân viên
      // Kiểm tra: có assignee mới VÀ assignee đã thay đổi (từ null sang có giá trị, hoặc từ người này sang người khác)
      const finalAssigneeId = updateData.assigneeId || null; // Lấy giá trị cuối cùng đã được cập nhật
      const originalAssigneeId = originalData.assigneeId || null;
      
      // Chỉ gửi thông báo nếu:
      // 1. Có assignee mới (không null, không rỗng)
      // 2. Assignee đã thay đổi so với ban đầu
      const hasNewAssignee = finalAssigneeId && 
                             finalAssigneeId !== originalAssigneeId && 
                             String(finalAssigneeId).trim() !== "";
      
      if (hasNewAssignee) {
        sendNotification(
          finalAssigneeId,
          `Bạn được giao một nhiệm vụ mới: ${originalData.issueType} tại ${originalData.issueBranch}`,
          issueId
        );
      }

      messageEl.textContent = "Cập nhật thành công!";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");
      setTimeout(() => {
        closeIssueDetailModal();
      }, 1500);
    } catch (error) {
      console.error("Update Issue Error: ", error);
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `Cập nhật`;
    }
  }

  function listenToIssueComments(issueId) {
    if (issueCommentsUnsubscribe) issueCommentsUnsubscribe();

    const commentsContainer = document.getElementById("detailIssueComments");
    const q = query(
      collection(
        db,
        `/artifacts/${canvasAppId}/public/data/issueReports/${issueId}/comments`
      ),
      orderBy("timestamp", "asc")
    );

    issueCommentsUnsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        commentsContainer.innerHTML = `<p class="text-sm text-slate-500 italic">Chưa có bình luận nào.</p>`;
        return;
      }
      
      // Get all users for mention display
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const usersSnapshot = await getDocs(usersRef);
      const usersMap = {};
      usersSnapshot.docs.forEach((doc) => {
        usersMap[doc.id] = doc.data();
      });

      commentsContainer.innerHTML = snapshot.docs
        .map((doc) => {
          const comment = doc.data();
          const timestamp = comment.timestamp
            ? new Date(comment.timestamp.toDate()).toLocaleString("vi-VN")
            : "";
          
          // Render comment text with mentions highlighted
          let renderedText = escapeHtml(comment.text);
          if (comment.mentions && comment.mentions.length > 0) {
            comment.mentions.forEach((mention) => {
              const mentionPattern = new RegExp(`@${escapeRegex(mention.name)}`, "gi");
              const mentionDisplay = mention.uid && usersMap[mention.uid]
                ? `<span class="mention-tag bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium" data-user-id="${mention.uid}">@${escapeHtml(mention.name)}</span>`
                : `@${escapeHtml(mention.name)}`;
              renderedText = renderedText.replace(mentionPattern, mentionDisplay);
            });
          }
          
          return `
                  <div class="text-sm">
                      <p><strong>${escapeHtml(comment.authorName)}:</strong> ${renderedText}</p>
                      <p class="text-xs text-slate-400">${timestamp}</p>
                  </div>
              `;
        })
        .join("");
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }, (error) => {
      if (error.code === 'unavailable' || error.message?.includes('ERR_QUIC') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        console.warn("⚠️ Lỗi kết nối Firebase: Không thể tải bình luận. Ứng dụng sẽ hoạt động ở chế độ offline.");
        if (commentsContainer) {
          commentsContainer.innerHTML = `<p class="text-sm text-yellow-600 italic">Không thể tải bình luận. Vui lòng kiểm tra kết nối mạng.</p>`;
        }
      } else if (error.code === "permission-denied" || error.message?.includes("permissions")) {
        console.error("❌ Lỗi quyền truy cập khi tải bình luận:", error);
        console.warn("⚠️ Vui lòng cập nhật Firestore Security Rules để cho phép đọc comments collection.");
        console.warn("   Xem hướng dẫn trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
        if (commentsContainer) {
          commentsContainer.innerHTML = `<p class="text-sm text-red-600 italic">Lỗi khi tải bình luận: Missing or insufficient permissions.</p>`;
        }
      } else {
        console.error("Lỗi khi tải bình luận:", error);
        if (commentsContainer) {
          commentsContainer.innerHTML = `<p class="text-sm text-red-600 italic">Lỗi khi tải bình luận: ${error.message}</p>`;
        }
      }
    });
  }

  // Helper functions for HTML escaping
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async function handleAddComment() {
    const modal = document.getElementById("issueDetailModal");
    const issueId = modal.querySelector("#detailIssueId").value;
    const commentInput = modal.querySelector("#newCommentInput");
    const commentText = commentInput.value.trim();

    if (!issueId || !commentText) return;

    try {
      // Parse mentions from comment text
      const mentions = await parseMentionsAsync(commentText);
      
      const commentsCol = collection(
        db,
        `/artifacts/${canvasAppId}/public/data/issueReports/${issueId}/comments`
      );
      
      const commentData = {
        text: commentText,
        authorId: currentUser.uid,
        authorName: currentUserProfile.displayName,
        timestamp: serverTimestamp(),
      };
      
      if (mentions.length > 0) {
        commentData.mentions = mentions;
      }
      
      await addDoc(commentsCol, commentData);
      
      // Send notifications to mentioned users
      let notifiedUsers = [];
      if (mentions.length > 0) {
        const issueDoc = await getDoc(doc(db, `/artifacts/${canvasAppId}/public/data/issueReports/${issueId}`));
        const issueData = issueDoc.exists() ? issueDoc.data() : {};
        const issueType = issueData.issueType || "Sự cố";
        const issueBranch = issueData.issueBranch || "";
        
        for (const mention of mentions) {
          if (mention.uid && mention.uid !== currentUser.uid) {
            const notificationMessage = `${currentUserProfile.displayName} đã tag bạn trong bình luận về ${issueType}${issueBranch ? ` (${issueBranch})` : ""}`;
            await sendNotification(mention.uid, notificationMessage, issueId);
            notifiedUsers.push(mention.name);
          }
        }
      }
      
      commentInput.value = "";
      hideMentionSuggestions();
      
      // Show notification reminder if users were mentioned
      const messageEl = modal.querySelector("#detailIssueMessage");
      if (notifiedUsers.length > 0) {
        const userList = notifiedUsers.join(", ");
        messageEl.textContent = `✓ Đã gửi thông báo đến ${notifiedUsers.length} người dùng: ${userList}`;
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
        messageEl.classList.remove("hidden");
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          messageEl.classList.add("hidden");
        }, 5000);
      } else {
        messageEl.classList.add("hidden");
      }
      
      logActivity("Add Comment", { issueId, commentText, mentionsCount: mentions.length });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  /**
   * Sets up mention autocomplete for comment input
   */
  function setupMentionAutocomplete(issueId) {
    const commentInput = document.getElementById("newCommentInput");
    const suggestionsDiv = document.getElementById("mentionSuggestions");
    if (!commentInput || !suggestionsDiv) return;

    let currentMentionStart = -1;
    let selectedIndex = -1;

    // Helper function to get users from cache
    function getUsersFromCache() {
      if (!usersCacheLoaded || allUsersCache.length === 0) {
        return [];
      }
      
      return allUsersCache
        .filter((user) => user.status !== "disabled" && !user.disabled)
        .map((user) => ({
          uid: user.uid,
          name: user.displayName || user.email || "",
          email: user.email || "",
          role: user.role || "",
        }))
        .filter((user) => user.name);
    }

    // Load cache if not loaded yet (async, don't block)
    if (!usersCacheLoaded) {
      loadUsersIntoCache();
    }

    function hideMentionSuggestions() {
      suggestionsDiv.classList.add("hidden");
      selectedIndex = -1;
    }

    function showMentionSuggestions(query = "") {
      // Get users from cache dynamically (in case cache loads after function is called)
      const allUsers = getUsersFromCache();
      if (!allUsers.length) return;

      const queryLower = query.toLowerCase();
      const filtered = allUsers
        .filter((user) => {
          const nameLower = user.name.toLowerCase();
          return nameLower.includes(queryLower) || user.email.toLowerCase().includes(queryLower);
        })
        .slice(0, 8); // Limit to 8 suggestions

      if (filtered.length === 0) {
        hideMentionSuggestions();
        return;
      }

      suggestionsDiv.innerHTML = filtered
        .map((user, index) => {
          const isSelected = index === selectedIndex ? "bg-indigo-50" : "";
          return `
            <div class="mention-suggestion ${isSelected} px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center space-x-2" data-index="${index}" data-uid="${user.uid}" data-name="${user.name}">
              <i class="fas fa-user-circle text-indigo-600"></i>
              <div class="flex-1">
                <div class="font-medium text-slate-700">${escapeHtml(user.name)}</div>
                ${user.role ? `<div class="text-xs text-slate-500">${escapeHtml(user.role)}</div>` : ""}
              </div>
            </div>
          `;
        })
        .join("");

      suggestionsDiv.classList.remove("hidden");

      // Add click handlers
      suggestionsDiv.querySelectorAll(".mention-suggestion").forEach((item) => {
        item.addEventListener("click", () => {
          const name = item.dataset.name;
          insertMention(name);
        });
      });
    }

    function insertMention(name) {
      const text = commentInput.value;
      const beforeMention = text.substring(0, currentMentionStart);
      const afterMention = text.substring(commentInput.selectionStart);
      commentInput.value = beforeMention + `@${name} ` + afterMention;
      commentInput.focus();
      const newCursorPos = beforeMention.length + name.length + 2;
      commentInput.setSelectionRange(newCursorPos, newCursorPos);
      hideMentionSuggestions();
    }

    commentInput.addEventListener("input", (e) => {
      const text = e.target.value;
      const cursorPos = e.target.selectionStart;
      
      // Find @ symbol before cursor
      const textBeforeCursor = text.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");
      
      if (lastAtIndex === -1) {
        hideMentionSuggestions();
        return;
      }

      // Check if there's a space after @ (meaning @ is not part of a mention)
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (textAfterAt.includes(" ")) {
        hideMentionSuggestions();
        return;
      }

      // Get the query after @
      const query = textAfterAt.trim();
      currentMentionStart = lastAtIndex;
      selectedIndex = -1;

      if (query.length === 0) {
        showMentionSuggestions("");
      } else {
        showMentionSuggestions(query);
      }
    });

    commentInput.addEventListener("keydown", (e) => {
      if (!suggestionsDiv.classList.contains("hidden") && suggestionsDiv.children.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, suggestionsDiv.children.length - 1);
          updateSelectedSuggestion();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          updateSelectedSuggestion();
        } else if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          const selectedItem = suggestionsDiv.children[selectedIndex];
          if (selectedItem) {
            const name = selectedItem.dataset.name;
            insertMention(name);
          }
        } else if (e.key === "Escape") {
          hideMentionSuggestions();
        }
      }
    });

    function updateSelectedSuggestion() {
      suggestionsDiv.querySelectorAll(".mention-suggestion").forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add("bg-indigo-50");
        } else {
          item.classList.remove("bg-indigo-50");
        }
      });
    }

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!commentInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        hideMentionSuggestions();
      }
    });

    // Store hide function globally for use in handleAddComment
    window.hideMentionSuggestions = hideMentionSuggestions;
  }

  // Make parseMentions async-compatible
  async function parseMentionsAsync(text) {
    const mentionPattern = /@([^\s@]+)/g;
    const matches = [...text.matchAll(mentionPattern)];
    
    if (matches.length === 0) return [];
    
    try {
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const snapshot = await getDocs(usersRef);
      const usersMap = new Map();
      
      snapshot.docs.forEach((doc) => {
        const userData = doc.data();
        const displayName = userData.displayName || userData.email || "";
        if (displayName) {
          usersMap.set(displayName.toLowerCase(), { uid: doc.id, name: displayName });
          // Also store by name parts for better matching
          const nameParts = displayName.toLowerCase().split(/\s+/);
          nameParts.forEach((part) => {
            if (part.length > 1 && !usersMap.has(part)) {
              usersMap.set(part, { uid: doc.id, name: displayName });
            }
          });
        }
      });
      
      const uniqueMentions = new Map();
      matches.forEach((match) => {
        const mentionName = match[1];
        const mentionLower = mentionName.toLowerCase();
        
        // Try exact match first
        let found = usersMap.get(mentionLower);
        if (!found) {
          // Try partial match
          for (const [key, value] of usersMap.entries()) {
            if (key.includes(mentionLower) || mentionLower.includes(key)) {
              found = value;
              break;
            }
          }
        }
        
        if (found && !uniqueMentions.has(found.uid)) {
          uniqueMentions.set(found.uid, {
            uid: found.uid,
            name: found.name,
          });
        }
      });
      
      return Array.from(uniqueMentions.values());
    } catch (error) {
      console.error("Error parsing mentions:", error);
      return [];
    }
  }

  function populateEditAccountModal(userData) {
    editAccountModal.querySelector("#editAccountUid").value = userData.uid;
    editAccountModal.querySelector("#editAccountEmail").value = userData.email;
    editAccountModal.querySelector("#editAccountEmployeeId").value =
      userData.employeeId || "";
    editAccountModal.querySelector("#editAccountUsername").value =
      userData.displayName || "";

    const roleSelect = editAccountModal.querySelector("#editAccountRole");
    roleSelect.innerHTML = ROLES.map(
      (r) =>
        `<option value="${r}" ${
          userData.role === r ? "selected" : ""
        }>${r}</option>`
    ).join("");

    const branchesContainer = editAccountModal.querySelector(
      "#managedBranchesCheckboxes"
    );
    branchesContainer.innerHTML = ALL_BRANCHES.map(
      (b) =>
        `<label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value="${b}" class="form-checkbox h-4 w-4 text-indigo-600 rounded" ${
          userData.managedBranches?.includes(b) ? "checked" : ""
        }><span class="text-sm">${b.replace("ICOOL ", "")}</span></label>`
    ).join("");

    const viewsContainer = editAccountModal.querySelector(
      "#allowedViewsCheckboxes"
    );
    viewsContainer.innerHTML = Object.entries(ALL_VIEWS)
      .map(
        ([id, name]) =>
          `<label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value="${id}" class="form-checkbox h-4 w-4 text-indigo-600 rounded" ${
            userData.allowedViews?.includes(id) ? "checked" : ""
          }><span class="text-sm">${name}</span></label>`
      )
      .join("");

    // Populate branch dropdown for Nhân viên
    const branchContainer = editAccountModal.querySelector("#editAccountBranchContainer");
    const branchSelect = editAccountModal.querySelector("#editAccountBranch");
    if (branchSelect) {
      branchSelect.innerHTML = '<option value="">-- Chọn chi nhánh --</option>' + 
        ALL_BRANCHES.map(b => `<option value="${b}" ${userData.branch === b ? "selected" : ""}>${b}</option>`).join("");
    }

    const handleRoleChange = () => {
      const role = roleSelect.value;
      document
        .getElementById("managedBranchesContainer")
        .classList.toggle("hidden", role !== "Manager");
      
      // Show/hide branch field for Nhân viên
      if (branchContainer) {
        branchContainer.classList.toggle("hidden", role !== "Nhân viên");
      }
    };

    roleSelect.addEventListener("change", handleRoleChange);
    handleRoleChange();

    editAccountModal.style.display = "flex";
  }

  async function handleUpdateAccountDetails() {
    const uid = editAccountModal.querySelector("#editAccountUid").value;
    const messageEl = editAccountModal.querySelector("#editAccountMessage");
    const saveBtn = editAccountModal.querySelector("#saveAccountDetailsBtn");
    if (!uid) return;

    const role = editAccountModal.querySelector("#editAccountRole").value;
    const branchSelect = editAccountModal.querySelector("#editAccountBranch");
    const branch = branchSelect?.value || "";
    
    const updatedData = {
      role: role,
      employeeId: editAccountModal
        .querySelector("#editAccountEmployeeId")
        .value.trim(),
      displayName: editAccountModal
        .querySelector("#editAccountUsername")
        .value.trim(),
      managedBranches: Array.from(
        editAccountModal.querySelectorAll(
          "#managedBranchesCheckboxes input:checked"
        )
      ).map((cb) => cb.value),
      allowedViews: Array.from(
        editAccountModal.querySelectorAll("#allowedViewsCheckboxes input:checked")
      ).map((cb) => cb.value),
    };
    
    // Thêm/xóa branch cho Nhân viên
    if (role === "Nhân viên" && branch) {
      updatedData.branch = branch;
    } else if (role !== "Nhân viên") {
      // Xóa branch nếu không phải Nhân viên
      updatedData.branch = null;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...`;

    try {
      const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${uid}`);
      await updateDoc(userDocRef, updatedData);
      await logActivity("Update User Profile", { targetUid: uid });

      // Invalidate users cache (reload cache to reflect changes)
      usersCacheLoaded = false;
      await loadUsersIntoCache();
      
      // Reload accounts page to show updated data
      await loadAccountsPage(true);

      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.textContent = "Cập nhật thành công!";
      messageEl.classList.remove("hidden");

      setTimeout(() => {
        editAccountModal.style.display = "none";
        messageEl.classList.add("hidden");
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.classList.remove("hidden");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fas fa-save mr-2"></i>Lưu Thay Đổi`;
    }
  }

  async function handleUpdateProfile() {
    if (!currentUser || !currentUserProfile || !myProfileModal) return;

    const displayNameInput = myProfileModal.querySelector("#profileDisplayName");
    const messageEl = myProfileModal.querySelector("#profileUpdateMessage");
    const updateBtn = myProfileModal.querySelector("#updateProfileBtn");

    if (!displayNameInput || !messageEl || !updateBtn) return;

    const newDisplayName = displayNameInput.value.trim();

    if (!newDisplayName) {
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = "Vui lòng nhập tên hiển thị.";
      messageEl.classList.remove("hidden");
      return;
    }

    if (newDisplayName === currentUserProfile.displayName) {
      messageEl.className = "p-3 rounded-lg text-sm alert-info";
      messageEl.textContent = "Tên hiển thị không thay đổi.";
      messageEl.classList.remove("hidden");
      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 2000);
      return;
    }

    updateBtn.disabled = true;
    updateBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...`;

    try {
      const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${currentUser.uid}`);
      await updateDoc(userDocRef, { displayName: newDisplayName });
      await logActivity("Update Own Profile", { field: "displayName", newValue: newDisplayName });

      // Update local state
      currentUserProfile.displayName = newDisplayName;
      loggedInUserDisplay.textContent = newDisplayName;
      dropdownUserName.textContent = newDisplayName;

      messageEl.className = "p-3 rounded-lg text-sm alert-success";
      messageEl.textContent = "Cập nhật tên hiển thị thành công!";
      messageEl.classList.remove("hidden");

      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.classList.remove("hidden");
    } finally {
      updateBtn.disabled = false;
      updateBtn.innerHTML = `<i class="fas fa-save mr-2"></i>Cập nhật thông tin`;
    }
  }

  async function handleChangePassword() {
    if (!currentUser || !currentUserProfile || !myProfileModal) return;

    const currentPasswordInput = myProfileModal.querySelector("#profileCurrentPassword");
    const newPasswordInput = myProfileModal.querySelector("#profileNewPassword");
    const confirmPasswordInput = myProfileModal.querySelector("#profileConfirmPassword");
    const messageEl = myProfileModal.querySelector("#passwordChangeMessage");
    const changeBtn = myProfileModal.querySelector("#changePasswordBtn");

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput || !messageEl || !changeBtn) return;

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!currentPassword) {
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = "Vui lòng nhập mật khẩu hiện tại.";
      messageEl.classList.remove("hidden");
      return;
    }

    if (newPassword.length < 6) {
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = "Mật khẩu mới phải có ít nhất 6 ký tự.";
      messageEl.classList.remove("hidden");
      return;
    }

    if (newPassword !== confirmPassword) {
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = "Mật khẩu xác nhận không khớp.";
      messageEl.classList.remove("hidden");
      return;
    }

    changeBtn.disabled = true;
    changeBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang đổi mật khẩu...`;

    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      // Update requiresPasswordChange flag if it was set
      if (currentUserProfile.requiresPasswordChange) {
        const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${currentUser.uid}`);
        await updateDoc(userDocRef, { requiresPasswordChange: false });
        currentUserProfile.requiresPasswordChange = false;
      }

      await logActivity("Change Own Password", {});

      // Clear password fields
      currentPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";

      messageEl.className = "p-3 rounded-lg text-sm alert-success";
      messageEl.textContent = "Đổi mật khẩu thành công!";
      messageEl.classList.remove("hidden");

      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Lỗi khi đổi mật khẩu.";
      
      if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu hiện tại không đúng.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Vui lòng đăng nhập lại để đổi mật khẩu.";
      } else {
        errorMessage = `Lỗi: ${error.message}`;
      }

      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.textContent = errorMessage;
      messageEl.classList.remove("hidden");
    } finally {
      changeBtn.disabled = false;
      changeBtn.innerHTML = `<i class="fas fa-key mr-2"></i>Đổi mật khẩu`;
    }
  }

  async function handleCreateAccount() {
    // Lấy thêm vai trò (role) từ dropdown mới
    const email = mainContentContainer.querySelector("#createAccountEmail").value.trim();
    const password = mainContentContainer.querySelector("#createAccountPassword").value;
    const displayName = mainContentContainer.querySelector("#createAccountUsername").value.trim();
    const role = mainContentContainer.querySelector("#createAccountRole").value;
    const employeeIdInput = mainContentContainer.querySelector("#createAccountEmployeeId");
    const branchSelect = mainContentContainer.querySelector("#createAccountBranch");
    const messageEl = mainContentContainer.querySelector("#createAccountMessage");

    let employeeId = employeeIdInput.value.trim();
    const branch = branchSelect?.value || "";

    // --- LOGIC VALIDATION MỚI ---
    let validationError = "";
    if (!email || password.length < 6 || !displayName) {
      validationError = "Vui lòng điền đầy đủ Email, Mật khẩu (tối thiểu 6 ký tự), và Tên người dùng.";
    }

    // Chỉ yêu cầu MSNV nếu vai trò KHÔNG PHẢI "Chi nhánh"
    if (role !== "Chi nhánh" && !employeeId) {
      validationError = "Mã nhân viên (MSNV) là bắt buộc cho vai trò này.";
    }

    // Yêu cầu branch nếu là "Nhân viên"
    if (role === "Nhân viên" && !branch) {
      validationError = "Chi nhánh là bắt buộc cho vai trò Nhân viên.";
    }

    // Nếu là "Chi nhánh", tự động gán MSNV là "N/A"
    if (role === "Chi nhánh") {
      employeeId = "N/A";
    }

    if (validationError) {
      messageEl.textContent = validationError;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      return;
    }
    // --- KẾT THÚC VALIDATION MỚI ---

    try {
      // --- GIẢI PHÁP: TẠO APP TẠM THỜI ---
      // 1. Khởi tạo một app Firebase tạm thời với tên duy nhất
      //    Hàm initializeApp và getAuth đã được import ở đầu tệp.
      const tempAppName = `temp-create-user-${Date.now()}`;
      const tempApp = initializeApp(firebaseConfig, tempAppName);
      const tempAuth = getAuth(tempApp);

      // 2. Tạo người dùng trên instance `tempAuth` này.
      //    Hành động này sẽ đăng nhập người dùng MỚI vào `tempAuth`,
      //    NHƯNG không ảnh hưởng đến `auth` (instance chính của Admin).
      const userCredential = await createUserWithEmailAndPassword(
        tempAuth,
        email,
        password
      );
      const newUid = userCredential.user.uid;

      // 3. Đăng xuất người dùng mới khỏi instance tạm thời (để dọn dẹp)
      await signOut(tempAuth);
      // (Không cần xóa `tempApp`, nó sẽ tự mất khi tải lại trang)
      
      // --- KẾT THÚC GIẢI PHÁP ---

      // 4. Tạo hồ sơ người dùng trong Firestore (dùng `db` chính)
      const newUserProfile = {
        email: email,
        displayName: displayName,
        employeeId: employeeId,
        role: role,
        allowedViews: DEFAULT_VIEWS[role] || DEFAULT_VIEWS["Nhân viên"],
        managedBranches: [],
        requiresPasswordChange: true,
      };
      
      // Thêm branch cho Nhân viên
      if (role === "Nhân viên" && branch) {
        newUserProfile.branch = branch;
      }

      await setDoc(
        doc(db, `/artifacts/${canvasAppId}/users/${newUid}`),
        newUserProfile
      );

      // 5. Xác minh hồ sơ đã được lưu
      const verifyDoc = await getDoc(doc(db, `/artifacts/${canvasAppId}/users/${newUid}`));
      if (!verifyDoc.exists()) {
        throw new Error("Failed to create user profile in database");
      }

      // 6. Ghi lại hoạt động (với tư cách là Admin - `currentUser` vẫn là Admin)
      //    Hàm `logActivity` sẽ tự động sử dụng `currentUserProfile` CỦA ADMIN
      //    vì phiên đăng nhập chính không hề bị thay đổi.
      await logActivity("Admin Create User", { newEmail: email, newUid: newUid });
      
      // 7. Invalidate users cache (reload cache to include new user)
      usersCacheLoaded = false;
      await loadUsersIntoCache();
      
      // 8. Hiển thị thông báo thành công và xóa form
      messageEl.textContent = `Tạo tài khoản ${email} (vai trò: ${role}) thành công! Tài khoản đã sẵn sàng. Người dùng có thể đăng nhập và sẽ được yêu cầu đổi mật khẩu lần đầu.`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");
      
      mainContentContainer.querySelector("#createAccountEmail").value = "";
      mainContentContainer.querySelector("#createAccountPassword").value = "";
      mainContentContainer.querySelector("#createAccountUsername").value = "";
      mainContentContainer.querySelector("#createAccountEmployeeId").value = "";
      if (branchSelect) branchSelect.value = "";
      
    } catch (error) {
      console.error("Error creating account:", error);
      
      // Xử lý các lỗi Firebase phổ biến với thông báo tiếng Việt
      let errorMessage = "Lỗi tạo tài khoản: ";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = `Email "${email}" đã được sử dụng. Vui lòng chọn email khác hoặc kiểm tra lại danh sách tài khoản.`;
      } else if (error.code === "auth/invalid-email") {
        errorMessage = `Email "${email}" không hợp lệ. Vui lòng kiểm tra lại định dạng email.`;
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu có ít nhất 6 ký tự và có độ phức tạp cao hơn.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Tính năng tạo tài khoản bằng email/mật khẩu chưa được bật. Vui lòng liên hệ quản trị viên.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.";
      } else if (error.message) {
        // Fallback: hiển thị message từ error nếu không match các code trên
        errorMessage = `Lỗi tạo tài khoản: ${error.message}`;
      } else {
        errorMessage = "Đã xảy ra lỗi không xác định khi tạo tài khoản. Vui lòng thử lại sau.";
      }
      
      messageEl.textContent = errorMessage;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
    }
  }

  async function handleExcelImport() {
    const fileInput = document.getElementById("excelFileInput");
    const messageEl = document.getElementById("importExcelMessage");
    const file = fileInput.files[0];

    if (!file) {
      messageEl.textContent = "Vui lòng chọn một file Excel.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      let createCount = 0;
      let updateCount = 0;
      let errorCount = 0;
      let errors = [];

      for (const row of json) {
        
        // --- ▼▼▼ LOGIC VALIDATION MỚI ĐÃ SỬA ▼▼▼ ---
        let { email, password, displayName, employeeId, role } = row;
        
        // Normalize email and displayName (trim whitespace)
        email = email ? email.toString().trim() : "";
        displayName = displayName ? displayName.toString().trim() : "";

        // 1. Kiểm tra các trường cơ bản
        if (!email || !displayName) {
          errorCount++;
          errors.push(
            `Dòng ${
              createCount + updateCount + errorCount
            }: Thiếu thông tin email hoặc tên người dùng.`
          );
          continue;
        }

        // 2. Xử lý Vai trò
        const userRole = ROLES.includes(role) ? role : "Nhân viên";

        // 3. Xử lý EmployeeId (MSNV)
        if (userRole === "Chi nhánh") {
            // Nếu là Chi nhánh, không bắt buộc, tự gán "N/A" nếu trống
            employeeId = employeeId ? employeeId.toString() : "N/A";
        } else {
            // Nếu là vai trò khác, BẮT BUỘC phải có
            if (!employeeId) {
                errorCount++;
                errors.push(
                  `Dòng ${
                    createCount + updateCount + errorCount
                  }: (Email: ${email}) Thiếu 'employeeId' (bắt buộc cho vai trò ${userRole}).`
                );
                continue;
            }
            employeeId = employeeId.toString(); // Đảm bảo là string
        }
        // --- ▲▲▲ KẾT THÚC LOGIC VALIDATION MỚI ▲▲▲ ---

        const existingUser = allUsersCache.find((u) => u.email === email);

        if (existingUser) {
          // Update existing user
          // LƯU Ý: Không reset mật khẩu và không thay đổi role/quyền của tài khoản đã tồn tại
          // Chỉ cập nhật thông tin cơ bản: displayName, employeeId
          try {
            const userDocRef = doc(
              db,
              `/artifacts/${canvasAppId}/users/${existingUser.uid}`
            );
            const profileUpdate = {
              displayName,
              employeeId, // <-- Dùng employeeId đã qua xử lý
              // KHÔNG cập nhật role và allowedViews để giữ nguyên quyền của người dùng
              // role: userRole, // Đã bỏ - không thay đổi role của tài khoản đã tồn tại
              // allowedViews: DEFAULT_VIEWS[userRole] || DEFAULT_VIEWS["Nhân viên"], // Đã bỏ
            };
            await updateDoc(userDocRef, profileUpdate);
            await logActivity("Admin Bulk Update User", { 
              updatedEmail: email,
              note: "Chỉ cập nhật displayName và employeeId, giữ nguyên role và mật khẩu"
            });
            updateCount++;
          } catch (error) {
            errorCount++;
            errors.push(`Cập nhật ${email}: ${error.message}`);
          }
        } else {
          // Create new user
          if (!password || password.toString().length < 6) {
            errorCount++;
            errors.push(`Tạo mới ${email}: Mật khẩu không hợp lệ.`);
            continue;
          }

          try {
            // --- GIẢI PHÁP: TẠO APP TẠM THỜI ---
            // Tạo một app Firebase tạm thời để tạo user mà không ảnh hưởng đến phiên đăng nhập của Admin
            const tempAppName = `temp-create-user-${Date.now()}-${Math.random()}`;
            const tempApp = initializeApp(firebaseConfig, tempAppName);
            const tempAuth = getAuth(tempApp);

            // Tạo người dùng trên instance `tempAuth` này
            const userCredential = await createUserWithEmailAndPassword(
              tempAuth,
              email,
              password
            );
            const newUid = userCredential.user.uid;

            // Đăng xuất người dùng mới khỏi instance tạm thời
            await signOut(tempAuth);
            // --- KẾT THÚC GIẢI PHÁP ---

            const newUserProfile = {
              email: email,
              displayName: displayName,
              employeeId: employeeId, // <-- Dùng employeeId đã qua xử lý
              role: userRole, // <-- Dùng vai trò đã xử lý
              allowedViews: DEFAULT_VIEWS[userRole] || DEFAULT_VIEWS["Nhân viên"], // Dùng quyền động
              managedBranches: [],
              requiresPasswordChange: true,
            };

            await setDoc(
              doc(db, `/artifacts/${canvasAppId}/users/${newUid}`),
              newUserProfile
            );
            
            // Verify the profile was saved successfully
            const verifyDoc = await getDoc(doc(db, `/artifacts/${canvasAppId}/users/${newUid}`));
            if (!verifyDoc.exists()) {
              throw new Error("Failed to create user profile in database");
            }
            
            // Log activity as the admin (currentUserProfile vẫn là Admin vì không bị đăng xuất)
            await logActivity("Admin Bulk Create User", { newEmail: email });
            
            createCount++;
          } catch (error) {
            errorCount++;
            
            // Xử lý các lỗi Firebase phổ biến với thông báo tiếng Việt
            let errorMsg = "";
            if (error.code === "auth/email-already-in-use") {
              // Email đã tồn tại trong Firebase Auth nhưng không có trong cache
              // Có thể là tài khoản đã tồn tại nhưng chưa có profile trong Firestore
              errorMsg = `Email "${email}" đã được sử dụng trong hệ thống. Vui lòng kiểm tra lại hoặc cập nhật thông tin tài khoản hiện có.`;
            } else if (error.code === "auth/invalid-email") {
              errorMsg = `Email "${email}" không hợp lệ`;
            } else if (error.code === "auth/weak-password") {
              errorMsg = `Mật khẩu quá yếu cho ${email} (tối thiểu 6 ký tự)`;
            } else if (error.code === "auth/operation-not-allowed") {
              errorMsg = `Tạo tài khoản bị chặn cho ${email}`;
            } else if (error.code === "auth/network-request-failed") {
              errorMsg = `Lỗi kết nối mạng khi tạo ${email}`;
            } else if (error.message) {
              errorMsg = error.message;
            } else {
              errorMsg = `Lỗi không xác định (code: ${error.code || "N/A"})`;
            }
            
            console.error(`Lỗi tạo tài khoản ${email}:`, error);
            errors.push(`Tạo mới ${email}: ${errorMsg}`);
          }
        }
      }

      const messageText = createCount > 0 
        ? `Hoàn tất: <br> - ${createCount} tài khoản đã tạo. <br> - ${updateCount} tài khoản đã cập nhật. <br> - ${errorCount} lỗi.${createCount > 0 ? '<br><br><strong>Lưu ý: Các tài khoản mới đã sẵn sàng. Người dùng có thể đăng nhập và sẽ được yêu cầu đổi mật khẩu lần đầu.</strong>' : ''}`
        : `Hoàn tất: <br> - ${createCount} tài khoản đã tạo. <br> - ${updateCount} tài khoản đã cập nhật. <br> - ${errorCount} lỗi.`;
      
      messageEl.innerHTML = messageText;
      if (errors.length > 0) {
        messageEl.innerHTML += `<br>Chi tiết lỗi: <br>${errors
          .slice(0, 5)
          .join("<br>")}`;
      }
      messageEl.className = `p-3 rounded-lg text-sm ${
        errorCount > 0 ? "alert-error" : "alert-success"
      }`;
      messageEl.classList.remove("hidden");
      fileInput.value = ""; // Clear file input
      
      // Invalidate users cache after bulk import (reload cache to include new/updated users)
      if (createCount > 0 || updateCount > 0) {
        usersCacheLoaded = false;
        loadUsersIntoCache().catch(err => console.error("Failed to reload users cache:", err));
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleDownloadTemplate() {
    const templateData = [
      {
        email: "nhanvien.a@example.com",
        password: "password123",
        displayName: "Nguyễn Văn A",
        employeeId: "NV001", // Bắt buộc cho Nhân viên
        role: "Nhân viên",
      },
      {
        email: "quanly.b@example.com",
        password: "password456",
        displayName: "Trần Thị B",
        employeeId: "QL001", // Bắt buộc cho Manager
        role: "Manager",
      },
      {
        email: "admin.c@example.com",
        password: "password789",
        displayName: "Lê Văn C",
        employeeId: "AD001", // Bắt buộc cho Admin
        role: "Admin",
      },
      {
        email: "chinhanh.d@example.com", // <-- VÍ DỤ MỚI
        password: "password123", // <-- VÍ DỤ MỚI
        displayName: "Karaoke Chi Nhánh D", // <-- VÍ DỤ MỚI
        employeeId: "", // <-- VÍ DỤ MỚI (Có thể để trống)
        role: "Chi nhánh", // <-- VÍ DỤ MỚI
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachTaiKhoan");

    // Trigger the download
    XLSX.writeFile(workbook, "mau-tai-khoan-updated.xlsx"); // Đổi tên file cho đỡ nhầm
  }

  function openDeleteAccountModal(uid, name) {
    const modal = document.getElementById("deleteAccountModal");
    modal.querySelector("#deleteAccountUid").value = uid;
    modal.querySelector("#deleteAccountName").textContent = name;
    modal.style.display = "flex";
  }

  async function handleDisableAccount(uid, anonymize = false) {
    const modal = document.getElementById("deleteAccountModal");
    try {
      if (anonymize) {
        // Anonymize Issue Reports
        const issuesQuery = query(
          collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`),
          where("reporterId", "==", uid)
        );
        const issuesSnapshot = await getDocs(issuesQuery);
        const issueUpdates = [];
        issuesSnapshot.forEach((doc) => {
          issueUpdates.push(
            updateDoc(doc.ref, {
              reporterName: "Người dùng đã bị xóa",
              reporterId: null,
            })
          );
        });
        await Promise.all(issueUpdates);
      }

      // Finally, disable the user document
      await updateDoc(doc(db, `/artifacts/${canvasAppId}/users/${uid}`), {
        status: "disabled",
      });

      await logActivity(
        anonymize ? "Disable and Anonymize User" : "Disable User",
        { disabledUid: uid }
      );

      // Invalidate users cache (reload cache to reflect changes)
      usersCacheLoaded = false;
      await loadUsersIntoCache();

      modal.style.display = "none";
      // No need to call render manually, the listener will do it.
    } catch (error) {
      console.error("Error during account disable:", error);
      alert("Đã xảy ra lỗi khi thực hiện thao tác.");
    }
  }

  async function handleEnableAccount(uid) {
    if (!uid) return;

    try {
      const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${uid}`);
      await updateDoc(userDocRef, {
        status: null,
      });

      await logActivity("Enable User", { enabledUid: uid });
      
      // Invalidate users cache (reload cache to reflect changes)
      usersCacheLoaded = false;
      await loadUsersIntoCache();
      
      // No need to call render manually, the listener will do it.
    } catch (error) {
      console.error("Error during account enable:", error);
    }
  }

  // --- Feature Handlers: Issue Report, Attendance ---
  async function handleReportIssue() {
    const reporterName =
      mainContentContainer.querySelector("#reporterName").value;
    const issueType = mainContentContainer.querySelector("#issueType").value;
    const priority = mainContentContainer.querySelector("#issuePriority").value;
    const issueBranch = mainContentContainer.querySelector("#issueBranch").value;
    const issueDescription =
      mainContentContainer.querySelector("#issueDescription").value;
    const imageFile = mainContentContainer.querySelector("#issueImage").files[0];
    const messageEl = mainContentContainer.querySelector("#issueMessage");
    const button = mainContentContainer.querySelector("#reportIssueBtn");
    // Kiểm tra xem có cần phạm vi sự cố không (ẩn nếu là "Văn phòng" hoặc "SPACE A&A")
    const shouldRequireScope = issueBranch !== "Văn phòng" && issueBranch !== "SPACE A&A";
    const checkedScopeRadio = mainContentContainer.querySelector(
      'input[name="issueScope"]:checked'
    );
    // Nếu là "Văn phòng" hoặc "SPACE A&A", luôn set là "all_rooms"
    const issueScope = (!shouldRequireScope || !checkedScopeRadio) ? "all_rooms" : checkedScopeRadio.value;

    // Logic lấy danh sách phòng đã chọn từ các checkbox
    let specificRooms = null;
    if (shouldRequireScope && issueScope === "specific_rooms") {
      const checkedRooms = mainContentContainer.querySelectorAll(
        ".room-checkbox:checked"
      );
      const selectedRooms = Array.from(checkedRooms).map(
        (checkbox) => checkbox.value
      );
      if (selectedRooms.length > 0) {
        specificRooms = selectedRooms.join(", ");
      }
    }

    // Validation: Kiểm tra các trường bắt buộc
    const validationErrors = [];
    
    if (!issueType || issueType.trim() === "") {
      validationErrors.push("Loại sự cố");
    }
    if (!priority || priority.trim() === "") {
      validationErrors.push("Mức độ ưu tiên");
    }
    if (!issueBranch || issueBranch.trim() === "") {
      validationErrors.push("Chi nhánh");
    }
    if (!issueDescription || issueDescription.trim() === "") {
      validationErrors.push("Mô tả chi tiết");
    }
    // Kiểm tra bắt buộc phải có hình ảnh
    const imageInput = mainContentContainer.querySelector("#issueImage");
    if (!imageFile || !imageInput || !imageInput.files || imageInput.files.length === 0) {
      validationErrors.push("Ảnh mô tả lỗi");
    }
    // Chỉ yêu cầu phạm vi sự cố nếu không phải "Văn phòng" hoặc "SPACE A&A"
    if (shouldRequireScope && issueScope === "specific_rooms" && !specificRooms) {
      validationErrors.push("Chọn ít nhất 1 phòng cụ thể");
    }
    
    if (validationErrors.length > 0) {
      messageEl.textContent = `Vui lòng điền đầy đủ thông tin: ${validationErrors.join(", ")}.`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      
      // Scroll to first error field
      if (!issueType || issueType.trim() === "") {
        mainContentContainer.querySelector("#issueType")?.focus();
      } else if (!priority || priority.trim() === "") {
        mainContentContainer.querySelector("#issuePriority")?.focus();
      } else if (!issueBranch || issueBranch.trim() === "") {
        mainContentContainer.querySelector("#issueBranch")?.focus();
      } else if (!issueDescription || issueDescription.trim() === "") {
        mainContentContainer.querySelector("#issueDescription")?.focus();
      } else if (!imageFile || !imageInput || !imageInput.files || imageInput.files.length === 0) {
        imageInput?.focus();
        imageInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      return;
    }

    // Vô hiệu hóa nút để tránh gửi nhiều lần
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang gửi...`;

    try {
      let imageUrl = "";
      // Tải ảnh lên (bắt buộc phải có)
      if (!imageFile) {
        throw new Error("Ảnh mô tả lỗi là bắt buộc. Vui lòng tải lên ảnh trước khi gửi báo cáo.");
      }
      
      // Compress image before upload
      const compressedImage = await compressImage(imageFile);
      
      const storageRef = ref(
        storage,
        `issue_images/${currentUser.uid}/${Date.now()}-${compressedImage.name || imageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, compressedImage);
      imageUrl = await getDownloadURL(snapshot.ref);
      
      // Kiểm tra lại để đảm bảo đã có URL hình ảnh
      if (!imageUrl || imageUrl.trim() === "") {
        throw new Error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
      }

      // Chuẩn bị dữ liệu để lưu vào Firestore
      const reportData = {
        reporterId: currentUser.uid,
        reporterName: reporterName,
        issueType: issueType,
        priority: priority,
        issueBranch: issueBranch,
        issueDescription: issueDescription,
        issueImageUrl: imageUrl,
        reportDate: new Date().toISOString(),
        status: "Chờ xử lý",
        issueScope: issueScope,
        specificRooms: specificRooms,
        assigneeId: null,
        assigneeName: null,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Hạn xử lý mặc định là 24h
        assignerId: null,
        assignerName: null,
        assignedDate: null,
        resolverId: null,
        resolverName: null,
        resolvedDate: null,
        escalated: false,
      };

      // Thêm báo cáo mới vào collection
      await addDoc(
        collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`),
        reportData
      );

      // Hiển thị thông báo thành công
      messageEl.textContent = "Báo cáo sự cố thành công!";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");

      // Reset các trường trong form
      mainContentContainer.querySelector("#issueDescription").value = "";
      mainContentContainer.querySelector("#issueImage").value = "";

      // Bỏ chọn tất cả checkbox
      mainContentContainer
        .querySelectorAll(".room-checkbox:checked")
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      // Cập nhật lại giao diện trigger để xóa các thẻ tag và hiện placeholder
      const roomsTrigger = mainContentContainer.querySelector(
        "#specificRoomsTrigger"
      );
      if (roomsTrigger) {
        roomsTrigger.innerHTML = `<span class="placeholder-text">Chọn phòng...</span><i class="fas fa-chevron-down text-xs text-slate-500 ml-auto"></i>`;
      }
    } catch (error) {
      // Xử lý và hiển thị lỗi nếu có
      console.error("Error reporting issue:", error);
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
    } finally {
      // Kích hoạt lại nút sau khi hoàn tất
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-paper-plane mr-2"></i>Gửi Báo Cáo`;
    }
  }

  function handleAttendance(action) {
    currentAttendanceAction = action;
    cameraModal.style.display = "flex";
    cameraModal.querySelector(
      "#cameraModalTitle"
    ).textContent = `${action} - Chụp Ảnh Xác Thực`;
    startCameraStream();
    updateLiveInfo();
  }

  function updateLiveInfo() {
    const timeEl = document.getElementById("camera-time");
    const dateEl = document.getElementById("camera-date");
    const dayEl = document.getElementById("camera-day");
    const userEl = document.getElementById("camera-user");

    userEl.textContent = `Họ tên: ${currentUserProfile.displayName}`;

    if (timeInterval) clearInterval(timeInterval);

    timeInterval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateString = now.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const dayString = now.toLocaleDateString("vi-VN", { weekday: "long" });

      timeEl.textContent = timeString;
      dateEl.textContent = dateString;
      dayEl.textContent = dayString;
    }, 1000);

    getLocationAndAddress();
  }

  async function getLocationAndAddress() {
    const addressEl = document.getElementById("camera-address");
    addressEl.textContent = "Đang lấy vị trí...";
    capturedLocationInfo = null;

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Không thể chuyển đổi vị trí.");
      const data = await response.json();

      capturedLocationInfo = {
        latitude,
        longitude,
        address: data.display_name || "Không tìm thấy địa chỉ",
      };
      addressEl.textContent = capturedLocationInfo.address;
    } catch (error) {
      console.error("Location Error:", error);
      addressEl.textContent =
        "Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập.";
      capturedLocationInfo = { error: error.message };
    }
  }

  async function startCameraStream() {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach((track) => track.stop());
    }

    const video = cameraModal.querySelector("#cameraFeed");
    const preview = cameraModal.querySelector("#photoPreview");
    const captureBtn = cameraModal.querySelector("#captureBtn");
    const recaptureBtn = cameraModal.querySelector("#recaptureBtn");
    const confirmBtn = cameraModal.querySelector("#confirmAttendanceBtn");
    const messageEl = cameraModal.querySelector("#cameraMessage");

    // Reset UI
    video.classList.remove("hidden");
    preview.classList.add("hidden");
    captureBtn.classList.remove("hidden");
    recaptureBtn.classList.add("hidden");
    confirmBtn.classList.add("hidden");
    messageEl.classList.add("hidden");
    messageEl.textContent = "";
    messageEl.className = "hidden mt-4 p-3 rounded-lg text-sm flex-shrink-0";

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      messageEl.innerHTML = `
        <div class="flex items-start">
          <i class="fas fa-exclamation-triangle text-red-500 mr-2 mt-0.5"></i>
          <div>
            <p class="font-semibold mb-1">Trình duyệt không hỗ trợ camera</p>
            <p class="text-sm">Vui lòng sử dụng trình duyệt khác (Chrome, Firefox, Edge) hoặc cập nhật trình duyệt của bạn.</p>
          </div>
        </div>
      `;
      messageEl.className = "mt-4 p-4 rounded-lg text-sm flex-shrink-0 bg-red-50 border border-red-200 text-red-800";
      messageEl.classList.remove("hidden");
      video.classList.add("hidden");
      captureBtn.disabled = true;
      captureBtn.classList.add("opacity-50", "cursor-not-allowed");
      return;
    }

    try {
      currentCameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      video.srcObject = currentCameraStream;
      
      // Hide error message if camera works
      messageEl.classList.add("hidden");
      
      // Enable capture button when camera works
      captureBtn.disabled = false;
      captureBtn.classList.remove("opacity-50", "cursor-not-allowed");
    } catch (err) {
      console.error("Camera error:", err);
      
      // Hide video on error
      video.classList.add("hidden");
      
      // Xử lý các lỗi camera phổ biến với thông báo tiếng Việt
      let errorMessage = "";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Không có quyền truy cập camera</p>
              <p class="text-sm">Vui lòng:</p>
              <ul class="text-sm list-disc list-inside mt-1 space-y-1">
                <li>Nhấp vào biểu tượng camera trên thanh địa chỉ trình duyệt</li>
                <li>Chọn "Cho phép" để cấp quyền truy cập camera</li>
                <li>Làm mới trang và thử lại</li>
              </ul>
            </div>
          </div>
        `;
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-video-slash text-red-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Không tìm thấy camera</p>
              <p class="text-sm">Vui lòng kiểm tra:</p>
              <ul class="text-sm list-disc list-inside mt-1 space-y-1">
                <li>Camera đã được kết nối đúng cách chưa?</li>
                <li>Camera có đang được sử dụng bởi ứng dụng khác không?</li>
                <li>Thử ngắt kết nối và kết nối lại camera</li>
              </ul>
            </div>
          </div>
        `;
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-exclamation-circle text-orange-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Camera đang được sử dụng</p>
              <p class="text-sm">Vui lòng:</p>
              <ul class="text-sm list-disc list-inside mt-1 space-y-1">
                <li>Đóng các ứng dụng khác đang sử dụng camera (Zoom, Teams, Skype, v.v.)</li>
                <li>Làm mới trang và thử lại</li>
                <li>Khởi động lại trình duyệt nếu vẫn không được</li>
              </ul>
            </div>
          </div>
        `;
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-cog text-blue-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Camera không hỗ trợ yêu cầu</p>
              <p class="text-sm">Vui lòng thử lại hoặc sử dụng camera khác.</p>
            </div>
          </div>
        `;
      } else if (err.name === "AbortError") {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-times-circle text-gray-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Quá trình truy cập camera bị hủy</p>
              <p class="text-sm">Vui lòng thử lại.</p>
            </div>
          </div>
        `;
      } else {
        errorMessage = `
          <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Không thể kết nối camera</p>
              <p class="text-sm">Vui lòng kiểm tra lại camera và quyền truy cập, sau đó thử lại.</p>
              <p class="text-xs text-gray-500 mt-1">Lỗi: ${err.name || err.message || "Không xác định"}</p>
            </div>
          </div>
        `;
      }
      
      // Add retry button to error message
      errorMessage += `
        <div class="mt-3 pt-3 border-t border-red-300">
          <button 
            id="retryCameraBtn" 
            class="btn-primary text-sm w-full sm:w-auto"
          >
            <i class="fas fa-redo mr-2"></i>Thử lại
          </button>
        </div>
      `;
      
      messageEl.innerHTML = errorMessage;
      messageEl.className = "mt-4 p-4 rounded-lg text-sm flex-shrink-0 bg-red-50 border border-red-200 text-red-800";
      messageEl.classList.remove("hidden");
      
      // Disable capture button when camera fails
      captureBtn.disabled = true;
      captureBtn.classList.add("opacity-50", "cursor-not-allowed");
      
      // Setup retry button click handler
      const retryBtn = messageEl.querySelector("#retryCameraBtn");
      if (retryBtn) {
        // Remove old listeners if any
        const newRetryBtn = retryBtn.cloneNode(true);
        retryBtn.parentNode.replaceChild(newRetryBtn, retryBtn);
        
        newRetryBtn.addEventListener("click", () => {
          startCameraStream();
        });
      }
    }
  }
  
  // Expose startCameraStream globally for retry button
  window.startCameraStream = startCameraStream;

  function capturePhoto() {
    const video = cameraModal.querySelector("#cameraFeed");
    const canvas = cameraModal.querySelector("#photoCanvas");
    const preview = cameraModal.querySelector("#photoPreview");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      capturedPhotoBlob = blob;
      preview.src = URL.createObjectURL(blob);

      video.classList.add("hidden");
      preview.classList.remove("hidden");
      cameraModal.querySelector("#captureBtn").classList.add("hidden");
      cameraModal.querySelector("#recaptureBtn").classList.remove("hidden");
      cameraModal
        .querySelector("#confirmAttendanceBtn")
        .classList.remove("hidden");

      stopCameraStream();
    }, "image/jpeg");
  }

  function stopCameraStream() {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach((track) => track.stop());
      currentCameraStream = null;
    }
  }

  async function confirmAttendance() {
    if (!capturedPhotoBlob) return;

    const messageEl = mainContentContainer.querySelector("#attendanceMessage");
    const modalMessageEl = cameraModal.querySelector("#cameraMessage");
    const confirmBtn = cameraModal.querySelector("#confirmAttendanceBtn");

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

    try {
      // Compress photo before upload
      const compressedPhoto = await compressImage(capturedPhotoBlob, {
        fileType: "image/jpeg", // Keep as JPEG for attendance photos
      });

      const today = new Date().toISOString().split("T")[0];
      const storageRef = ref(
        storage,
        `attendance_photos/${currentUser.uid}/${today}/${Date.now()}.jpg`
      );
      const snapshot = await uploadBytes(storageRef, compressedPhoto);
      const photoUrl = await getDownloadURL(snapshot.ref);

      await addDoc(
        collection(
          db,
          `/artifacts/${canvasAppId}/users/${currentUser.uid}/attendance`
        ),
        {
          action: currentAttendanceAction,
          timestamp: serverTimestamp(),
          photoUrl: photoUrl,
          location: capturedLocationInfo || { error: "No location captured" },
        }
      );

      const successTime = new Date().toLocaleString("vi-VN");
      messageEl.textContent = `${currentAttendanceAction} thành công lúc ${successTime}!`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");
      closeCameraModal();
    } catch (error) {
      modalMessageEl.textContent = `Lỗi: ${error.message}`;
      modalMessageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      modalMessageEl.classList.remove("hidden");
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác Nhận";
    }
  }

  function listenToAttendance() {
    const listEl = mainContentContainer.querySelector("#attendanceHistory");
    if (!listEl) return;
    const q = query(
      collection(
        db,
        `/artifacts/${canvasAppId}/users/${currentUser.uid}/attendance`
      ),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      listEl.innerHTML =
        snapshot.docs.length > 0
          ? snapshot.docs
              .map((doc) => {
                const data = doc.data();
                const time = data.timestamp
                  ? new Date(data.timestamp.toDate()).toLocaleString("vi-VN")
                  : "";
                return `<li class="p-2 bg-slate-50 rounded-md text-sm">${data.action} lúc: ${time}</li>`;
              })
              .join("")
          : `<li class="text-slate-500">Chưa có lịch sử.</li>`;
    });
    unsubscribeListeners.push(unsubscribe);
  }

  // --- Shift Management Functions ---
  
  /**
   * Initializes default shifts if no shifts exist, or updates existing default shifts
   */
  async function initializeDefaultShifts() {
    try {
      const shiftsRef = collection(db, `/artifacts/${canvasAppId}/public/data/shifts`);
      const snapshot = await getDocs(shiftsRef);
      
      // Default shifts configuration
      const defaultShifts = [
        { name: "Ca Đêm 1 (18h-04h)", startTime: "18:00", endTime: "04:00", breakDuration: 30 },
        { name: "Ca Sáng (8h30-17h30)", startTime: "08:30", endTime: "17:30", breakDuration: 60 },
        { name: "Ca Chiều (16h-24h)", startTime: "16:00", endTime: "24:00", breakDuration: 0 },
        { name: "Ca Đêm 2 (22h-6h)", startTime: "22:00", endTime: "06:00", breakDuration: 0 },
        { name: "Ca Sáng Sớm (6h-15h)", startTime: "06:00", endTime: "15:00", breakDuration: 60 },
      ];

      if (snapshot.empty) {
        // Create all default shifts if none exist
        const createPromises = defaultShifts.map((shift) =>
          addDoc(shiftsRef, {
            shiftName: shift.name,
            startTime: shift.startTime,
            endTime: shift.endTime,
            breakDuration: shift.breakDuration,
            createdAt: serverTimestamp(),
            isDefault: true,
          })
        );
        await Promise.all(createPromises);
        console.log("Đã tạo các ca làm việc mặc định.");
      } else {
        // Update existing default shifts to match new configuration
        const existingShifts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const updatePromises = [];
        for (const defaultShift of defaultShifts) {
          const existingShift = existingShifts.find(
            (s) => s.shiftName === defaultShift.name
          );
          
          if (existingShift) {
            // Update breakDuration if it doesn't match
            if (existingShift.breakDuration !== defaultShift.breakDuration) {
              updatePromises.push(
                updateDoc(doc(db, `/artifacts/${canvasAppId}/public/data/shifts/${existingShift.id}`), {
                  breakDuration: defaultShift.breakDuration,
                })
              );
            }
          } else {
            // Create missing default shift
            updatePromises.push(
              addDoc(shiftsRef, {
                shiftName: defaultShift.name,
                startTime: defaultShift.startTime,
                endTime: defaultShift.endTime,
                breakDuration: defaultShift.breakDuration,
                createdAt: serverTimestamp(),
                isDefault: true,
              })
            );
          }
        }

        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
          console.log("Đã cập nhật các ca làm việc mặc định.");
        }
      }
    } catch (error) {
      console.error("Error initializing default shifts:", error);
    }
  }

  /**
   * Loads all shifts and renders them in the table
   */
  async function loadShifts() {
    const tableBody = mainContentContainer.querySelector("#shiftsTableBody");
    const assignShiftSelect = mainContentContainer.querySelector("#assignShiftName");
    if (!tableBody) return;

    try {
      const shiftsRef = collection(db, `/artifacts/${canvasAppId}/public/data/shifts`);
      const snapshot = await getDocs(shiftsRef);
      const shifts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Render shifts table
      if (shifts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-slate-500">Chưa có ca làm việc nào. Hãy tạo ca mới.</td></tr>`;
      } else {
        tableBody.innerHTML = await Promise.all(
          shifts.map(async (shift) => {
            // Count employees assigned to this shift
            const employeeShiftsQuery = query(
              collection(db, `/artifacts/${canvasAppId}/public/data/employeeShifts`),
              where("shiftId", "==", shift.id)
            );
            const employeeSnapshot = await getDocs(employeeShiftsQuery);
            const employeeCount = employeeSnapshot.size;

            // Calculate total hours
            const startTime = shift.startTime || "00:00";
            const endTime = shift.endTime || "00:00";
            const breakDuration = shift.breakDuration || 0;
            
            const [startHour, startMin] = startTime.split(":").map(Number);
            const [endHour, endMin] = endTime.split(":").map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            let totalMinutes = endMinutes - startMinutes;
            if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
            totalMinutes -= breakDuration;
            const totalHours = (totalMinutes / 60).toFixed(1);

            const breakDisplay = breakDuration > 0 ? `${breakDuration} phút` : "Không có";
            
            return `
              <tr class="hover:bg-gray-50">
                <td data-label="Tên ca" class="px-4 py-3 font-medium">${shift.shiftName || "N/A"}</td>
                <td data-label="Giờ bắt đầu" class="px-4 py-3">${startTime}</td>
                <td data-label="Giờ kết thúc" class="px-4 py-3">${endTime}</td>
                <td data-label="Thời gian nghỉ" class="px-4 py-3">${breakDisplay}</td>
                <td data-label="Tổng giờ" class="px-4 py-3 font-semibold">${totalHours} giờ</td>
                <td data-label="Số nhân viên" class="px-4 py-3">${employeeCount} người</td>
                <td data-label="Hành động" class="px-4 py-3 text-right">
                  <button class="delete-shift-btn btn-danger !text-xs !py-1 !px-2" data-shift-id="${shift.id}" data-shift-name="${shift.shiftName}">
                    <i class="fas fa-trash mr-1"></i>Xóa
                  </button>
                </td>
              </tr>
            `;
          })
        ).then(rows => rows.join(""));

        // Add event listeners for delete buttons
        tableBody.querySelectorAll(".delete-shift-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const shiftId = btn.dataset.shiftId;
            const shiftName = btn.dataset.shiftName;
            if (confirm(`Bạn có chắc chắn muốn xóa ca "${shiftName}"?`)) {
              handleDeleteShift(shiftId);
            }
          });
        });
      }

      // Populate assign shift dropdown
      if (assignShiftSelect) {
        assignShiftSelect.innerHTML = '<option value="">-- Chọn ca --</option>' + shifts
          .map((shift) => `<option value="${shift.id}" data-shift-name="${shift.shiftName}">${shift.shiftName}</option>`)
          .join("");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách ca làm việc:", error);
      if (error.code === "permission-denied" || error.message?.includes("permissions")) {
        console.warn("⚠️ Vui lòng cập nhật Firestore Security Rules để cho phép đọc shifts collection.");
        console.warn("   Xem hướng dẫn trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
      }
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-red-500">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
      }
    }
  }

  /**
   * Loads employees for shift assignment
   */
  async function loadEmployeesForShiftAssignment() {
    const employeeSelect = mainContentContainer.querySelector("#assignShiftEmployee");
    if (!employeeSelect) return;

    try {
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const snapshot = await getDocs(usersRef);
      const employees = snapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }))
        .filter((user) => {
          // Chỉ lấy Nhân viên không bị disabled
          if (user.role !== "Nhân viên" || user.status === "disabled" || user.disabled) {
            return false;
          }
          
          // Nếu là Manager, chỉ hiển thị Nhân viên trong các chi nhánh được quản lý
          if (currentUserProfile.role === "Manager") {
            const managedBranches = currentUserProfile.managedBranches || [];
            return user.branch && managedBranches.includes(user.branch);
          }
          
          // Admin thấy tất cả Nhân viên
          return true;
        });

      employeeSelect.innerHTML = '<option value="">-- Chọn nhân viên --</option>' + employees
        .sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""))
        .map((emp) => `<option value="${emp.uid}">${emp.displayName || emp.email}${emp.employeeId ? ` (${emp.employeeId})` : ""}${emp.branch ? ` - ${emp.branch.replace("ICOOL ", "")}` : ""}</option>`)
        .join("");
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  }

  /**
   * Creates a new shift
   */
  async function handleCreateShift() {
    const shiftNameInput = mainContentContainer.querySelector("#shiftName");
    const startTimeInput = mainContentContainer.querySelector("#shiftStartTime");
    const endTimeInput = mainContentContainer.querySelector("#shiftEndTime");
    const breakDurationInput = mainContentContainer.querySelector("#shiftBreakDuration");
    const messageEl = mainContentContainer.querySelector("#shiftMessage");
    const createBtn = mainContentContainer.querySelector("#createShiftBtn");

    const shiftName = shiftNameInput?.value.trim();
    const startTime = startTimeInput?.value;
    const endTime = endTimeInput?.value;
    const breakDuration = parseInt(breakDurationInput?.value || "0", 10);

    // Validation
    if (!shiftName || !startTime || !endTime) {
      messageEl.textContent = "Vui lòng điền đầy đủ thông tin (Tên ca, Giờ bắt đầu, Giờ kết thúc).";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    createBtn.disabled = true;
    createBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang tạo...`;

    try {
      // Check if shift name already exists
      const shiftsRef = collection(db, `/artifacts/${canvasAppId}/public/data/shifts`);
      const existingShifts = await getDocs(shiftsRef);
      const duplicate = existingShifts.docs.find(
        (doc) => doc.data().shiftName === shiftName
      );

      if (duplicate) {
        messageEl.textContent = `Ca "${shiftName}" đã tồn tại. Vui lòng chọn tên khác.`;
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
        messageEl.classList.remove("hidden");
        createBtn.disabled = false;
        createBtn.innerHTML = `<i class="fas fa-plus mr-2"></i>Tạo Ca`;
        return;
      }

      // Create shift
      await addDoc(shiftsRef, {
        shiftName: shiftName,
        startTime: startTime,
        endTime: endTime,
        breakDuration: breakDuration,
        createdAt: serverTimestamp(),
      });

      // Clear form
      shiftNameInput.value = "";
      startTimeInput.value = "";
      endTimeInput.value = "";
      breakDurationInput.value = "0";

      messageEl.textContent = "Tạo ca thành công!";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");

      // Reload shifts
      await loadShifts();

      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error creating shift:", error);
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
    } finally {
      createBtn.disabled = false;
      createBtn.innerHTML = `<i class="fas fa-plus mr-2"></i>Tạo Ca`;
    }
  }

  /**
   * Assigns a shift to an employee
   */
  async function handleAssignShift() {
    const employeeSelect = mainContentContainer.querySelector("#assignShiftEmployee");
    const shiftSelect = mainContentContainer.querySelector("#assignShiftName");
    const messageEl = mainContentContainer.querySelector("#assignShiftMessage");
    const assignBtn = mainContentContainer.querySelector("#assignShiftBtn");

    const employeeId = employeeSelect?.value;
    const shiftId = shiftSelect?.value;
    const shiftName = shiftSelect?.options[shiftSelect.selectedIndex]?.dataset.shiftName;

    if (!employeeId || !shiftId) {
      messageEl.textContent = "Vui lòng chọn nhân viên và ca làm việc.";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    assignBtn.disabled = true;
    assignBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang gán...`;

    try {
      // Get employee info
      const userDoc = await getDoc(doc(db, `/artifacts/${canvasAppId}/users/${employeeId}`));
      if (!userDoc.exists()) {
        throw new Error("Không tìm thấy nhân viên.");
      }
      const employeeName = userDoc.data().displayName || userDoc.data().email;

      // Check if employee already has this shift
      const existingAssignments = await getDocs(
        query(
          collection(db, `/artifacts/${canvasAppId}/public/data/employeeShifts`),
          where("employeeId", "==", employeeId),
          where("shiftId", "==", shiftId)
        )
      );

      if (!existingAssignments.empty) {
        messageEl.textContent = `Nhân viên "${employeeName}" đã được gán ca "${shiftName}" rồi.`;
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
        messageEl.classList.remove("hidden");
        assignBtn.disabled = false;
        assignBtn.innerHTML = `<i class="fas fa-check mr-2"></i>Gán Ca`;
        return;
      }

      // Assign shift
      await addDoc(collection(db, `/artifacts/${canvasAppId}/public/data/employeeShifts`), {
        employeeId: employeeId,
        employeeName: employeeName,
        shiftId: shiftId,
        shiftName: shiftName,
        assignedDate: serverTimestamp(),
        assignedBy: currentUser.uid,
        assignedByName: currentUserProfile.displayName,
      });

      // Also update user document for quick access
      await setDoc(
        doc(db, `/artifacts/${canvasAppId}/users/${employeeId}/shift/current`),
        {
          shiftId: shiftId,
          shiftName: shiftName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      messageEl.textContent = `Đã gán ca "${shiftName}" cho "${employeeName}" thành công!`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
      messageEl.classList.remove("hidden");

      // Clear selection
      employeeSelect.value = "";
      shiftSelect.value = "";

      // Reload shifts to update employee count
      await loadShifts();

      await logActivity("Assign Shift", {
        employeeId: employeeId,
        employeeName: employeeName,
        shiftId: shiftId,
        shiftName: shiftName,
      });

      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error assigning shift:", error);
      messageEl.textContent = `Lỗi: ${error.message}`;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
    } finally {
      assignBtn.disabled = false;
      assignBtn.innerHTML = `<i class="fas fa-check mr-2"></i>Gán Ca`;
    }
  }

  /**
   * Deletes a shift
   */
  async function handleDeleteShift(shiftId) {
    try {
      // Check if any employees are assigned to this shift
      const employeeShiftsQuery = query(
        collection(db, `/artifacts/${canvasAppId}/public/data/employeeShifts`),
        where("shiftId", "==", shiftId)
      );
      const employeeSnapshot = await getDocs(employeeShiftsQuery);

      if (!employeeSnapshot.empty) {
        alert("Không thể xóa ca này vì đã có nhân viên được gán. Vui lòng gỡ gán trước.");
        return;
      }

      // Delete shift
      await deleteDoc(doc(db, `/artifacts/${canvasAppId}/public/data/shifts/${shiftId}`));

      await logActivity("Delete Shift", { shiftId: shiftId });

      // Reload shifts
      await loadShifts();
    } catch (error) {
      console.error("Error deleting shift:", error);
      alert(`Lỗi khi xóa ca: ${error.message}`);
    }
  }

  /**
   * Loads employees for attendance report filter
   */
  async function loadEmployeesForAttendanceReport() {
    const employeeSelect = mainContentContainer.querySelector("#attendanceReportEmployee");
    if (!employeeSelect) return;

    try {
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const snapshot = await getDocs(usersRef);
      const employees = snapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }))
        .filter((user) => {
          // Chỉ lấy Nhân viên không bị disabled
          if (user.role !== "Nhân viên" || user.status === "disabled" || user.disabled) {
            return false;
          }
          
          // Manager chỉ thấy Nhân viên trong các chi nhánh được quản lý
          if (currentUserProfile.role === "Manager") {
            const managedBranches = currentUserProfile.managedBranches || [];
            return user.branch && managedBranches.includes(user.branch);
          }
          
          // Admin thấy tất cả Nhân viên
          return true;
        });

      employeeSelect.innerHTML = '<option value="">Tất cả nhân viên</option>' + employees
        .sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""))
        .map((emp) => `<option value="${emp.uid}">${emp.displayName || emp.email}${emp.employeeId ? ` (${emp.employeeId})` : ""}</option>`)
        .join("");
    } catch (error) {
      console.error("Error loading employees for report:", error);
    }
  }

  /**
   * Generates attendance report
   */
  async function generateAttendanceReport() {
    const monthInput = mainContentContainer.querySelector("#attendanceReportMonth");
    const employeeSelect = mainContentContainer.querySelector("#attendanceReportEmployee");
    const resultsDiv = mainContentContainer.querySelector("#attendanceReportResults");
    const tableBody = mainContentContainer.querySelector("#attendanceReportTableBody");
    const messageEl = mainContentContainer.querySelector("#attendanceReportMessage");
    const generateBtn = mainContentContainer.querySelector("#generateAttendanceReportBtn");

    if (!monthInput || !resultsDiv || !tableBody) return;

    const selectedMonth = monthInput.value;
    const selectedEmployeeId = employeeSelect?.value || "";

    if (!selectedMonth) {
      messageEl.textContent = "Vui lòng chọn tháng/năm.";
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang tạo báo cáo...`;
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4">Đang tải dữ liệu...</td></tr>`;

    // Determine if we should use Cloud Function (for large reports)
    // TẠM THỜI TẮT CLOUD FUNCTION - CHỈ DÙNG CLIENT-SIDE
    // Use Cloud Function if: all employees selected OR employee count > 50
    let useCloudFunction = false; // Tắt Cloud Function tạm thời do lỗi CORS/permissions
    
    // Code gốc (đã comment để tắt Cloud Function):
    // let useCloudFunction = !selectedEmployeeId;
    // if (!useCloudFunction) {
    //   // Check employee count to decide
    //   try {
    //     const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
    //     const usersSnapshot = await getDocs(usersRef);
    //     const employeeCount = usersSnapshot.docs.filter((doc) => {
    //       const userData = doc.data();
    //       return userData?.role === "Nhân viên" && userData?.status !== "disabled" && !userData?.disabled;
    //     }).length;
    //     
    //     useCloudFunction = employeeCount > 50;
    //   } catch (error) {
    //     console.warn("Could not determine employee count, using client-side processing");
    //     useCloudFunction = false;
    //   }
    // }

    // Use Cloud Function for large reports
    if (useCloudFunction && functions) {
      try {
        messageEl.textContent = "Đang tạo báo cáo trên server... (Có thể mất vài phút với báo cáo lớn)";
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-info";
        messageEl.classList.remove("hidden");

        const generateReport = httpsCallable(functions, "generateAttendanceReport");
        const result = await generateReport({
          month: selectedMonth,
          employeeId: selectedEmployeeId || "",
          appId: canvasAppId,
        });

        const { downloadUrl, fileName, stats } = result.data;

        // Update statistics display
        const totalHoursEl = mainContentContainer.querySelector("#reportTotalHours");
        const workingDaysEl = mainContentContainer.querySelector("#reportWorkingDays");
        const absentDaysEl = mainContentContainer.querySelector("#reportAbsentDays");
        const checkInsEl = mainContentContainer.querySelector("#reportCheckIns");

        if (totalHoursEl) totalHoursEl.textContent = stats.totalHours;
        if (workingDaysEl) workingDaysEl.textContent = stats.workingDays;
        if (absentDaysEl) absentDaysEl.textContent = stats.absentDays;
        if (checkInsEl) checkInsEl.textContent = stats.totalCheckIns;

        // Show download link
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center p-8">
              <div class="space-y-4">
                <div class="text-green-600 text-lg font-semibold">
                  <i class="fas fa-check-circle mr-2"></i>Báo cáo đã được tạo thành công!
                </div>
                <div class="text-slate-600">
                  <p class="mb-2">Báo cáo đã được tạo và lưu trên server.</p>
                  <p class="text-sm mb-4">Số nhân viên: ${stats.employeeCount} | Tháng: ${stats.month}</p>
                </div>
                <div>
                  <a href="${downloadUrl}" download="${fileName}" 
                     class="btn-primary inline-flex items-center px-6 py-3">
                    <i class="fas fa-download mr-2"></i>Tải xuống file Excel
                  </a>
                </div>
                <div class="text-xs text-slate-500 mt-4">
                  <i class="fas fa-info-circle mr-1"></i>
                  File sẽ được lưu tự động và có thể tải lại sau nếu cần.
                </div>
              </div>
            </td>
          </tr>
        `;

        resultsDiv.classList.remove("hidden");
        messageEl.classList.add("hidden");
      } catch (error) {
        console.error("Error calling Cloud Function:", error);
        messageEl.textContent = `Lỗi Cloud Function: ${error.message}. Đang chuyển sang xử lý trên trình duyệt...`;
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-warning";
        messageEl.classList.remove("hidden");
        
        // Fallback to client-side processing
        useCloudFunction = false;
        // Continue to client-side processing below
      }
    }

    // Client-side processing (original code)
    if (!useCloudFunction) {
      // Clear any previous error messages if we're using client-side
      if (messageEl && messageEl.textContent && messageEl.textContent.includes("Cloud Function")) {
        messageEl.textContent = "Đang xử lý báo cáo trên trình duyệt...";
        messageEl.className = "p-3 rounded-lg text-sm text-center alert-info";
      }

    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      // Get employees to process
      let employeeIds = [];
      if (selectedEmployeeId) {
        employeeIds = [selectedEmployeeId];
      } else {
        // Get all employees
        const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
        const usersSnapshot = await getDocs(usersRef);
        employeeIds = usersSnapshot.docs
          .map((doc) => doc.id)
          .filter((uid) => {
            const userData = usersSnapshot.docs.find((d) => d.id === uid)?.data();
            // Chỉ lấy Nhân viên không bị disabled
            if (userData?.role !== "Nhân viên" || userData?.status === "disabled" || userData?.disabled) {
              return false;
            }
            
            // Manager chỉ thấy Nhân viên trong các chi nhánh được quản lý
            if (currentUserProfile.role === "Manager") {
              const managedBranches = currentUserProfile.managedBranches || [];
              return userData?.branch && managedBranches.includes(userData.branch);
            }
            
            // Admin thấy tất cả Nhân viên
            return true;
          });
      }

      // Load attendance data for all employees
      const allAttendanceData = [];
      for (const employeeId of employeeIds) {
        try {
          const attendanceRef = collection(
            db,
            `/artifacts/${canvasAppId}/users/${employeeId}/attendance`
          );
          const attendanceSnapshot = await getDocs(attendanceRef);

          attendanceSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate();
            if (timestamp && timestamp >= startDate && timestamp <= endDate) {
              // Get employee shift info
              allAttendanceData.push({
                employeeId: employeeId,
                employeeName: data.employeeName || "N/A",
                action: data.action,
                timestamp: timestamp,
                photoUrl: data.photoUrl,
                location: data.location,
              });
            }
          });
        } catch (attendanceError) {
          console.warn(`Lỗi khi đọc attendance của nhân viên ${employeeId}:`, attendanceError);
          // Tiếp tục với nhân viên khác, không dừng toàn bộ quá trình
        }
      }

      // Get employee info
      const usersRef = collection(db, `/artifacts/${canvasAppId}/users`);
      const usersSnapshot = await getDocs(usersRef);
      const employeeMap = {};
      usersSnapshot.docs.forEach((doc) => {
        employeeMap[doc.id] = doc.data();
      });

      // Get shift assignments
      const shiftsRef = collection(db, `/artifacts/${canvasAppId}/public/data/shifts`);
      const shiftsSnapshot = await getDocs(shiftsRef);
      const shiftsMap = {};
      shiftsSnapshot.docs.forEach((doc) => {
        shiftsMap[doc.id] = doc.data();
      });

      // Get employee shifts
      const employeeShiftsRef = collection(db, `/artifacts/${canvasAppId}/public/data/employeeShifts`);
      const employeeShiftsSnapshot = await getDocs(employeeShiftsRef);
      const employeeShiftsMap = {};
      employeeShiftsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!employeeShiftsMap[data.employeeId]) {
          employeeShiftsMap[data.employeeId] = [];
        }
        employeeShiftsMap[data.employeeId].push({
          shiftId: data.shiftId,
          shiftName: data.shiftName,
        });
      });

      // Process and group by date and employee
      const reportData = {};
      allAttendanceData.forEach((record) => {
        const dateKey = record.timestamp.toISOString().split("T")[0];
        const employeeKey = record.employeeId;
        const key = `${dateKey}_${employeeKey}`;

        if (!reportData[key]) {
          reportData[key] = {
            date: dateKey,
            employeeId: employeeKey,
            employeeName: employeeMap[employeeKey]?.displayName || employeeMap[employeeKey]?.email || "N/A",
            checkIn: null,
            checkOut: null,
            shiftName: employeeShiftsMap[employeeKey]?.[0]?.shiftName || "Chưa gán ca",
          };
        }

        if (record.action === "Check-In") {
          reportData[key].checkIn = record.timestamp;
        } else if (record.action === "Check-Out") {
          reportData[key].checkOut = record.timestamp;
        }
      });

      // Convert to array and sort by date
      const reportArray = Object.values(reportData).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      // Calculate statistics
      let totalHours = 0;
      let workingDays = 0;
      let absentDays = 0;
      let totalCheckIns = 0;

      reportArray.forEach((day) => {
        if (day.checkIn) {
          workingDays++;
          totalCheckIns++;
          if (day.checkOut) {
            const hours = (day.checkOut - day.checkIn) / (1000 * 60 * 60);
            totalHours += hours;
          }
        }
      });

      // Calculate absent days (days in month without check-in)
      const daysInMonth = endDate.getDate();
      const uniqueEmployees = new Set(employeeIds);
      absentDays = daysInMonth * uniqueEmployees.size - workingDays;

      // Update statistics display
      const totalHoursEl = mainContentContainer.querySelector("#reportTotalHours");
      const workingDaysEl = mainContentContainer.querySelector("#reportWorkingDays");
      const absentDaysEl = mainContentContainer.querySelector("#reportAbsentDays");
      const checkInsEl = mainContentContainer.querySelector("#reportCheckIns");

      if (totalHoursEl) totalHoursEl.textContent = totalHours.toFixed(1);
      if (workingDaysEl) workingDaysEl.textContent = workingDays;
      if (absentDaysEl) absentDaysEl.textContent = absentDays;
      if (checkInsEl) checkInsEl.textContent = totalCheckIns;

      // Render table
      if (reportArray.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-slate-500">Không có dữ liệu chấm công trong tháng này.</td></tr>`;
      } else {
        tableBody.innerHTML = reportArray.map((day) => {
          const checkInTime = day.checkIn
            ? day.checkIn.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
            : "-";
          const checkOutTime = day.checkOut
            ? day.checkOut.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
            : "-";
          
          let hoursWorked = "-";
          let status = "Nghỉ";
          let statusClass = "text-red-600";

          if (day.checkIn && day.checkOut) {
            const hours = (day.checkOut - day.checkIn) / (1000 * 60 * 60);
            hoursWorked = hours.toFixed(1);
            status = "Hoàn thành";
            statusClass = "text-green-600";
          } else if (day.checkIn) {
            status = "Chưa check-out";
            statusClass = "text-yellow-600";
          }

          const dateStr = new Date(day.date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return `
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">${dateStr}</td>
              <td class="px-4 py-3">${day.employeeName}</td>
              <td class="px-4 py-3">${day.shiftName}</td>
              <td class="px-4 py-3">${checkInTime}</td>
              <td class="px-4 py-3">${checkOutTime}</td>
              <td class="px-4 py-3 font-medium">${hoursWorked}${hoursWorked !== "-" ? " giờ" : ""}</td>
              <td class="px-4 py-3">
                <span class="${statusClass} font-medium">${status}</span>
              </td>
            </tr>
          `;
        }).join("");
      }

      // Store report data for export
      window.currentAttendanceReportData = reportArray;
      window.currentAttendanceReportStats = {
        totalHours,
        workingDays,
        absentDays,
        totalCheckIns,
        month: selectedMonth,
      };

      resultsDiv.classList.remove("hidden");
      messageEl.classList.add("hidden");
    } catch (error) {
      console.error("Error generating report:", error);
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = `Lỗi: ${error.message || error.code || "Không xác định"}`;
      
      if (error.code === "permission-denied" || error.message?.includes("permission")) {
        console.error("❌ Lỗi quyền truy cập khi tải dữ liệu chấm công:", error);
        console.warn("⚠️ Vui lòng cập nhật Firestore Security Rules để cho phép đọc attendance subcollection.");
        console.warn("   Xem hướng dẫn trong file: FIRESTORE_RULES_FOR_USERNAME_LOGIN.md");
        errorMessage = "Lỗi quyền truy cập: Bạn không có quyền đọc dữ liệu chấm công. Vui lòng cập nhật Firestore Security Rules.";
      } else if (error.code === "unavailable" || error.message?.includes("unavailable")) {
        errorMessage = "Lỗi kết nối: Không thể kết nối đến database. Vui lòng thử lại sau.";
      } else if (error.message?.includes("network") || error.message?.includes("Network")) {
        errorMessage = "Lỗi mạng: Kiểm tra kết nối internet và thử lại.";
      }
      
      messageEl.textContent = errorMessage;
      messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
      messageEl.classList.remove("hidden");
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-red-500">${errorMessage}</td></tr>`;
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `<i class="fas fa-search mr-2"></i>Tạo Báo Cáo`;
    }
    }
  }

  /**
   * Exports attendance report to Excel
   */
  function handleExportAttendanceReport() {
    if (!window.currentAttendanceReportData || window.currentAttendanceReportData.length === 0) {
      alert("Không có dữ liệu để xuất. Vui lòng tạo báo cáo trước.");
      return;
    }

    const stats = window.currentAttendanceReportStats;
    const data = window.currentAttendanceReportData.map((day) => {
      const checkInTime = day.checkIn
        ? day.checkIn.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        : "";
      const checkOutTime = day.checkOut
        ? day.checkOut.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        : "";
      
      let hoursWorked = "";
      if (day.checkIn && day.checkOut) {
        const hours = (day.checkOut - day.checkIn) / (1000 * 60 * 60);
        hoursWorked = hours.toFixed(1);
      }

      return {
        "Ngày": new Date(day.date).toLocaleDateString("vi-VN"),
        "Nhân viên": day.employeeName,
        "Ca": day.shiftName,
        "Check-in": checkInTime,
        "Check-out": checkOutTime,
        "Số giờ": hoursWorked ? `${hoursWorked} giờ` : "",
        "Trạng thái": day.checkIn && day.checkOut ? "Hoàn thành" : day.checkIn ? "Chưa check-out" : "Nghỉ",
      };
    });

    // Add summary row
    data.push({}, {
      "Ngày": "TỔNG KẾT",
      "Nhân viên": "",
      "Ca": "",
      "Check-in": "",
      "Check-out": "",
      "Số giờ": `${stats.totalHours.toFixed(1)} giờ`,
      "Trạng thái": `Làm việc: ${stats.workingDays} ngày | Nghỉ: ${stats.absentDays} ngày`,
    });

    const fileName = `bang_cham_cong_${stats.month.replace("-", "_")}.xlsx`;
    exportToExcel(data, fileName);
  }

  // --- Global Modal Close Functions ---
  function closeIssueDetailModal() {
    issueDetailModal.style.display = "none";
    if (issueCommentsUnsubscribe) {
      issueCommentsUnsubscribe();
      issueCommentsUnsubscribe = null;
    }
  }

  function closeCameraModal() {
    stopCameraStream();
    if (timeInterval) clearInterval(timeInterval);
    cameraModal.style.display = "none";
  }

  /**
   * Compresses an image file before upload.
   * @param {File|Blob} imageFile - The image file to compress
   * @param {Object} options - Compression options (optional)
   * @returns {Promise<File|Blob>} - The compressed image file
   */
  async function compressImage(imageFile, options = {}) {
    try {
      // Default compression options
      const compressionOptions = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 1024, // Maximum width or height
        useWebWorker: true, // Use web worker for better performance
        quality: 0.8, // Image quality (0-1)
        fileType: "image/jpeg", // Output file type
        ...options, // Allow overriding defaults
      };

      // Check if browser-image-compression is available
      if (typeof imageCompression === "undefined") {
        console.warn("Image compression library not loaded, uploading original file");
        return imageFile;
      }

      // Compress the image
      const compressedFile = await imageCompression(imageFile, compressionOptions);
      
      console.log(
        `Image compressed: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
      );

      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
      // If compression fails, return original file
      console.warn("Falling back to original image file");
      return imageFile;
    }
  }

  /**
   * Helper function to export an array of data to an Excel file.
   * @param {Array<Object>} data The data to export.
   * @param {string} fileName The desired name for the output file.
   */
  function exportToExcel(data, fileName) {
    if (data.length === 0) {
      alert("Không có dữ liệu chấm công để xuất.");
      return;
    }
    // Tạo worksheet từ mảng JSON
    const ws = XLSX.utils.json_to_sheet(data);
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    // Gắn worksheet vào workbook với tên là 'Chấm Công'
    XLSX.utils.book_append_sheet(wb, ws, "Chấm Công");
    // Xuất file
    XLSX.writeFile(wb, fileName);
  }

  /**
   * Exports issue history data to Excel file.
   * Uses the filtered data (issueHistoryFiltered) to export only what's currently displayed.
   */
  function handleExportIssueHistory() {
    if (!issueHistoryFiltered || issueHistoryFiltered.length === 0) {
      alert("Không có dữ liệu sự cố để xuất. Vui lòng kiểm tra lại bộ lọc.");
      return;
    }

    // Format location detail helper
    const formatLocationDetail = (report) => {
      if (report.issueScope === "all_rooms") {
        return "Tất cả phòng";
      } else if (report.specificRooms) {
        const firstRoom = report.specificRooms.split(", ")[0];
        const locationInfo = roomToLocationMap[firstRoom];
        const floorName = locationInfo ? locationInfo.floor : "N/A";
        return `Tầng: ${floorName}, Phòng: ${report.specificRooms}`;
      }
      return "N/A";
    };

    // Format date helper
    const formatDate = (dateValue) => {
      if (!dateValue) return "N/A";
      try {
        const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
        return date.toLocaleString("vi-VN");
      } catch (e) {
        return "N/A";
      }
    };

    // Convert issue reports to Excel format
    const excelData = issueHistoryFiltered.map((report) => {
      return {
        "Chi nhánh": report.issueBranch || "N/A",
        "Vị trí cụ thể": formatLocationDetail(report),
        "Người gửi": report.reporterName || "N/A",
        "Loại sự cố": report.issueType || "N/A",
        "Mức độ ưu tiên": report.priority || "N/A",
        "Ngày báo cáo": formatDate(report.reportDate),
        "Trạng thái": report.status || "N/A",
        "Người được giao": report.assigneeName || "Chưa giao",
        "Người giải quyết": report.resolverName || "Chưa giải quyết",
        "Ngày giải quyết": report.resolvedDate ? formatDate(report.resolvedDate) : "Chưa giải quyết",
        "Mô tả": report.issueDescription || "Không có mô tả",
      };
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch Sử Sự Cố");

    // Generate filename with selected month/year or current date
    let fileName;
    if (issueHistorySelectedMonth) {
      // Format: lich_su_su_co_2027_10.xlsx
      const formattedMonth = issueHistorySelectedMonth.replace("-", "_");
      fileName = `lich_su_su_co_${formattedMonth}.xlsx`;
    } else {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
      fileName = `lich_su_su_co_${dateStr}.xlsx`;
    }

    // Export file
    XLSX.writeFile(wb, fileName);
  }

  /**
   * Handles the logic for exporting attendance for a single employee.
   * @param {string} uid The UID of the user.
   * @param {string} name The display name of the user.
   * @param {HTMLElement} button The button element that was clicked.
   */
  async function handleExportSingleUserAttendance(uid, name, button) {
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    button.disabled = true;

    try {
      const userProfile = allUsersCache.find((u) => u.uid === uid);
      const employeeId = userProfile ? userProfile.employeeId : "N/A";

      const attendanceQuery = query(
        collection(db, `/artifacts/${canvasAppId}/users/${uid}/attendance`),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(attendanceQuery);

      const attendanceRecords = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          "Tên Nhân Viên": name,
          MSNV: employeeId,
          "Hành Động": data.action,
          "Thời Gian": data.timestamp
            ? new Date(data.timestamp.toDate()).toLocaleString("vi-VN")
            : "Không có",
          "Địa Chỉ":
            data.location && data.location.address
              ? data.location.address
              : "Không có",
        };
      });

      const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      exportToExcel(attendanceRecords, `cham_cong_${safeName}.xlsx`);
    } catch (error) {
      console.error(`Error exporting attendance for ${name}:`, error);
      alert(`Đã xảy ra lỗi khi xuất file chấm công cho ${name}.`);
    } finally {
      button.innerHTML = originalContent;
      button.disabled = false;
    }
  }

  /**
   * Handles the logic for exporting attendance data for all employees.
   */
  async function handleExportAllAttendance() {
    const button = document.getElementById("exportAllAttendanceBtn");
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...`;
    button.disabled = true;

    try {
      // Lọc những tài khoản không bị vô hiệu hóa
      const activeUsers = allUsersCache.filter(
        (user) => user.status !== "disabled"
      );
      let allAttendanceRecords = [];

      // Dùng Promise.all để tăng tốc độ lấy dữ liệu
      const promises = activeUsers.map(async (user) => {
        const attendanceQuery = query(
          collection(
            db,
            `/artifacts/${canvasAppId}/users/${user.uid}/attendance`
          ),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(attendanceQuery);

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          allAttendanceRecords.push({
            "Tên Nhân Viên": user.displayName,
            MSNV: user.employeeId,
            "Hành Động": data.action,
            "Thời Gian": data.timestamp
              ? new Date(data.timestamp.toDate()).toLocaleString("vi-VN")
              : "Không có",
            "Địa Chỉ":
              data.location && data.location.address
                ? data.location.address
                : "Không có",
          });
        });
      });

      await Promise.all(promises);

      // Sắp xếp lại toàn bộ dữ liệu theo Tên Nhân Viên rồi đến Thời Gian
      allAttendanceRecords.sort((a, b) => {
        if (a["Tên Nhân Viên"] < b["Tên Nhân Viên"]) return -1;
        if (a["Tên Nhân Viên"] > b["Tên Nhân Viên"]) return 1;
        // Nếu cùng tên, sắp xếp theo thời gian mới nhất lên đầu
        return new Date(b["Thời Gian"]) - new Date(a["Thời Gian"]);
      });

      exportToExcel(allAttendanceRecords, "cham_cong_toan_bo_nhan_vien.xlsx");
    } catch (error) {
      console.error("Error exporting all attendance:", error);
      alert("Đã xảy ra lỗi khi xuất file chấm công toàn bộ.");
    } finally {
      button.innerHTML = originalContent;
      button.disabled = false;
    }
  }

  /**
   * Handles the logic for exporting all accounts to Excel.
   */
  async function handleExportAllAccounts() {
    const button = document.getElementById("exportAllAccountsBtn");
    if (!button) return;
    
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...`;
    button.disabled = true;

    try {
      // Load all accounts from database (not just paginated ones)
      const allUsersQuery = query(
        collection(db, `/artifacts/${canvasAppId}/users`),
        orderBy("displayName")
      );
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUsers = allUsersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      if (allUsers.length === 0) {
        alert("Không có tài khoản nào để xuất.");
        return;
      }

      // Format accounts data for Excel
      const excelData = allUsers.map((user) => {
        const isDisabled = user.status === "disabled" || user.disabled;
        return {
          "MSNV": user.employeeId || "N/A",
          "Tên Người Dùng": user.displayName || "N/A",
          "Email": user.email || "N/A",
          "Vai Trò": user.role || "N/A",
          "Chi Nhánh": user.branch || "N/A",
          "Trạng Thái": isDisabled ? "Đã vô hiệu hóa" : "Hoạt động",
        };
      });

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh Sách Tài Khoản");

      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
      const fileName = `danh_sach_tai_khoan_${dateStr}.xlsx`;

      // Export file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting all accounts:", error);
      alert("Đã xảy ra lỗi khi xuất file danh sách tài khoản: " + error.message);
    } finally {
      button.innerHTML = originalContent;
      button.disabled = false;
    }
  }

  // --- DOM Binding & Event Listeners ---
  function bindShellDOMElements() {
    skeletonLoader = document.getElementById("skeletonLoader");
    authSection = document.getElementById("authSection");
    appContainer = document.getElementById("appContainer");
    mainContentContainer = document.querySelector("#mainContent main");
    viewsContainer = document.getElementById("viewsContainer");
    sidebarNav = document.getElementById("sidebarNav");
    sidebarOverlay = document.getElementById("sidebarOverlay");
    authEmailInput = document.getElementById("authEmail");
    authPasswordInput = document.getElementById("authPassword");
    loginBtn = document.getElementById("loginBtn");
    authMessage = document.getElementById("authMessage");
    loggedInUserDisplay = document.getElementById("loggedInUserDisplay");
    dropdownUserName = document.getElementById("dropdownUserName");
    dropdownUserRole = document.getElementById("dropdownUserRole");
    notificationToggle = document.getElementById("notificationToggle");
    notificationBadge = document.getElementById("notificationBadge");
    notificationMenu = document.getElementById("notificationMenu");
    notificationList = document.getElementById("notificationList");
    editAccountModal = document.getElementById("editAccountModal");
    issueDetailModal = document.getElementById("issueDetailModal");
    deleteAccountModal = document.getElementById("deleteAccountModal");
    cameraModal = document.getElementById("cameraModal");
    resetPasswordModal = document.getElementById("resetPasswordModal");
    forceChangePasswordModal = document.getElementById(
      "forceChangePasswordModal"
    );
    drillDownModal = document.getElementById("drillDownModal");
    confirmCancelModal = document.getElementById("confirmCancelModal");
    myProfileModal = document.getElementById("myProfileModal");
    if (!myProfileModal) {
      console.error("myProfileModal not found!");
    }
    sidebar = document.getElementById("sidebar");
    mobileMenuToggle = document.getElementById("mobileMenuToggle");
    onlineStatusIndicator = document.getElementById("onlineStatusIndicator");
    onlineStatusIcon = document.getElementById("onlineStatusIcon");
    onlineStatusText = document.getElementById("onlineStatusText");
  }

  function bindShellEventListeners() {
    loginBtn.addEventListener("click", handleLogin);
    authEmailInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        handleLogin();
      }
    });
    authPasswordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        handleLogin();
      }
    });
    const logoutBtn = document.getElementById("logoutDropdownBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
    }
    
    const myProfileBtn = document.getElementById("myProfileDropdownBtn");
    if (myProfileBtn) {
      myProfileBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropdownMenu = document.getElementById("userDropdownMenu");
        if (dropdownMenu) {
          dropdownMenu.classList.remove("show");
        }
        openMyProfileModal();
      });
    } else {
      console.error("myProfileDropdownBtn not found!");
    }
    document
      .getElementById("userDropdownToggle")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("userDropdownMenu").classList.toggle("show");
      });
    notificationToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      notificationMenu.classList.toggle("show");
    });
    
    // Mark all notifications as read button
    const markAllReadBtn = document.getElementById("markAllReadBtn");
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await markAllNotificationsAsRead();
      });
    }

    mobileMenuToggle.addEventListener("click", () => toggleMobileMenu(false));
    sidebarOverlay.addEventListener("click", () => toggleMobileMenu(true));

    document.addEventListener("click", (e) => {
      if (
        !notificationToggle.contains(e.target) &&
        !notificationMenu.contains(e.target)
      ) {
        notificationMenu.classList.remove("show");
      }
      if (
        !document.getElementById("userDropdownToggle").contains(e.target) &&
        !document.getElementById("userDropdownMenu").contains(e.target)
      ) {
        document.getElementById("userDropdownMenu").classList.remove("show");
      }
    });

    // Account Modal Listeners
    editAccountModal
      .querySelector("#saveAccountDetailsBtn")
      .addEventListener("click", handleUpdateAccountDetails);
    const closeEditAccountModal = () => (editAccountModal.style.display = "none");
    editAccountModal
      .querySelector("#cancelEditAccountBtn")
      .addEventListener("click", closeEditAccountModal);
    editAccountModal
      .querySelector("#closeEditAccountModalBtn")
      .addEventListener("click", closeEditAccountModal);

    // Issue Detail Modal Listeners
    issueDetailModal
      .querySelector("#closeIssueDetailModalBtn")
      .addEventListener("click", closeIssueDetailModal);
    issueDetailModal
      .querySelector("#updateIssueBtn")
      .addEventListener("click", handleUpdateIssueDetails);
    issueDetailModal
      .querySelector("#addCommentBtn")
      .addEventListener("click", handleAddComment);

    const statusSelect = issueDetailModal.querySelector("#detailIssueStatus");
    const repairedImageUploadContainer = issueDetailModal.querySelector(
      "#repairedImageUploadContainer"
    );
    statusSelect.addEventListener("change", () => {
      if (statusSelect.value === "Đã giải quyết") {
        repairedImageUploadContainer.classList.remove("hidden");
      } else {
        repairedImageUploadContainer.classList.add("hidden");
      }
    });

    // Delete Account Modal Listeners
    deleteAccountModal
      .querySelector("#confirmDisableProfileOnlyBtn")
      .addEventListener("click", () => {
        const uid = deleteAccountModal.querySelector("#deleteAccountUid").value;
        handleDisableAccount(uid, false);
      });
    deleteAccountModal
      .querySelector("#confirmDisableAndAnonymizeBtn")
      .addEventListener("click", () => {
        const uid = deleteAccountModal.querySelector("#deleteAccountUid").value;
        handleDisableAccount(uid, true);
      });
    const closeDeleteAccountModal = () =>
      (deleteAccountModal.style.display = "none");
    deleteAccountModal
      .querySelector("#closeDeleteModalBtn")
      .addEventListener("click", closeDeleteAccountModal);

    // Confirm Cancel Modal Listeners
    if (confirmCancelModal) {
      confirmCancelModal
        .querySelector("#confirmCancelBtn")
        .addEventListener("click", handleConfirmCancelIssue);
      confirmCancelModal
        .querySelector("#cancelConfirmCancelBtn")
        .addEventListener("click", () => {
          confirmCancelModal.style.display = "none";
        });
      confirmCancelModal
        .querySelector("#closeConfirmCancelModalBtn")
        .addEventListener("click", () => {
          confirmCancelModal.style.display = "none";
        });
    }

    // My Profile Modal Listeners
    if (myProfileModal) {
      myProfileModal
        .querySelector("#closeMyProfileModalBtn")
        .addEventListener("click", closeMyProfileModal);
      // Close modal when clicking outside
      myProfileModal.addEventListener("click", (e) => {
        if (e.target === myProfileModal) {
          closeMyProfileModal();
        }
      });
    }

    // Camera Modal Listeners
    cameraModal
      .querySelector("#closeCameraModalBtn")
      .addEventListener("click", closeCameraModal);
    cameraModal
      .querySelector("#captureBtn")
      .addEventListener("click", capturePhoto);
    cameraModal
      .querySelector("#recaptureBtn")
      .addEventListener("click", startCameraStream);
    cameraModal
      .querySelector("#confirmAttendanceBtn")
      .addEventListener("click", confirmAttendance);

    // Password Reset Listeners
    document
      .getElementById("forgotPasswordBtn")
      .addEventListener(
        "click",
        () => (resetPasswordModal.style.display = "flex")
      );
    const closeResetModal = () => (resetPasswordModal.style.display = "none");
    resetPasswordModal
      .querySelector("#closeResetPasswordModalBtn")
      .addEventListener("click", closeResetModal);
    resetPasswordModal
      .querySelector("#cancelResetBtn")
      .addEventListener("click", closeResetModal);
    resetPasswordModal
      .querySelector("#sendResetEmailBtn")
      .addEventListener("click", handleSendResetEmail);

    // Force Change Password Listener
    forceChangePasswordModal
      .querySelector("#confirmChangePasswordBtn")
      .addEventListener("click", handleForcePasswordChange);

    const closeDrillDownModal = () => (drillDownModal.style.display = "none");
    drillDownModal
      .querySelector("#closeDrillDownModalBtn")
      .addEventListener("click", closeDrillDownModal);
    drillDownModal
      .querySelector("#cancelDrillDownBtn")
      .addEventListener("click", closeDrillDownModal);
  }

  async function handleSendResetEmail() {
    const emailInput = resetPasswordModal.querySelector("#resetEmail");
    const messageEl = resetPasswordModal.querySelector("#resetPasswordMessage");
    const email = emailInput.value.trim();

    if (!email) {
      messageEl.textContent = "Vui lòng nhập email của bạn.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      messageEl.textContent =
        "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.";
      messageEl.className = "p-3 rounded-lg text-sm alert-success";
      messageEl.classList.remove("hidden");
      emailInput.value = "";
    } catch (error) {
      console.error("Password Reset Error:", error);
      messageEl.textContent =
        "Lỗi: Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
    }
  }

  function promptForcePasswordChange() {
    // Hàm này bây giờ chỉ cần HIỆN modal lên.
    // Mọi thứ khác đã được setupUIForLoggedInUser và handleAuthStateChange lo.
    forceChangePasswordModal.style.display = "flex";
  }

  async function handleForcePasswordChange() {
    const currentPassword = forceChangePasswordModal.querySelector(
      "#forceCurrentPassword"
    ).value;
    const newPassword =
      forceChangePasswordModal.querySelector("#newPassword").value;
    const confirmPassword = forceChangePasswordModal.querySelector(
      "#confirmNewPassword"
    ).value;
    const messageEl = forceChangePasswordModal.querySelector(
      "#changePasswordMessage"
    );
    const confirmBtn = forceChangePasswordModal.querySelector(
      "#confirmChangePasswordBtn"
    );

    // Validation
    if (!currentPassword) {
      messageEl.textContent = "Vui lòng nhập mật khẩu hiện tại.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    if (newPassword.length < 6) {
      messageEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    if (newPassword !== confirmPassword) {
      messageEl.textContent = "Mật khẩu xác nhận không khớp.";
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang đổi mật khẩu...`;

    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);
      const userDocRef = doc(
        db,
        `/artifacts/${canvasAppId}/users/${currentUser.uid}`
      );
      await updateDoc(userDocRef, { requiresPasswordChange: false });

      messageEl.textContent = "Đổi mật khẩu thành công! Đang tải ứng dụng...";
      messageEl.className = "p-3 rounded-lg text-sm alert-success";
      messageEl.classList.remove("hidden");

      setTimeout(() => {
        currentUserProfile.requiresPasswordChange = false; // Update local state
        forceChangePasswordModal.style.display = "none";
        // Clear password fields
        forceChangePasswordModal.querySelector("#forceCurrentPassword").value = "";
        forceChangePasswordModal.querySelector("#newPassword").value = "";
        forceChangePasswordModal.querySelector("#confirmNewPassword").value = "";
        setupUIForLoggedInUser();
        listenToNotifications();
        showInitialView();
        if (currentUserProfile.role === "Admin") {
          startEscalationChecker();
        }
      }, 2000);
    } catch (error) {
      console.error("Force Password Change Error:", error);
      let errorMessage = "Lỗi khi đổi mật khẩu.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu hiện tại không đúng.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại, sau đó thử đổi mật khẩu.";
      } else {
        errorMessage = `Lỗi: ${error.message}`;
      }

      messageEl.textContent = errorMessage;
      messageEl.className = "p-3 rounded-lg text-sm alert-error";
      messageEl.classList.remove("hidden");
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = "Thay Đổi Mật Khẩu";
    }
  }

  function showDrillDownModal(
    filterKey,
    filterValue,
    title,
    statusFilter = null
  ) {
    const modal = document.getElementById("drillDownModal");
    const titleEl = modal.querySelector("#drillDownTitle");
    const contentEl = modal.querySelector("#drillDownContent");

    titleEl.textContent = title;

    let filteredReports = dashboardReportsCache.filter(
      (report) => report[filterKey] === filterValue
    );

    if (statusFilter === "resolved") {
      filteredReports = filteredReports.filter(
        (report) => report.status === "Đã giải quyết"
      );
    } else if (statusFilter === "unresolved") {
      filteredReports = filteredReports.filter(
        (report) => report.status !== "Đã giải quyết"
      );
    }

    if (filteredReports.length === 0) {
      contentEl.innerHTML = `<p class="text-center text-slate-500 p-8">Không có dữ liệu chi tiết để hiển thị.</p>`;
    } else {
      contentEl.innerHTML = `
              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-slate-200 responsive-table">
                      <thead class="bg-slate-50">
                          <tr>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Chi Nhánh</th>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Người Gửi</th>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Mô Tả</th>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ngày Báo Cáo</th>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Trạng Thái</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-slate-200">
                          ${filteredReports
                            .map(
                              (report) => `
                              <tr class="hover:bg-gray-50">
                                  <td data-label="Chi Nhánh" class="px-4 py-3">${
                                    report.issueBranch
                                  }</td>
                                  <td data-label="Người Gửi" class="px-4 py-3">${
                                    report.reporterName
                                  }</td>
                                  <td data-label="Mô Tả" class="px-4 py-3 text-sm truncate" style="max-width: 200px;" title="${
                                    report.issueDescription
                                  }">${report.issueDescription}</td>
                                  <td data-label="Ngày Báo Cáo" class="px-4 py-3">${new Date(
                                    report.reportDate
                                  ).toLocaleString("vi-VN")}</td>
                                  <td data-label="Trạng Thái" class="px-4 py-3">${
                                    report.status
                                  }</td>
                              </tr>
                          `
                            )
                            .join("")}
                      </tbody>
                  </table>
              </div>
          `;
    }

    modal.style.display = "flex";
  }

  // --- Utility Functions ---
  function unsubscribeAll() {
    unsubscribeListeners.forEach((unsub) => unsub());
    unsubscribeListeners = [];
    if (issueCommentsUnsubscribe) {
      issueCommentsUnsubscribe();
      issueCommentsUnsubscribe = null;
    }
  }

  let locationAnalysisChart = null;
  let roomToLocationMap = {};

  // --- HÀM ĐIỀU KHIỂN CHÍNH ---
  function renderLocationAnalysis(reports) {
    const filterSelect = mainContentContainer.querySelector(
      "#locationBranchFilter"
    );
    if (!filterSelect) return;

    if (!filterSelect.hasAttribute("data-listener-attached")) {
      filterSelect.innerHTML =
        `<option value="all">Tất cả Chi nhánh</option>` +
        ALL_BRANCHES.map((b) => `<option value="${b}">${b}</option>`).join("");
      filterSelect.addEventListener("change", () => updateLocationView(reports));
      filterSelect.setAttribute("data-listener-attached", "true");
    }
    updateLocationView(reports);
  }

  function updateLocationView(reports) {
    buildRoomToLocationMap();
    const selectedBranch = mainContentContainer.querySelector(
      "#locationBranchFilter"
    ).value;
    const dashboardContent = mainContentContainer.querySelector(
      "#locationDashboardContent"
    );
    const title = mainContentContainer.querySelector("#locationAnalysisTitle");

    if (selectedBranch === "all") {
      title.textContent = "Tổng quan lỗi toàn hệ thống";
      dashboardContent.innerHTML = `
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                      <h4 class="font-semibold text-center mb-2">Tổng lỗi theo Chi nhánh</h4>
                      <div class="h-[32rem] p-2 border rounded-lg"><canvas id="overviewBranchChart"></canvas></div>
                  </div>
                  <div>
                      <h4 class="font-semibold mb-2">Top 5 Tầng có nhiều lỗi nhất</h4>
                      <div id="overviewTopFloorsTableContainer"></div>
                  </div>
              </div>`;
      renderSystemOverview(reports);
    } else {
      title.textContent = `Chi tiết lỗi tại: ${selectedBranch}`;
      dashboardContent.innerHTML = `
              <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div class="lg:col-span-2">
                      <h4 class="font-semibold text-center mb-2">Phân tích theo Tầng</h4>
                      <div class="h-[32rem]"><canvas id="locationAnalysisChart"></canvas></div>
                  </div>
                  <div class="lg:col-span-3">
                      <h4 class="font-semibold mb-2">Bảng chi tiết theo Phòng</h4>
                      <input type="text" id="locationAnalysisSearch" class="input-field mb-3" placeholder="Tìm kiếm phòng...">
                      <div id="locationAnalysisTableContainer" class="max-h-[30rem] overflow-y-auto border rounded-lg"></div>
                  </div>
              </div>`;
      renderBranchDetailView(reports, selectedBranch);
    }
  }

  // --- CÁC HÀM CHO CHẾ ĐỘ TỔNG QUAN HỆ THỐNG (V3) ---
  function renderSystemOverview(reports) {
    // 1. Tổng hợp lỗi theo Chi nhánh
    const branchCounts = reports.reduce((acc, report) => {
      if (report.issueBranch) {
        acc[report.issueBranch] = (acc[report.issueBranch] || 0) + 1;
      }
      return acc;
    }, {});
    renderOverviewBranchChart(branchCounts);

    // 2. Tổng hợp lỗi theo Tầng để lấy Top 5
    const floorErrorCounts = {};
    reports.forEach((report) => {
      if (!report.issueBranch) return;
      const keyPrefix = report.issueBranch;
      if (report.issueScope === "all_rooms") {
        const key = `${keyPrefix}---Lỗi Toàn Chi nhánh`;
        floorErrorCounts[key] = (floorErrorCounts[key] || 0) + 1;
      } else if (report.specificRooms) {
        const affectedFloors = new Set();
        report.specificRooms.split(", ").forEach((room) => {
          if (roomToLocationMap[room])
            affectedFloors.add(roomToLocationMap[room].floor);
        });
        affectedFloors.forEach((floor) => {
          const key = `${keyPrefix}---${floor}`;
          floorErrorCounts[key] = (floorErrorCounts[key] || 0) + 1;
        });
      }
    });
    const aggregatedData = Object.entries(floorErrorCounts)
      .map(([key, count]) => {
        const [branch, floor] = key.split("---");
        return { branch, floor, count };
      })
      .sort((a, b) => b.count - a.count);

    renderOverviewTopFloorsTable(aggregatedData.slice(0, 5));
  }

  function renderOverviewBranchChart(branchCounts) {
    const canvas = mainContentContainer.querySelector("#overviewBranchChart");
    if (!canvas) return;
    if (locationAnalysisChart) locationAnalysisChart.destroy();

    const sortedBranches = Object.entries(branchCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const labels = sortedBranches.map((item) => item[0].replace("ICOOL ", ""));
    const data = sortedBranches.map((item) => item[1]);

    locationAnalysisChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Số Lỗi", data, backgroundColor: "#4f46e5" }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });
  }

  function renderOverviewTopFloorsTable(top5Data) {
    const tableContainer = mainContentContainer.querySelector(
      "#overviewTopFloorsTableContainer"
    );
    if (!tableContainer) return;

    let tableHTML = createTableHead(["Chi Nhánh", "Tầng", "Số Lỗi"]);
    if (top5Data.length === 0) {
      tableHTML += `<tr><td colspan="3" class="text-center p-4 text-slate-500">Không có dữ liệu.</td></tr>`;
    } else {
      top5Data.forEach((item) => {
        tableHTML += `<tr class="hover:bg-slate-50">
                  <td class="px-4 py-3 font-medium text-sm">${item.branch}</td>
                  <td class="px-4 py-3 text-sm">${item.floor}</td>
                  <td class="px-4 py-3 text-right font-bold text-base">${item.count}</td>
              </tr>`;
      });
    }
    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
  }

  // --- Các hàm cho chế độ CHI TIẾT CHI NHÁNH ---
  function renderBranchDetailView(reports, branchName) {
    const branchReports = reports.filter((r) => r.issueBranch === branchName);

    // Phân tích theo Tầng
    const branchTemplate = BRANCH_DATA[branchName] || BRANCH_DATA.default;
    const floorCounts = Object.keys(branchTemplate).reduce(
      (acc, floor) => ({ ...acc, [floor]: 0 }),
      {}
    );
    floorCounts["Lỗi Toàn Chi nhánh"] = 0;

    branchReports.forEach((report) => {
      if (report.issueScope === "all_rooms") {
        floorCounts["Lỗi Toàn Chi nhánh"]++;
      } else if (report.specificRooms) {
        const floorsAffected = new Set();
        report.specificRooms.split(", ").forEach((room) => {
          if (roomToLocationMap[room])
            floorsAffected.add(roomToLocationMap[room].floor);
        });
        floorsAffected.forEach((floor) => {
          if (floorCounts.hasOwnProperty(floor)) floorCounts[floor]++;
        });
      }
    });
    renderDoughnutChart(Object.keys(floorCounts), Object.values(floorCounts));

    // Phân tích theo Phòng
    const roomCounts = {};
    branchReports
      .filter((r) => r.specificRooms)
      .forEach((report) => {
        report.specificRooms.split(", ").forEach((room) => {
          roomCounts[room] = (roomCounts[room] || 0) + 1;
        });
      });
    const sortedRooms = Object.entries(roomCounts).sort((a, b) => b[1] - a[1]);

    let tableHTML = createTableHead(["Phòng", "Số Lỗi"]);
    sortedRooms.forEach(([room, count]) => {
      tableHTML += `<tr><td class="px-4 py-3 font-medium text-sm">${room}</td><td class="px-4 py-3 text-right font-bold text-base">${count}</td></tr>`;
    });
    finalizeTable(tableHTML, sortedRooms.length);
    addSearchFunctionality();
  }

  // --- CÁC HÀM HELPER CHUNG ---
  function buildRoomToLocationMap() {
    roomToLocationMap = {};
    for (const branchName in BRANCH_DATA) {
      const floors = BRANCH_DATA[branchName];
      for (const floorName in floors) {
        floors[floorName].forEach((roomName) => {
          roomToLocationMap[roomName] = { floor: floorName, branch: branchName };
        });
      }
    }
  }

  function renderBarChart(labels, data, color) {
    const canvas = mainContentContainer.querySelector("#locationAnalysisChart");
    if (!canvas) return;
    if (locationAnalysisChart) locationAnalysisChart.destroy();
    locationAnalysisChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Số Lỗi", data, backgroundColor: color }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });
  }

  function renderDoughnutChart(labels, data) {
    const canvas = mainContentContainer.querySelector("#locationAnalysisChart");
    if (!canvas) return;
    if (locationAnalysisChart) locationAnalysisChart.destroy();

    const totalErrors = data.reduce((sum, current) => sum + current, 0);
    const colorPalette = [
      "#4f46e5",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#3b82f6",
    ];

    locationAnalysisChart = new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số Lỗi",
            data: data,
            backgroundColor: colorPalette,
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { position: "bottom" },
          title: { display: false },
          // Plugin để vẽ tổng số lỗi ở giữa
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed !== null) {
                  label += context.parsed;
                }
                return label;
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "doughnutLabel",
          beforeDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.restore();
            const fontSize = (height / 150).toFixed(2);
            ctx.font = `bold ${fontSize}em Inter, sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const text = `${totalErrors}`;
            const text2 = "Lỗi";

            const textX = Math.round(width / 2);
            const textY = Math.round(height / 2) - fontSize * 8;

            ctx.fillStyle = "#1e2d3b"; // slate-800
            ctx.fillText(text, textX, textY);

            const fontSize2 = (height / 250).toFixed(2);
            ctx.font = `${fontSize2}em Inter, sans-serif`;
            ctx.fillText(text2, textX, textY + fontSize * 18);
            ctx.save();
          },
        },
      ],
    });
  }

  function createTableHead(headers) {
    let headHTML =
      '<table class="min-w-full"><thead class="bg-slate-50 sticky top-0"><tr>';
    headers.forEach((header, index) => {
      const align = index === headers.length - 1 ? "text-right" : "text-left";
      headHTML += `<th class="px-4 py-2 ${align} text-xs font-semibold text-slate-500 uppercase">${header}</th>`;
    });
    headHTML += '</tr></thead><tbody class="divide-y divide-slate-200">';
    return headHTML;
  }

  function finalizeTable(tableHTML, dataLength) {
    const tableContainer = mainContentContainer.querySelector(
      "#locationAnalysisTableContainer"
    );
    if (dataLength === 0) {
      tableHTML += `<tr><td colspan="3" class="text-center p-4 text-slate-500">Không có dữ liệu.</td></tr>`;
    }
    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
  }

  function addSearchFunctionality() {
    const searchInput = mainContentContainer.querySelector(
      "#locationAnalysisSearch"
    );
    if (searchInput) {
      searchInput.addEventListener("keyup", () => {
        const searchTerm = searchInput.value.toLowerCase();
        mainContentContainer
          .querySelectorAll("#locationAnalysisTableContainer tbody tr")
          .forEach((row) => {
            searchInput.addEventListener("keyup", () => {
              // Chuyển cả hai về chữ thường để so sánh
              const searchTerm = searchInput.value.toLowerCase();
              mainContentContainer
                .querySelectorAll("#locationAnalysisTableContainer tbody tr")
                .forEach((row) => {
                  // Chuyển nội dung của hàng về chữ thường
                  const rowText = row.textContent.toLowerCase();
                  row.style.display = rowText.includes(searchTerm) ? "" : "none";
                });
            });
          });
      });
    }
  }
