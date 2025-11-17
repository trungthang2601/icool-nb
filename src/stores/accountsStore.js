/**
 * Accounts Store - Svelte store for managing accounts state
 * 
 * This replaces global variables like:
 * - allUsersCache
 * - allUsersCacheUnfiltered
 * - accountsSearchTerm
 * - showDisabledAccounts
 */

import { writable, derived } from 'svelte/store';

// Writable stores - can be updated
export const users = writable([]);
export const usersUnfiltered = writable([]);
export const searchTerm = writable('');
export const showDisabled = writable(false);
export const loading = writable(false);
export const error = writable(null);

// Derived store - automatically computed from other stores
// This replaces the filtering logic in renderAccountsTable()
export const filteredUsers = derived(
  [users, searchTerm, showDisabled],
  ([$users, $searchTerm, $showDisabled]) => {
    let filtered = $users;
    
    // Filter disabled accounts
    if (!$showDisabled) {
      filtered = filtered.filter(user => 
        user.status !== 'disabled' && !user.disabled
      );
    }
    
    // Filter by search term
    if ($searchTerm.trim()) {
      const term = $searchTerm.toLowerCase();
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
  }
);

// Derived store for count display
export const countDisplay = derived(
  [usersUnfiltered, filteredUsers, searchTerm, showDisabled],
  ([$usersUnfiltered, $filtered, $searchTerm, $showDisabled]) => {
    const totalAll = $usersUnfiltered.length;
    const filtered = $filtered.length;
    const visible = $users.length;
    
    if ($searchTerm && $searchTerm.trim()) {
      return {
        text: `Hiển thị ${filtered} / ${visible} (Tổng: ${totalAll}) tài khoản`,
        total: totalAll,
        visible: visible,
        filtered: filtered
      };
    } else {
      if ($showDisabled || visible === totalAll) {
        return {
          text: `Tổng: ${totalAll} tài khoản`,
          total: totalAll,
          visible: visible,
          filtered: filtered
        };
      } else {
        return {
          text: `Hiển thị ${visible} / Tổng: ${totalAll} tài khoản`,
          total: totalAll,
          visible: visible,
          filtered: filtered
        };
      }
    }
  }
);

