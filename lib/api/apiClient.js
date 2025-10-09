// Shared API client utilities for customer app
// This follows the same pattern as the admin panel for consistency

// Compute API base to avoid localhost in production
function getApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const rawIsLocal = /localhost|127\.0\.0\.1/i.test(raw)
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    const originIsLocal = /localhost|127\.0\.0\.1/i.test(origin)
    if ((!raw || rawIsLocal) && !originIsLocal) {
      return `${origin}/api`
    }
  }
  if (!raw) return '/api'
  return raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`
}
export const API_BASE_URL = getApiBase();

// API response wrapper - consistent with admin panel
class ApiResponse {
  constructor(data, success = true, message = '', errors = []) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = 'Success') {
    return new ApiResponse(data, true, message);
  }

  static error(message = 'Error', errors = [], data = null) {
    return new ApiResponse(data, false, message, errors);
  }
}

// HTTP client with error handling - consistent with admin panel
class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    // Resolve at construction time (client-side components will get runtime origin)
    this.baseURL = typeof window !== 'undefined' ? getApiBase() : baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let token = null;
    if (typeof window !== 'undefined') {
      try { token = localStorage.getItem('auth_token') || null } catch {}
    }
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };
    config.headers = { ...config.headers, ...authHeader };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = Object.keys(params).length 
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    return this.request(endpoint + queryString, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create default client instance
export const apiClient = new HttpClient();

// Generic CRUD operations - consistent with admin panel
export class CrudService {
  constructor(resource) {
    this.resource = resource;
    this.client = apiClient;
  }

  async getAll(params = {}) {
    try {
      const response = await this.client.get(`/${this.resource}`, params);
      return ApiResponse.success(response.data, 'Data retrieved successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to fetch ${this.resource}`, [error.message]);
    }
  }

  async getById(id) {
    try {
      const response = await this.client.get(`/${this.resource}/${id}`);
      return ApiResponse.success(response.data, 'Item retrieved successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to fetch ${this.resource} with ID ${id}`, [error.message]);
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(`/${this.resource}`, data);
      return ApiResponse.success(response.data, 'Item created successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to create ${this.resource}`, [error.message]);
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`/${this.resource}/${id}`, data);
      return ApiResponse.success(response.data, 'Item updated successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to update ${this.resource} with ID ${id}`, [error.message]);
    }
  }

  async patch(id, data) {
    try {
      const response = await this.client.patch(`/${this.resource}/${id}`, data);
      return ApiResponse.success(response.data, 'Item updated successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to update ${this.resource} with ID ${id}`, [error.message]);
    }
  }

  async delete(id) {
    try {
      await this.client.delete(`/${this.resource}/${id}`);
      return ApiResponse.success(null, 'Item deleted successfully');
    } catch (error) {
      return ApiResponse.error(`Failed to delete ${this.resource} with ID ${id}`, [error.message]);
    }
  }
}

// Customer-specific services
export class CustomerService extends CrudService {
  constructor() {
    super('customers');
  }

  async getProfile() {
    try {
      const response = await this.client.get('/profile');
      return ApiResponse.success(response.data, 'Profile retrieved successfully');
    } catch (error) {
      return ApiResponse.error('Failed to get profile', [error.message]);
    }
  }

  async updateProfile(data) {
    try {
      const response = await this.client.put('/profile', data);
      return ApiResponse.success(response.data, 'Profile updated successfully');
    } catch (error) {
      return ApiResponse.error('Failed to update profile', [error.message]);
    }
  }

  async getAddresses() {
    try {
      const response = await this.client.get('/addresses');
      return ApiResponse.success(response.data, 'Addresses retrieved successfully');
    } catch (error) {
      return ApiResponse.error('Failed to get addresses', [error.message]);
    }
  }

  async addAddress(addressData) {
    try {
      const response = await this.client.post('/addresses', addressData);
      return ApiResponse.success(response.data, 'Address added successfully');
    } catch (error) {
      return ApiResponse.error('Failed to add address', [error.message]);
    }
  }

  async updateAddress(id, addressData) {
    try {
      const response = await this.client.put(`/addresses/${id}`, addressData);
      return ApiResponse.success(response.data, 'Address updated successfully');
    } catch (error) {
      return ApiResponse.error('Failed to update address', [error.message]);
    }
  }

  async deleteAddress(id) {
    try {
      await this.client.delete(`/addresses/${id}`);
      return ApiResponse.success(null, 'Address deleted successfully');
    } catch (error) {
      return ApiResponse.error('Failed to delete address', [error.message]);
    }
  }
}

export class OrdersService extends CrudService {
  constructor() {
    super('orders');
  }

  async createOrder(orderData) {
    try {
      const response = await this.client.post('/orders', orderData);
      return ApiResponse.success(response.data, 'Order created successfully');
    } catch (error) {
      return ApiResponse.error('Failed to create order', [error.message]);
    }
  }

  async getMyOrders(params = {}) {
    try {
      // Primary endpoint
      const response = await this.client.get('/orders/my-orders', params);
      return ApiResponse.success(response, 'Orders retrieved successfully');
    } catch (error) {
      // Fallback to legacy endpoint if 404
      if (/404/.test(error?.message || '')) {
        try {
          const fallback = await this.client.get('/orders/my', params);
          return ApiResponse.success(fallback, 'Orders retrieved successfully');
        } catch (e2) {
          return ApiResponse.error('Failed to get orders', [e2.message]);
        }
      }
      return ApiResponse.error('Failed to get orders', [error.message]);
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      const response = await this.client.post(`/orders/${orderId}/cancel`, { reason });
      return ApiResponse.success(response.data, 'Order cancelled successfully');
    } catch (error) {
      return ApiResponse.error('Failed to cancel order', [error.message]);
    }
  }

  async trackOrder(orderId) {
    try {
      const response = await this.client.get(`/orders/${orderId}/tracking`);
      return ApiResponse.success(response.data, 'Tracking data retrieved');
    } catch (error) {
      return ApiResponse.error('Failed to get tracking data', [error.message]);
    }
  }

  async rateOrder(orderId, rating, review = '') {
    try {
      const response = await this.client.post(`/orders/${orderId}/rate`, { rating, review });
      return ApiResponse.success(response.data, 'Order rated successfully');
    } catch (error) {
      return ApiResponse.error('Failed to rate order', [error.message]);
    }
  }
}

export class PaymentService {
  constructor() {
    this.client = apiClient;
  }

  async getPaymentMethods() {
    try {
      const response = await this.client.get('/payment/methods');
      return ApiResponse.success(response.data, 'Payment methods retrieved');
    } catch (error) {
      return ApiResponse.error('Failed to get payment methods', [error.message]);
    }
  }

  async addPaymentMethod(methodData) {
    try {
      const response = await this.client.post('/payment/methods', methodData);
      return ApiResponse.success(response.data, 'Payment method added successfully');
    } catch (error) {
      return ApiResponse.error('Failed to add payment method', [error.message]);
    }
  }

  async processPayment(paymentData) {
    try {
      const response = await this.client.post('/payment/process', paymentData);
      return ApiResponse.success(response.data, 'Payment processed successfully');
    } catch (error) {
      return ApiResponse.error('Payment failed', [error.message]);
    }
  }

  async getWalletBalance() {
    try {
      const response = await this.client.get('/wallet/balance');
      return ApiResponse.success(response.data, 'Wallet balance retrieved');
    } catch (error) {
      return ApiResponse.error('Failed to get wallet balance', [error.message]);
    }
  }

  async addMoneyToWallet(amount, paymentMethod) {
    try {
      const response = await this.client.post('/wallet/add-money', { amount, paymentMethod });
      return ApiResponse.success(response.data, 'Money added to wallet successfully');
    } catch (error) {
      return ApiResponse.error('Failed to add money to wallet', [error.message]);
    }
  }

  async getTransactionHistory(params = {}) {
    try {
      const response = await this.client.get('/payment/transactions', params);
      return ApiResponse.success(response.data, 'Transaction history retrieved');
    } catch (error) {
      return ApiResponse.error('Failed to get transaction history', [error.message]);
    }
  }
}

export class SupportService extends CrudService {
  constructor() {
    super('support');
  }

  async createTicket(ticketData) {
    try {
      const response = await this.client.post('/support/tickets', ticketData);
      return ApiResponse.success(response.data, 'Support ticket created successfully');
    } catch (error) {
      return ApiResponse.error('Failed to create support ticket', [error.message]);
    }
  }

  async getMyTickets(params = {}) {
    try {
      const response = await this.client.get('/support/tickets/my-tickets', params);
      return ApiResponse.success(response.data, 'Support tickets retrieved');
    } catch (error) {
      return ApiResponse.error('Failed to get support tickets', [error.message]);
    }
  }

  async addMessage(ticketId, message) {
    try {
      const response = await this.client.post(`/support/tickets/${ticketId}/messages`, { message });
      return ApiResponse.success(response.data, 'Message sent successfully');
    } catch (error) {
      return ApiResponse.error('Failed to send message', [error.message]);
    }
  }

  async closeTicket(ticketId) {
    try {
      const response = await this.client.patch(`/support/tickets/${ticketId}`, { status: 'closed' });
      return ApiResponse.success(response.data, 'Ticket closed successfully');
    } catch (error) {
      return ApiResponse.error('Failed to close ticket', [error.message]);
    }
  }
}

// Service instances
export const customerService = new CustomerService();
export const ordersService = new OrdersService();
export const paymentService = new PaymentService();
export const supportService = new SupportService();

// React hook for API services
export const useApi = () => {
  return {
    customer: customerService,
    orders: ordersService,
    payment: paymentService,
    support: supportService,
  };
};

// Error handling utilities
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  if (error?.errors?.length > 0) {
    return error.errors.join(', ');
  }
  return error?.message || fallbackMessage;
};

// Data transformation utilities
export const transformListResponse = (response, defaultValue = []) => {
  if (!response?.success) return defaultValue;
  return Array.isArray(response.data) ? response.data : defaultValue;
};

export const transformItemResponse = (response, defaultValue = null) => {
  if (!response?.success) return defaultValue;
  return response.data || defaultValue;
};

// Feature flags for development
export const isDevelopment = process.env.NODE_ENV === 'development';
export const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDevelopment;

const apiUtilities = {
  ApiResponse,
  HttpClient,
  CrudService,
  apiClient,
  useApi,
  handleApiError,
  transformListResponse,
  transformItemResponse,
  isDevelopment,
  useMockAPI
};

export default apiUtilities;
export const setAuthToken = (token) => {
  try { if (typeof window !== 'undefined') localStorage.setItem('auth_token', token) } catch {}
  apiClient.setAuthToken(token)
}
