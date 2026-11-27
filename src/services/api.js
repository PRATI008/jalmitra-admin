// Admin Panel Comprehensive API Service
const API_BASE = 'http://localhost:5000/api';

export const adminApi = {
  // 1. Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
    }
    return data;
  },

  getStoredAdmin() {
    try {
      const user = localStorage.getItem('adminUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // 2. Stats & Overview
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Stats fetch error:', err.message);
      return null;
    }
  },

  // 3. User Management
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/admin/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Users fetch error:', err.message);
      return [];
    }
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create user');
    }
    return data.data;
  },

  async updateUserStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update user status');
    }
    return data.data;
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete user');
    }
    return true;
  },

  // 4. Supplier Management
  async getSuppliers() {
    try {
      const res = await fetch(`${API_BASE}/admin/suppliers`);
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Suppliers fetch error:', err.message);
      return [];
    }
  },

  async createSupplier(supplierData) {
    const res = await fetch(`${API_BASE}/admin/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create supplier');
    }
    return data.data;
  },

  async updateSupplierStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/suppliers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update supplier status');
    }
    return data.data;
  },

  async deleteSupplier(id) {
    const res = await fetch(`${API_BASE}/admin/suppliers/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete supplier');
    }
    return true;
  },

  // 5. Subscription Management
  async getSubscriptions() {
    try {
      const res = await fetch(`${API_BASE}/admin/subscriptions`);
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Subscriptions fetch error:', err.message);
      return [];
    }
  },

  async createSubscription(planData) {
    const res = await fetch(`${API_BASE}/admin/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create subscription plan');
    }
    return data.data;
  },

  async updateSubscriptionStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/subscriptions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update subscription status');
    }
    return data.data;
  },

  async deleteSubscription(id) {
    const res = await fetch(`${API_BASE}/admin/subscriptions/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete subscription');
    }
    return true;
  },

  // 6. Platform Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/admin/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Orders fetch error:', err.message);
      return [];
    }
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update order status');
    }
    return data.data;
  }
};

export default adminApi;
