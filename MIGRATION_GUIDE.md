# Migration Guide: Vanilla JS → Svelte

## Tổng quan

Hướng dẫn này sẽ giúp bạn migrate từ Vanilla JS (app.js) sang Svelte framework theo từng bước.

## Lợi ích của Svelte

1. ✅ **Component-based**: Chia code thành các component nhỏ, dễ quản lý
2. ✅ **Reactive**: Tự động update UI khi state thay đổi
3. ✅ **No Virtual DOM**: Biên dịch ra JavaScript thuần, rất nhanh
4. ✅ **Syntax gần gũi**: Giống HTML/CSS/JS hiện tại của bạn
5. ✅ **Small bundle**: Code compile ra rất nhỏ

## Chiến lược Migration

### Phase 1: Setup & Proof of Concept ✅
- [x] Cài đặt Svelte
- [x] Setup Vite với Svelte plugin
- [x] Tạo component example (AccountsTable)
- [x] Test integration

### Phase 2: Migrate một View đơn giản (Ưu tiên)
- [ ] Migrate "Danh Sách Tài Khoản" (manageAccountsView)
- [ ] Migrate một phần của Dashboard

### Phase 3: Migrate các View khác
- [ ] Issue History View
- [ ] Activity Log View
- [ ] My Tasks View

### Phase 4: Migrate toàn bộ
- [ ] Remaining views
- [ ] Remove old app.js code
- [ ] Cleanup

## Cấu trúc thư mục mới

```
Index/
├── src/
│   ├── components/          # Svelte components
│   │   ├── AccountsTable.svelte
│   │   ├── IssueList.svelte
│   │   └── ...
│   ├── stores/              # Svelte stores (state management)
│   │   ├── userStore.js
│   │   ├── accountsStore.js
│   │   └── ...
│   ├── lib/                 # Utilities & helpers
│   │   ├── firebase.js      # Firebase config
│   │   └── ...
│   ├── views/               # Page-level components
│   │   ├── ManageAccountsView.svelte
│   │   └── ...
│   └── App.svelte           # Root component
├── app.js                   # Legacy code (giữ để reference)
└── index.html              # Entry point
```

## Ví dụ Migration

### Trước (Vanilla JS):

```javascript
// app.js
let allUsersCache = [];
let accountsSearchTerm = "";

function renderAccountsTable(users) {
  const tableBody = document.querySelector("#accountsTableBody");
  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.displayName}</td>
      <td>${user.email}</td>
    </tr>
  `).join("");
}

// Update khi search
accountSearchInput.addEventListener("input", (e) => {
  accountsSearchTerm = e.target.value;
  renderAccountsTable(allUsersCache);
});
```

### Sau (Svelte):

```svelte
<!-- AccountsTable.svelte -->
<script>
  import { accountsStore } from '../stores/accountsStore.js';
  
  let searchTerm = "";
  
  $: filteredUsers = $accountsStore.users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<input 
  type="text" 
  bind:value={searchTerm}
  placeholder="Tìm kiếm..."
/>

