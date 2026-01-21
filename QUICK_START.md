# Quick Start: Svelte Setup

## Installation

```bash
cd Index
npm install
```

This will install:
- `svelte` - The Svelte framework
- `@sveltejs/vite-plugin-svelte` - Vite plugin for Svelte

## Project Structure

```
Index/
├── src/
│   ├── components/          # Svelte components
│   │   └── AccountsTable.svelte (example)
│   ├── stores/              # Svelte stores (state management)
│   │   └── accountsStore.js (example)
│   └── App.svelte           # Root component (to be created)
├── app.js                   # Legacy code (keep for now)
├── index.html              # Entry point
├── vite.config.js          # Vite config (updated for Svelte)
└── svelte.config.js        # Svelte config
```

## Running the Project

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Example Usage

### 1. Using the AccountsTable Component

```svelte
<!-- In any Svelte component -->
<script>
  import AccountsTable from './components/AccountsTable.svelte';
  import { users, showDisabled } from './stores/accountsStore.js';
  
  // Load users from Firebase
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from './lib/firebase.js';
  
  async function loadUsers() {
    const snapshot = await getDocs(collection(db, 'users'));
    const usersData = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    
    users.set(usersData); // Update store → component automatically updates
  }
  
  loadUsers();
</script>

<AccountsTable 
  users={$users} 
  showDisabled={$showDisabled}
  currentUser={$currentUser}
  on:edit={(e) => handleEdit(e.detail.uid)}
  on:delete={(e) => handleDelete(e.detail)}
  on:enable={(e) => handleEnable(e.detail.uid)}
/>
```

### 2. Using Stores

```svelte
<script>
  import { users, searchTerm, filteredUsers } from './stores/accountsStore.js';
  
  // $ prefix subscribes to store (auto-unsubscribes on unmount)
  // filteredUsers automatically updates when users/searchTerm changes
</script>

<input bind:value={$searchTerm} placeholder="Search..." />

<p>Total: {$filteredUsers.length} accounts</p>

{#each $filteredUsers as user}
  <div>{user.displayName}</div>
{/each}
```

## Next Steps

1. Review `MIGRATION_GUIDE.md` for detailed migration steps
2. Look at `src/components/AccountsTable.svelte` as an example
3. Check `src/stores/accountsStore.js` for state management pattern
4. Start migrating one view at a time

## Key Concepts

### Reactive Statements
```svelte
<script>
  let count = 0;
  
  // Automatically recalculates when count changes
  $: doubled = count * 2;
  
  // Multiple statements
  $: {
    console.log(`Count: ${count}`);
    // Other reactive code
  }
</script>
```

### Store Subscriptions
```svelte
<script>
  import { myStore } from './stores/myStore.js';
  
  // $ prefix = reactive subscription
  // Automatically updates when store changes
  let value = $myStore;
</script>

<div>{$myStore}</div>
```

### Event Handling
```svelte
<button on:click={() => count++}>Click</button>

<!-- Custom events -->
<MyComponent on:customEvent={handleEvent} />
```

## Need Help?

- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte Docs](https://svelte.dev/docs)
- Check `MIGRATION_GUIDE.md` for detailed patterns

