// Order service for userpage
import { api } from './api'

export class OrderService {
  // Get quote for order
  static async getQuote(vehicleId, distanceKm = 5) {
    try {
      const response = await api.post('/orders/quote', {
        vehicleId,
        distanceKm
      })
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Create new order
  static async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get user's orders
  static async getMyOrders() {
    try {
      const response = await api.get('/orders/my')
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get order details
  static async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Cancel order
  static async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled')
  }
}

export default OrderService
