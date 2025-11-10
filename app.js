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
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
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
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

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
const canvasAppId = "default-app-id";
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
];

// New data structure: Branch -> Floor -> Room array
// IMPORTANT: Branch name must EXACTLY MATCH the name in the ALL_BRANCHES array.
const BRANCH_DATA = {
  "ICOOL XÔ VIẾT NGHỆ TĨNH": {
    Trệt: ["P.101", "P.102"],
    "Tầng 1": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207", "P.208", "P.209", "P.210", "P.211"],
    "Tầng 2": ["P.300", "P.301", "P.302", "P.303", "P.304", "P.305", "P.306", "P.307", "P.308", "P.309", "P.310", "P.311", "P.312"],
    "Tầng 3": ["P.401"],
    "Tầng 4": ["P.501", "P.502"],
  },
  "ICOOL BÌNH PHÚ": {
    Trệt: ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107", "P.108", "P.109", "P.110"],
    "Lầu 1": ["P.201", "P.202", "P.203", "P.204", "P.205"],
  },
  "ICOOL UNG VĂN KHIÊM": {
    Trệt: ["P.001", "P.002","P.101", "P.102", "P.103", "P.104"],
    "Tầng 1": ["P.101", "P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107", "P.108", "P.109", "P.110"],
    "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207"],
    "Tầng 3": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306", "P.307"],
    "Tầng 4": ["P.401", "P.402", "P.403", "P.404", "P.405", "P.406", "P.407", "P.408", "P.409"],
    "Tầng 5": ["P.501"],
  },
  "ICOOL TÔ KÝ": {
    Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006"],
    "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107", "P.108", "P.109"],
    "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207", "P.208", "P.209"],
    "Tầng 3": ["P.301", "P.302"],
    "Tầng 4": ["P.401", "P.402"],
  },
  "ICOOL DƯƠNG BÁ TRẠC": {
    Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006"],
    "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107", "P.108"],
    "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207"],
    "Tầng 3": ["P.301"],
    "Tầng 4": ["P.401", "P.402"],
    "Tầng 5": ["P.501", "P.502"],
  },
  "ICOOL TRẦN NÃO": {
    Trệt: ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107", "P.108"],
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
    Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006", "P.007", "P.008"],
    "Tầng 1": ["P.101", "P.102", "P.104", "P.105", "P.106", "P.107"],
    "Tầng 2": ["P.201", "P.202"],
    "Tầng 3": ["P.301", "P.302"],
    "Tầng 4": ["P.401", "P.402"],
    "Tầng 5": ["P.501", "P.502"],
  },
  "ICOOL NGUYỄN SƠN": {
    Trệt: ["P.001", "P.002"],
    "Tầng 1": ["P.101", "P.102", "P.103", "P.104", "P.105", "P.106", "P.107"],
    "Tầng 2": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207", "P.208", "P.209"],
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
    "Tầng 1": ["P.201", "P.202", "P.203", "P.204", "P.205", "P.206", "P.207", "P.208"],
    "Tầng 2": ["P.301", "P.302", "P.303", "P.304", "P.305", "P.306", "P.307", "P.308"],
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
    Trệt: ["P.001", "P.002", "P.003", "P.004", "P.005", "P.006", "P.007", "P.008", "P.009", "P.010","P.011", "P.012", "P.014", "P.015", "P.016", "P.017", "P.018", "P.019", "P.020", "P.021","P.022", "P.023",  "P.026","VIP1", "VIP2"],
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
};
const ROLES = ["Admin", "Manager", "Nhân viên"];
const DEFAULT_VIEWS = {
  Admin: Object.keys(ALL_VIEWS),
  Manager: [
    "dashboardView",
    "attendanceView",
    "issueReportView",
    "issueHistoryView",
    "myTasksView",
    "activityLogView",
  ],
  "Nhân viên": [
    "dashboardView",
    "attendanceView",
    "issueReportView",
    "issueHistoryView",
    "myTasksView",
  ],
};
const ISSUE_STATUSES = ["Mới tạo", "Đang xử lý", "Đã giải quyết"];
const ISSUE_TYPES = ["Kỹ thuật", "Vận hành", "Hệ thống", "Con người", "Khác"];

// --- Global State Variables ---
let app, auth, db, storage;
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
let allUsersCache = [];
let escalationInterval = null;
let dashboardReportsCache = [];
let activityLogsCache = [];
let issueHistoryCache = [];
let myTasksCache = [];
let activityLogCurrentPage = 1;
let accountsCurrentPage = 1;
let issueHistoryCurrentPage = 1;
let myTasksCurrentPage = 1;
const ITEMS_PER_PAGE = 10;

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
  drillDownModal;
