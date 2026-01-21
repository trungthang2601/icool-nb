<!-- 
  Example Svelte Component: AccountsTable
  This demonstrates how to migrate from Vanilla JS to Svelte
  
  Before: app.js had renderAccountsTable() function with manual DOM manipulation
  After: Reactive component that automatically updates when data changes
-->

<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props - data passed from parent
  export let users = [];
  export let showDisabled = false;
  export let currentUser = null; // Passed from parent
  
  // Local reactive state
  let searchTerm = '';
  let loading = false;
  let error = null;
  
  // Reactive statement - automatically recalculates when dependencies change
  // This replaces the manual filtering in renderAccountsTable()
  $: filteredUsers = (() => {
    let filtered = users;
    
    // Filter disabled accounts
    if (!showDisabled) {
      filtered = filtered.filter(user => 
        user.status !== 'disabled' && !user.disabled
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        const displayName = (user.displayName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const employeeId = (user.employeeId || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        
        return (
          displayName.includes(term) ||
          email.includes(term) ||
          employeeId.includes(term) ||
          role.includes(term)
        );
      });
    }
    
    return filtered;
  })();
  
  // Computed values - automatically update when filteredUsers changes
  $: totalCount = users.length;
  $: filteredCount = filteredUsers.length;
  $: displayText = searchTerm 
    ? `Hiển thị ${filteredCount} / ${totalCount} (Tổng: ${totalCount}) tài khoản`
    : showDisabled || filteredCount === totalCount
      ? `Tổng: ${totalCount} tài khoản`
      : `Hiển thị ${filteredCount} / Tổng: ${totalCount} tài khoản`;
  
  // Events - emit custom events to parent
  const emit = createEventDispatcher();
  
  function handleEdit(uid) {
    emit('edit', { uid });
  }
  
  function handleDelete(uid, name) {
    emit('delete', { uid, name });
  }
  
  function handleEnable(uid) {
    emit('enable', { uid });
  }
</script>

<!-- Component template - automatically updates when reactive variables change -->
<div class="accounts-table-container">
  <!-- Search Input -->
  <div class="mb-4">
    <div class="relative max-w-md">
      <input 
        type="text" 
        class="input-field pr-10" 
        placeholder="Tìm kiếm theo tên, email, MSNV hoặc vai trò..."
        bind:value={searchTerm}
      />
      <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
    </div>
    <p class="text-xs text-slate-500 mt-1.5 flex items-center">
      <i class="fas fa-info-circle mr-1.5 text-indigo-500"></i>
      <span>Gõ để tìm kiếm nhanh tài khoản trong danh sách</span>
    </p>
  </div>
  
  <!-- Count Display -->
  <div class="text-sm text-slate-600 mb-4">
    <i class="fas fa-users mr-1.5 text-indigo-500"></i>
    <span>{displayText}</span>
  </div>
  
  <!-- Loading State -->
  {#if loading}
    <div class="text-center p-4">Đang tải...</div>
  <!-- Error State -->
  {:else if error}
    <div class="text-center p-4 text-red-500">Lỗi: {error}</div>
  <!-- Empty State -->
  {:else if filteredUsers.length === 0}
    <div class="text-center p-4">Không có tài khoản nào.</div>
  <!-- Table -->
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 responsive-table">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
              MSNV
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
              Tên Người Dùng
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
              Email
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
              Vai Trò
            </th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {#each filteredUsers as user (user.uid)}
            <tr class="hover:bg-gray-50" class:opacity-60={user.status === 'disabled' || user.disabled} class:bg-slate-50={user.status === 'disabled' || user.disabled}>
              <td data-label="MSNV" class="px-4 py-3">{user.employeeId || 'N/A'}</td>
              <td data-label="Tên Người Dùng" class="px-4 py-3">
                {user.displayName}
                {#if user.status === 'disabled' || user.disabled}
                  <span class="text-xs text-red-500 font-semibold">(Đã vô hiệu hóa)</span>
                {/if}
              </td>
              <td data-label="Email" class="px-4 py-3">{user.email}</td>
              <td data-label="Vai Trò" class="px-4 py-3">{user.role}</td>
              <td data-label="Hành động" class="px-4 py-3 text-right">
                <button 
                  class="btn-secondary !text-sm !py-1 !px-2 mr-2"
                  on:click={() => handleEdit(user.uid)}
                  disabled={user.status === 'disabled' || user.disabled}
                >
                  Sửa
                </button>
                {#if user.uid !== currentUser?.uid}
                  {#if user.status === 'disabled' || user.disabled}
                    <button 
                      class="btn-primary !text-sm !py-1 !px-2"
                      on:click={() => handleEnable(user.uid)}
                    >
                      Kích hoạt
                    </button>
                  {:else}
                    <button 
                      class="btn-danger !text-sm !py-1 !px-2"
                      on:click={() => handleDelete(user.uid, user.displayName)}
                    >
                      Vô hiệu hóa
                    </button>
                  {/if}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  /* Component-specific styles */
  .accounts-table-container {
    /* Add any container-specific styles */
  }
</style>