<table>
  <tbody>
    {#each filteredUsers as user}
      <tr>
        <td>{user.displayName}</td>
        <td>{user.email}</td>
      </tr>
    {/each}
  </tbody>
</table>
```

## State Management với Svelte Stores

### Tạo Store:

```javascript
// stores/accountsStore.js
import { writable, derived } from 'svelte/store';

export const users = writable([]);
export const searchTerm = writable("");
export const showDisabled = writable(false);

// Derived store - tự động update khi dependencies thay đổi
export const filteredUsers = derived(
  [users, searchTerm, showDisabled],
  ([$users, $searchTerm, $showDisabled]) => {
    let filtered = $users;
    
    if (!$showDisabled) {
      filtered = filtered.filter(u => !u.disabled);
    }
    
    if ($searchTerm) {
      filtered = filtered.filter(u => 
        u.displayName.includes($searchTerm) ||
        u.email.includes($searchTerm)
      );
    }
    
    return filtered;
  }
);
```

### Sử dụng Store:

```svelte
<script>
  import { filteredUsers, searchTerm } from '../stores/accountsStore.js';
  
  // $ prefix = reactive subscription (tự động unsubscribe khi component unmount)
  // filteredUsers sẽ tự động update khi users/searchTerm/showDisabled thay đổi
</script>

<p>Tổng: {$filteredUsers.length} tài khoản</p>

{#each $filteredUsers as user}
  <!-- render user -->
{/each}
```

## Firebase Integration

### Setup Firebase (một lần):

```javascript
// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// ... other imports

const firebaseConfig = { /* ... */ };
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Sử dụng trong Component:

```svelte
<script>
  import { db } from '../lib/firebase.js';
  import { collection, getDocs } from 'firebase/firestore';
  import { users } from '../stores/accountsStore.js';
  
  async function loadUsers() {
    const snapshot = await getDocs(collection(db, 'users'));
    const usersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    users.set(usersData); // Update store → UI tự động update
  }
  
  loadUsers();
</script>
```

## Best Practices

### 1. Component Structure

Mỗi component nên:
- Nhỏ, focused (single responsibility)
- Có props rõ ràng
- Sử dụng stores cho shared state
- Sử dụng local state cho component-specific state

### 2. State Management

- **Writable stores**: Cho state cần thay đổi
- **Derived stores**: Cho computed values
- **Readable stores**: Cho read-only state
- **Local state**: Cho state chỉ dùng trong component

### 3. Reactive Statements

```svelte
<script>
  let count = 0;
  let doubled;
  
  // Reactive statement - tự động chạy khi count thay đổi
  $: doubled = count * 2;
  
  // Multiple dependencies
  $: {
    console.log(`Count changed: ${count}`);
    // Multiple statements
  }
</script>
```

### 4. Event Handling

```svelte
<!-- Inline handler -->
<button on:click={() => count++}>Click</button>

<!-- Handler function -->
<button on:click={handleClick}>Click</button>

<!-- Custom events -->
<MyComponent on:customEvent={handleEvent} />
```

## Migration Steps cho một View

### Bước 1: Tạo Component

```svelte
<!-- src/views/ManageAccountsView.svelte -->
<script>
  import AccountsTable from '../components/AccountsTable.svelte';
  // ... imports
</script>

<div class="card">
  <h2>Danh Sách Tài Khoản</h2>
  <AccountsTable />
</div>
```

### Bước 2: Tạo Stores

```javascript
// src/stores/accountsStore.js
export const users = writable([]);
// ... other stores
```

### Bước 3: Migrate Logic

Di chuyển logic từ app.js vào:
- Component (UI logic)
- Stores (state management)
- lib/ files (utilities)

### Bước 4: Integrate

```svelte
<!-- App.svelte -->
<script>
  import ManageAccountsView from './views/ManageAccountsView.svelte';
  import { onMount } from 'svelte';
  
  let currentView = 'manageAccounts';
  
  onMount(() => {
    // Initialize logic
  });
</script>

{#if currentView === 'manageAccounts'}
  <ManageAccountsView />
{/if}
```

### Bước 5: Test

- Test functionality
- Test performance
- Test edge cases

### Bước 6: Remove Old Code

Sau khi đã test kỹ, remove code cũ trong app.js

## Common Patterns

### Loading State

```svelte
<script>
  let loading = false;
  let data = null;
  
  async function loadData() {
    loading = true;
    try {
      data = await fetchData();
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>Đang tải...</p>
{:else if data}
  <!-- Render data -->
{:else}
  <p>Không có dữ liệu</p>
{/if}
```

### Form Handling

```svelte
<script>
  let formData = {
    email: '',
    password: ''
  };
  
  async function handleSubmit() {
    // Validation
    if (!formData.email) return;
    
    // Submit
    await submitForm(formData);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="email" bind:value={formData.email} />
  <input type="password" bind:value={formData.password} />
  <button type="submit">Submit</button>
</form>
```

### Pagination

```svelte
<script>
  import { writable } from 'svelte/store';
  
  let currentPage = 1;
  const itemsPerPage = 10;
  
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: paginatedItems = allItems.slice(startIndex, endIndex);
  $: totalPages = Math.ceil(allItems.length / itemsPerPage);
</script>

{#each paginatedItems as item}
  <!-- render item -->
{/each}

<button 
  disabled={currentPage === 1}
  on:click={() => currentPage--}
>
  Previous
</button>
<button 
  disabled={currentPage === totalPages}
  on:click={() => currentPage++}
>
  Next
</button>
```

## Resources

- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte Docs](https://svelte.dev/docs)
- [Svelte Stores](https://svelte.dev/tutorial/writable-stores)
- [Svelte + Firebase](https://fireship.io/courses/svelte/)

## Next Steps

1. Review component example (AccountsTable.svelte)
2. Start với một view đơn giản
3. Migrate từng phần, test kỹ trước khi tiếp tục
4. Refactor dần dần, không cần rush