let sidebar, mobileMenuToggle;

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

    onAuthStateChanged(auth, handleAuthStateChange);

    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    }
  } catch (error) {
    console.error("Firebase Init Error:", error);
    // Now skeletonLoader and authSection are defined, so this won't throw a TypeError
    skeletonLoader.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
});

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
    console.log("Escalation feature is disabled. Checker will not run.");
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
      where("status", "==", "Mới tạo"),
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
        promptForcePasswordChange();
      } else {
        setupUIForLoggedInUser();
        listenToNotifications();
        showInitialView();
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
}

async function handleLogin() {
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;
  if (!email || !password) {
    authMessage.textContent = "Vui lòng nhập email và mật khẩu.";
    authMessage.className = "p-3 rounded-lg text-sm text-center alert-error";
    authMessage.classList.remove("hidden");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    authMessage.classList.add("hidden");
  } catch (error) {
    authMessage.textContent = `Lỗi đăng nhập: ${
      error.code === "auth/invalid-credential"
        ? "Email hoặc mật khẩu không đúng."
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
  forceChangePasswordModal.style.display = "none";
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
  currentUserProfile.allowedViews.forEach((viewId) => {
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
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    renderNotifications(notifications);
  });
  unsubscribeListeners.push(unsubscribe);
}

function renderNotifications(notifications) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  notificationBadge.textContent = unreadCount;
  notificationBadge.classList.toggle("show", unreadCount > 0);
  notificationList.innerHTML =
    notifications.length === 0
      ? `<div class="p-4 text-center text-sm text-slate-500">Không có thông báo mới.</div>`
      : notifications
          .map((n) => {
            const timestamp = n.timestamp
              ? new Date(n.timestamp.toDate()).toLocaleString("vi-VN")
              : "Vừa xong";
            return `<div class="notification-item p-3 cursor-pointer hover:bg-slate-50 ${
              n.read ? "" : "unread"
            }"><p class="text-sm">${
              n.message
            }</p><p class="text-xs text-slate-400 mt-1">${timestamp}</p></div>`;
          })
          .join("");
}

async function sendNotification(userId, message) {
  if (!userId) return;
  try {
    const notificationsCol = collection(
      db,
      `/artifacts/${canvasAppId}/users/${userId}/notifications`
    );
    await addDoc(notificationsCol, {
      message: message,
      read: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
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
    console.warn(
      `Could not write to activity log (permissions issue?): ${error.message}`
    );
  }
}

// --- Data Queries ---
function getScopedIssuesQuery() {
  let q = collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`);
  if (currentUserProfile.role === "Manager") {
    const managedBranches = currentUserProfile.managedBranches || [];
    if (managedBranches.length > 0) {
      q = query(q, where("issueBranch", "in", managedBranches));
    } else {
      return query(q, where("issueBranch", "==", "__NO_BRANCH_ASSIGNED__")); // Effectively returns no results
    }
  } else if (currentUserProfile.role === "Nhân viên") {
    q = query(q, where("reporterId", "==", currentUser.uid));
  }
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

window.setup_manageAccountsView = function () {
  if (!currentUserProfile) return;
  accountsCurrentPage = 1; // Reset page
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
    renderAccountsTable(allUsersCache); // Re-render from cache when toggling
  });

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

  const q = query(collection(db, `/artifacts/${canvasAppId}/users`));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      allUsersCache = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      renderAccountsTable(allUsersCache); // This is the main render call with fresh data
    },
    (error) => {
      console.error("Error listening for account changes:", error);
      const tableBody =
        mainContentContainer.querySelector("#accountsTableBody");
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Lỗi tải danh sách người dùng.</td></tr>`;
      }
    }
  );

  unsubscribeListeners.push(unsubscribe);
};

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
    .addEventListener("click", () =>
      applyFiltersAndRender(dashboardReportsCache)
    );
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
    (error) => console.error("Dashboard listener failed:", error)
  );

  unsubscribeListeners.push(unsubscribe);
};

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

  // --- Thiết lập ban đầu ---
  reporterNameInput.value = currentUserProfile.displayName;
  branchSelect.innerHTML = ALL_BRANCHES.map(
    (b) => `<option value="${b}">${b}</option>`
  ).join("");
  reportBtn.addEventListener("click", handleReportIssue);

  // --- Logic ẩn/hiện mục chọn Tầng và Phòng ---
  const updateScopeVisibility = () => {
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

  // --- Đóng dropdown khi click ra ngoài ---
  document.addEventListener("click", function (event) {
    if (
      roomsTrigger &&
      !roomsTrigger.contains(event.target) &&
      !roomsOptions.contains(event.target)
    ) {
      roomsOptions.classList.remove("show");
    }
  });
};

window.setup_issueHistoryView = function () {
  if (!currentUserProfile) return;
  issueHistoryCurrentPage = 1; // Reset page
  const tableBody = mainContentContainer.querySelector(
    "#issueHistoryTableBody"
  );
  if (!tableBody) return;
  tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4">Đang tải...</td></tr>`;

  const q = getScopedIssuesQuery();
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      issueHistoryCache = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      issueHistoryCache.sort(
        (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
      );

      // Thêm dòng này để đảm bảo map được tạo
      buildRoomToLocationMap();

      renderIssueHistoryTable(issueHistoryCache);
    },
    (error) => console.error("Issue history listener failed:", error)
  );
  unsubscribeListeners.push(unsubscribe);
};

window.setup_myTasksView = function () {
  if (!currentUser || !currentUserProfile) return;
  myTasksCurrentPage = 1; // Reset page
  const tableBody = mainContentContainer.querySelector("#myTasksTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4">Đang tải...</td></tr>`;

  const q = query(
    collection(db, `/artifacts/${canvasAppId}/public/data/issueReports`),
    where("assigneeId", "==", currentUser.uid)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      myTasksCache = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      myTasksCache.sort(
        (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
      );
      renderMyTasksTable(myTasksCache);
    },
    (error) => console.error("My Tasks listener failed:", error)
  );
  unsubscribeListeners.push(unsubscribe);
};

window.setup_activityLogView = function () {
  if (!currentUserProfile) return;
  const tableBody = mainContentContainer.querySelector("#activityLogTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4">Đang tải...</td></tr>`;

  activityLogCurrentPage = 1; // Reset page

  // No limit, get all logs for client-side pagination
  const q = query(
    collection(db, `/artifacts/${canvasAppId}/public/data/activityLogs`),
    orderBy("timestamp", "desc")
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      activityLogsCache = snapshot.docs.map((doc) => doc.data()); // Update cache
      renderActivityLogTable(activityLogsCache); // Render from cache
    },
    (error) => console.error("Activity log listener failed:", error)
  );
  unsubscribeListeners.push(unsubscribe);
};

// --- Table Rendering ---
function renderActivityLogTable(logs) {
  const tableBody = mainContentContainer.querySelector("#activityLogTableBody");
  if (!tableBody) return;

  const startIndex = (activityLogCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIndex, endIndex);

  tableBody.innerHTML =
    paginatedLogs.length > 0
      ? paginatedLogs
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

  renderActivityLogPagination(logs.length);
}

function renderActivityLogPagination(totalLogs) {
  const paginationContainer = mainContentContainer.querySelector(
    "#activityLogPagination"
  );
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const startItem = (activityLogCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(activityLogCurrentPage * ITEMS_PER_PAGE, totalLogs);

  let paginationHTML = `
        <div class="text-sm text-slate-600">
            Hiển thị <strong>${startItem}</strong> - <strong>${endItem}</strong> trên <strong>${totalLogs}</strong> kết quả
        </div>
        <div class="flex items-center space-x-2">
            <button id="prevLogPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50 disabled:cursor-not-allowed" ${
              activityLogCurrentPage === 1 ? "disabled" : ""
            }>
                <i class="fas fa-chevron-left"></i>
            </button>
            <span class="text-sm font-medium">Trang ${activityLogCurrentPage} / ${totalPages}</span>
            <button id="nextLogPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50 disabled:cursor-not-allowed" ${
              activityLogCurrentPage === totalPages ? "disabled" : ""
            }>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners
  const prevBtn = mainContentContainer.querySelector("#prevLogPage");
  const nextBtn = mainContentContainer.querySelector("#nextLogPage");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (activityLogCurrentPage > 1) {
        activityLogCurrentPage--;
        renderActivityLogTable(activityLogsCache); // Re-render from cache
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (activityLogCurrentPage < totalPages) {
        activityLogCurrentPage++;
        renderActivityLogTable(activityLogsCache); // Re-render from cache
      }
    });
  }
}

function renderIssueHistoryTable(reports) {
  const tableBody = mainContentContainer.querySelector(
    "#issueHistoryTableBody"
  );
  if (!tableBody) return;

  const startIndex = (issueHistoryCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, endIndex);

  tableBody.innerHTML =
    paginatedReports.length > 0
      ? paginatedReports
          .map((report) => {
            // Logic mới để tạo chi tiết vị trí
            let locationDetail = "";
            if (report.issueScope === "all_rooms") {
              locationDetail = `<span class="italic text-slate-500">Toàn bộ chi nhánh</span>`;
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
                        ${
                          currentUserProfile.role === "Admin" ||
                          currentUserProfile.role === "Manager"
                            ? `<button class="detail-issue-btn btn-secondary !text-sm !py-1 !px-2" data-id="${report.id}">Chi tiết</button>`
                            : ""
                        }
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

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const startItem = (issueHistoryCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    issueHistoryCurrentPage * ITEMS_PER_PAGE,
    totalItems
  );

  paginationContainer.innerHTML = `
        <div class="text-sm text-slate-600">Hiển thị <strong>${startItem}</strong> - <strong>${endItem}</strong> trên <strong>${totalItems}</strong> kết quả</div>
        <div class="flex items-center space-x-2">
            <button id="prevIssueHistoryPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              issueHistoryCurrentPage === 1 ? "disabled" : ""
            }><i class="fas fa-chevron-left"></i></button>
            <span class="text-sm font-medium">Trang ${issueHistoryCurrentPage} / ${totalPages}</span>
            <button id="nextIssueHistoryPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              issueHistoryCurrentPage === totalPages ? "disabled" : ""
            }><i class="fas fa-chevron-right"></i></button>
        </div>`;

  mainContentContainer
    .querySelector("#prevIssueHistoryPage")
    .addEventListener("click", () => {
      if (issueHistoryCurrentPage > 1) {
        issueHistoryCurrentPage--;
        renderIssueHistoryTable(issueHistoryCache);
      }
    });
  mainContentContainer
    .querySelector("#nextIssueHistoryPage")
    .addEventListener("click", () => {
      if (issueHistoryCurrentPage < totalPages) {
        issueHistoryCurrentPage++;
        renderIssueHistoryTable(issueHistoryCache);
      }
    });
}

function renderMyTasksTable(reports) {
  const tableBody = mainContentContainer.querySelector("#myTasksTableBody");
  if (!tableBody) return;

  const startIndex = (myTasksCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, endIndex);

  tableBody.innerHTML =
    paginatedReports.length > 0
      ? paginatedReports
          .map(
            (report) => `
        <tr class="hover:bg-gray-50">
            <td data-label="Chi nhánh" class="px-4 py-3">${
              report.issueBranch
            }</td>
            <td data-label="Loại sự cố" class="px-4 py-3">${
              report.issueType
            }</td>
            <td data-label="Ngày báo cáo" class="px-4 py-3">${new Date(
              report.reportDate
            ).toLocaleString("vi-VN")}</td>
            <td data-label="Trạng thái" class="px-4 py-3">${report.status}</td>
            <td data-label="Hành động" class="px-4 py-3 text-right">
                <button class="detail-issue-btn btn-secondary !text-sm !py-1 !px-2" data-id="${
                  report.id
                }">Chi tiết</button>
            </td>
        </tr>
    `
          )
          .join("")
      : `<tr><td colspan="5" class="text-center p-4">Bạn không có nhiệm vụ nào được giao.</td></tr>`;

  tableBody.querySelectorAll(".detail-issue-btn").forEach((btn) => {
    btn.addEventListener("click", () => openIssueDetailModal(btn.dataset.id));
  });
  renderMyTasksPagination(reports.length);
}

function renderMyTasksPagination(totalItems) {
  const paginationContainer =
    mainContentContainer.querySelector("#myTasksPagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const startItem = (myTasksCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(myTasksCurrentPage * ITEMS_PER_PAGE, totalItems);

  paginationContainer.innerHTML = `
        <div class="text-sm text-slate-600">Hiển thị <strong>${startItem}</strong> - <strong>${endItem}</strong> trên <strong>${totalItems}</strong> kết quả</div>
        <div class="flex items-center space-x-2">
            <button id="prevMyTasksPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              myTasksCurrentPage === 1 ? "disabled" : ""
            }><i class="fas fa-chevron-left"></i></button>
            <span class="text-sm font-medium">Trang ${myTasksCurrentPage} / ${totalPages}</span>
            <button id="nextMyTasksPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              myTasksCurrentPage === totalPages ? "disabled" : ""
            }><i class="fas fa-chevron-right"></i></button>
        </div>`;

  mainContentContainer
    .querySelector("#prevMyTasksPage")
    .addEventListener("click", () => {
      if (myTasksCurrentPage > 1) {
        myTasksCurrentPage--;
        renderMyTasksTable(myTasksCache);
      }
    });
  mainContentContainer
    .querySelector("#nextMyTasksPage")
    .addEventListener("click", () => {
      if (myTasksCurrentPage < totalPages) {
        myTasksCurrentPage++;
        renderMyTasksTable(myTasksCache);
      }
    });
}

function renderAccountsTable(users) {
  const tableBody = mainContentContainer.querySelector("#accountsTableBody");
  if (!tableBody) return;

  const filteredUsers = showDisabledAccounts
    ? users
    : users.filter((user) => user.status !== "disabled");

  const startIndex = (accountsCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  tableBody.innerHTML =
    paginatedUsers
      .map((user) => {
        const isDisabled = user.status === "disabled";
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
                <td data-label="Hành động" class="px-4 py-3 text-right">
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
      .join("") ||
    `<tr><td colspan="5" class="text-center p-4">Không có tài khoản nào.</td></tr>`;

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

  renderAccountsPagination(filteredUsers.length);
}

function renderAccountsPagination(totalItems) {
  const paginationContainer = mainContentContainer.querySelector(
    "#accountsPagination"
  );
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const startItem = (accountsCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(accountsCurrentPage * ITEMS_PER_PAGE, totalItems);

  paginationContainer.innerHTML = `
        <div class="text-sm text-slate-600">Hiển thị <strong>${startItem}</strong> - <strong>${endItem}</strong> trên <strong>${totalItems}</strong> kết quả</div>
        <div class="flex items-center space-x-2">
            <button id="prevAccountPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              accountsCurrentPage === 1 ? "disabled" : ""
            }><i class="fas fa-chevron-left"></i></button>
            <span class="text-sm font-medium">Trang ${accountsCurrentPage} / ${totalPages}</span>
            <button id="nextAccountPage" class="btn-secondary !py-1 !px-3 disabled:opacity-50" ${
              accountsCurrentPage === totalPages ? "disabled" : ""
            }><i class="fas fa-chevron-right"></i></button>
        </div>`;

  mainContentContainer
    .querySelector("#prevAccountPage")
    .addEventListener("click", () => {
      if (accountsCurrentPage > 1) {
        accountsCurrentPage--;
        renderAccountsTable(allUsersCache);
      }
    });
  mainContentContainer
    .querySelector("#nextAccountPage")
    .addEventListener("click", () => {
      if (accountsCurrentPage < totalPages) {
        accountsCurrentPage++;
        renderAccountsTable(allUsersCache);
      }
    });
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

function applyFiltersAndRender(allReports) {
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
    updateDashboardWarnings(allReports);
    return;
  }

  const filteredReports = allReports.filter((report) => {
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

  // We use the global `dashboardReportsCache` so warnings are not affected by filters
  updateDashboardWarnings(dashboardReportsCache);

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
    "Mới tạo": "bg-blue-500",
    "Đang xử lý": "bg-yellow-500",
    "Đã giải quyết": "bg-green-500",
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
          ? "Toàn bộ chi nhánh"
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

  renderTopEmployeesChart(chartLabels, chartData);
}

function renderTopEmployeesChart(labels, data) {
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
  const resolvedData = sortedByTotal.map((s) => s.resolved);
  const unresolvedData = sortedByTotal.map((s) => s.total - s.resolved);
  renderBranchStatusChart(statusLabels, resolvedData, unresolvedData);

  const sortedByTime = [...statsArray]
    .filter((s) => s.resolvedForTimeCalc > 0)
    .sort(
      (a, b) =>
        b.totalProcessingHours / b.resolvedForTimeCalc -
        a.totalProcessingHours / a.resolvedForTimeCalc
    )
    .slice(0, 10);
  const timeLabels = sortedByTime.map((s) => s.name.replace("ICOOL ", ""));
  const timeData = sortedByTime.map((s) =>
    parseFloat((s.totalProcessingHours / s.resolvedForTimeCalc).toFixed(2))
  );
  renderBranchTimeChart(timeLabels, timeData);
}

function renderBranchStatusChart(labels, resolvedData, unresolvedData) {
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
    },
  });
}

function renderBranchTimeChart(labels, data) {
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
  modal.querySelector("#detailIssueLocation").textContent = "Đang tải vị trí...";
  modal.querySelector("#detailIssueLocation").title = "";
  modal.querySelector("#detailIssueDescription").textContent = "Đang tải...";
  modal.querySelector("#detailIssueImageContainer").innerHTML = "";
  modal.querySelector("#detailRepairedImageContainer").innerHTML = "";
  modal.querySelector("#detailIssueComments").innerHTML = "";

  const docRef = doc(
    db,
    `/artifacts/${canvasAppId}/public/data/issueReports`,
    issueId
  );
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    modal.querySelector("#detailIssueDescription").textContent = "Không tìm thấy sự cố.";
    return;
  }
  const report = docSnap.data();

  modal.querySelector("#detailIssueId").value = issueId;

  // ▼▼▼ THAY ĐỔI LOGIC HIỂN THỊ VỊ TRÍ ▼▼▼
  const locationEl = modal.querySelector("#detailIssueLocation");
  // Thêm "Vị trí: " vào đầu chuỗi
  let locationString = `Vị trí: ${report.issueBranch.replace("ICOOL ", "") || "Không xác định"}`;

  if (report.issueScope === "all_rooms") {
    locationString += " / Toàn bộ chi nhánh";
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
  modal.querySelector("#detailIssueDescription").textContent = report.issueDescription;

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

  const canManage =
    currentUserProfile.role === "Admin" ||
    currentUserProfile.role === "Manager";

  const statusSelect = modal.querySelector("#detailIssueStatus");
  statusSelect.innerHTML = ISSUE_STATUSES.map(
    (s) =>
      `<option value="${s}" ${
        report.status === s ? "selected" : ""
      }>${s}</option>`
  ).join("");
  statusSelect.disabled = !canManage;

  const repairedImageUploadContainer = modal.querySelector(
    "#repairedImageUploadContainer"
  );
  const toggleRepairedImageInput = () => {
    repairedImageUploadContainer.classList.toggle(
      "hidden",
      statusSelect.value !== "Đã giải quyết"
    );
  };

  toggleRepairedImageInput();
  statusSelect.addEventListener("change", toggleRepairedImageInput);

  const assigneeSelect = modal.querySelector("#detailIssueAssignee");
  assigneeSelect.disabled = true;
  if (canManage) {
    const usersSnapshot = await getDocs(
      collection(db, `/artifacts/${canvasAppId}/users`)
    );
    const users = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
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
    assigneeSelect.disabled = false;
  } else {
    assigneeSelect.innerHTML = `<option value="">${
      report.assigneeName || "Chưa giao"
    }</option>`;
  }

  modal.querySelector("#updateIssueBtn").classList.toggle("hidden", !canManage);

  listenToIssueComments(issueId);
}

async function handleUpdateIssueDetails() {
  const modal = document.getElementById("issueDetailModal");
  const issueId = modal.querySelector("#detailIssueId").value;
  const newStatus = modal.querySelector("#detailIssueStatus").value;
  const newAssigneeId = modal.querySelector("#detailIssueAssignee").value;
  const assigneeSelect = modal.querySelector("#detailIssueAssignee");
  const newAssigneeName = newAssigneeId
    ? assigneeSelect.options[assigneeSelect.selectedIndex].text
    : "";
  const repairedImageFile = modal.querySelector("#repairedImageInput").files[0];

  const messageEl = modal.querySelector("#detailIssueMessage");
  const saveBtn = modal.querySelector("#updateIssueBtn");

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
      assigneeId: newAssigneeId || null,
      assigneeName: newAssigneeName || null,
    };

    if (newAssigneeId && originalData.assigneeId !== newAssigneeId) {
      updateData.assignerId = currentUser.uid;
      updateData.assignerName = currentUserProfile.displayName;
      updateData.assignedDate = new Date().toISOString();
    }

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
      const storageRef = ref(
        storage,
        `repaired_images/${issueId}/${Date.now()}-${repairedImageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, repairedImageFile);
      updateData.repairedImageUrl = await getDownloadURL(snapshot.ref);
    }

    await updateDoc(docRef, updateData);

    logActivity("Update Issue", { issueId, newStatus, newAssigneeName });

    if (newAssigneeId && originalData.assigneeId !== newAssigneeId) {
      sendNotification(
        newAssigneeId,
        `Bạn được giao một nhiệm vụ mới: ${originalData.issueType} tại ${originalData.issueBranch}`
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

  issueCommentsUnsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      commentsContainer.innerHTML = `<p class="text-sm text-slate-500 italic">Chưa có bình luận nào.</p>`;
      return;
    }
    commentsContainer.innerHTML = snapshot.docs
      .map((doc) => {
        const comment = doc.data();
        const timestamp = comment.timestamp
          ? new Date(comment.timestamp.toDate()).toLocaleString("vi-VN")
          : "";
        return `
                <div class="text-sm">
                    <p><strong>${comment.authorName}:</strong> ${comment.text}</p>
                    <p class="text-xs text-slate-400">${timestamp}</p>
                </div>
            `;
      })
      .join("");
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  });
}

async function handleAddComment() {
  const modal = document.getElementById("issueDetailModal");
  const issueId = modal.querySelector("#detailIssueId").value;
  const commentInput = modal.querySelector("#newCommentInput");
  const commentText = commentInput.value.trim();

  if (!issueId || !commentText) return;

  try {
    const commentsCol = collection(
      db,
      `/artifacts/${canvasAppId}/public/data/issueReports/${issueId}/comments`
    );
    await addDoc(commentsCol, {
      text: commentText,
      authorId: currentUser.uid,
      authorName: currentUserProfile.displayName,
      timestamp: serverTimestamp(),
    });
    commentInput.value = "";
    logActivity("Add Comment", { issueId, commentText });
  } catch (error) {
    console.error("Error adding comment:", error);
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

  const handleRoleChange = () => {
    const role = roleSelect.value;
    document
      .getElementById("managedBranchesContainer")
      .classList.toggle("hidden", role !== "Manager");
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

  const updatedData = {
    role: editAccountModal.querySelector("#editAccountRole").value,
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

  saveBtn.disabled = true;
  saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...`;

  try {
    const userDocRef = doc(db, `/artifacts/${canvasAppId}/users/${uid}`);
    await updateDoc(userDocRef, updatedData);
    await logActivity("Update User Profile", { targetUid: uid });

    messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
    messageEl.textContent = "Cập nhật thành công!";
    messageEl.classList.remove("hidden");

    // No need to call render manually, the listener will do it.
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

async function handleCreateAccount() {
  const email = mainContentContainer.querySelector("#createAccountEmail").value;
  const password = mainContentContainer.querySelector(
    "#createAccountPassword"
  ).value;
  const displayName = mainContentContainer.querySelector(
    "#createAccountUsername"
  ).value;
  const employeeId = mainContentContainer.querySelector(
    "#createAccountEmployeeId"
  ).value;
  const messageEl = mainContentContainer.querySelector("#createAccountMessage");

  if (!email || password.length < 6 || !displayName || !employeeId) {
    messageEl.textContent = "Vui lòng điền đầy đủ thông tin hợp lệ.";
    messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
    messageEl.classList.remove("hidden");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUid = userCredential.user.uid;

    const newUserProfile = {
      email: email,
      displayName: displayName,
      employeeId: employeeId,
      role: "Nhân viên",
      allowedViews: DEFAULT_VIEWS["Nhân viên"],
      managedBranches: [],
      requiresPasswordChange: true,
    };

    await setDoc(
      doc(db, `/artifacts/${canvasAppId}/users/${newUid}`),
      newUserProfile
    );

    await logActivity("Admin Create User", { newEmail: email, newUid: newUid });

    messageEl.textContent = `Tạo tài khoản ${email} thành công!`;
    messageEl.className = "p-3 rounded-lg text-sm text-center alert-success";
    messageEl.classList.remove("hidden");
    // No need to call render manually, the listener will do it.
  } catch (error) {
    messageEl.textContent = `Lỗi tạo tài khoản: ${error.message}`;
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
      const { email, password, displayName, employeeId, role } = row;

      if (!email || !displayName || !employeeId) {
        errorCount++;
        errors.push(
          `Dòng ${
            createCount + updateCount + errorCount
          }: Thiếu thông tin email, tên hoặc mã nhân viên.`
        );
        continue;
      }

      const existingUser = allUsersCache.find((u) => u.email === email);
      const userRole = ROLES.includes(role) ? role : "Nhân viên";

      if (existingUser) {
        // Update existing user
        try {
          const userDocRef = doc(
            db,
            `/artifacts/${canvasAppId}/users/${existingUser.uid}`
          );
          const profileUpdate = {
            displayName,
            employeeId,
            role: userRole,
            allowedViews: DEFAULT_VIEWS[userRole],
          };
          await updateDoc(userDocRef, profileUpdate);
          await logActivity("Admin Bulk Update User", { updatedEmail: email });
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
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const newUid = userCredential.user.uid;

          const newUserProfile = {
            email: email,
            displayName: displayName,
            employeeId: employeeId,
            role: userRole,
            allowedViews: DEFAULT_VIEWS[userRole],
            managedBranches: [],
            requiresPasswordChange: true,
          };

          await setDoc(
            doc(db, `/artifacts/${canvasAppId}/users/${newUid}`),
            newUserProfile
          );
          await logActivity("Admin Bulk Create User", { newEmail: email });
          createCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Tạo mới ${email}: ${error.message}`);
        }
      }
    }

    messageEl.innerHTML = `Hoàn tất: <br> - ${createCount} tài khoản đã tạo. <br> - ${updateCount} tài khoản đã cập nhật. <br> - ${errorCount} lỗi.`;
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
  };
  reader.readAsArrayBuffer(file);
}

function handleDownloadTemplate() {
  const templateData = [
    {
      email: "nhanvien.a@example.com",
      password: "password123",
      displayName: "Nguyễn Văn A",
      employeeId: "NV001",
      role: "Nhân viên",
    },
    {
      email: "quanly.b@example.com",
      password: "password456",
      displayName: "Trần Thị B",
      employeeId: "QL001",
      role: "Manager",
    },
    {
      email: "admin.c@example.com",
      password: "password789",
      displayName: "Lê Văn C",
      employeeId: "AD001",
      role: "Admin",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachTaiKhoan");

  // Trigger the download
  XLSX.writeFile(workbook, "mau-tai-khoan.xlsx");
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
  const issueScope = mainContentContainer.querySelector(
    'input[name="issueScope"]:checked'
  ).value;

  // Logic lấy danh sách phòng đã chọn từ các checkbox
  let specificRooms = null;
  if (issueScope === "specific_rooms") {
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
  if (
    !issueBranch ||
    !issueDescription ||
    (issueScope === "specific_rooms" && !specificRooms)
  ) {
    messageEl.textContent =
      "Vui lòng điền đầy đủ thông tin (chọn ít nhất 1 phòng nếu là sự cố phòng cụ thể).";
    messageEl.className = "p-3 rounded-lg text-sm text-center alert-error";
    messageEl.classList.remove("hidden");
    return;
  }

  // Vô hiệu hóa nút để tránh gửi nhiều lần
  button.disabled = true;
  button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Đang gửi...`;

  try {
    let imageUrl = "";
    // Tải ảnh lên nếu có
    if (imageFile) {
      const storageRef = ref(
        storage,
        `issue_images/${currentUser.uid}/${Date.now()}-${imageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
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
      status: "Mới tạo",
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

  video.classList.remove("hidden");
  preview.classList.add("hidden");
  captureBtn.classList.remove("hidden");
  recaptureBtn.classList.add("hidden");
  confirmBtn.classList.add("hidden");

  try {
    currentCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    video.srcObject = currentCameraStream;
  } catch (err) {
    console.error("Camera error:", err);
    cameraModal.querySelector("#cameraMessage").textContent =
      "Không thể truy cập camera. Vui lòng cấp quyền.";
  }
}

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
    const today = new Date().toISOString().split("T")[0];
    const storageRef = ref(
      storage,
      `attendance_photos/${currentUser.uid}/${today}/${Date.now()}.jpg`
    );
    const snapshot = await uploadBytes(storageRef, capturedPhotoBlob);
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
  sidebar = document.getElementById("sidebar");
  mobileMenuToggle = document.getElementById("mobileMenuToggle");
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
  document
    .getElementById("logoutDropdownBtn")
    .addEventListener("click", handleLogout);
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
  authSection.classList.add("hidden");
  appContainer.classList.add("hidden");
  skeletonLoader.classList.add("hidden");
  forceChangePasswordModal.style.display = "flex";
}

async function handleForcePasswordChange() {
  const newPassword =
    forceChangePasswordModal.querySelector("#newPassword").value;
  const confirmPassword = forceChangePasswordModal.querySelector(
    "#confirmNewPassword"
  ).value;
  const messageEl = forceChangePasswordModal.querySelector(
    "#changePasswordMessage"
  );

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

  try {
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
      setupUIForLoggedInUser();
      listenToNotifications();
      showInitialView();
      if (currentUserProfile.role === "Admin") {
        startEscalationChecker();
      }
    }, 2000);
  } catch (error) {
    console.error("Force Password Change Error:", error);
    messageEl.textContent = `Lỗi: ${error.message}`;
    messageEl.className = "p-3 rounded-lg text-sm alert-error";
    messageEl.classList.remove("hidden");
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