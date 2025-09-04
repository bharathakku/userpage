'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  user: {
    id: null,
    name: 'Ramesh',
    phone: '+91 9876543210',
    email: 'ramesh@example.com',
    profileType: 'Partner Enterprise',
    isAuthenticated: true,
    referralCode: 'RBI-S43'
  },
  wallet: {
    balance: 5000,
    currency: 'INR'
  },
  orders: {
    active: [],
    history: []
  },
  addresses: [
    { id: 1, type: 'Home', address: '12 Bagh Street, Chanakyapuri, GA - 403501', isDefault: true },
    { id: 2, type: 'Office', address: '115 India Buildings Fort, TN - 600001', isDefault: false }
  ],
  notifications: [],
  loading: false,
  error: null
}

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // User actions
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  
  // Wallet actions
  UPDATE_WALLET_BALANCE: 'UPDATE_WALLET_BALANCE',
  ADD_MONEY_TO_WALLET: 'ADD_MONEY_TO_WALLET',
  
  // Order actions
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  
  // Address actions
  SET_ADDRESSES: 'SET_ADDRESSES',
  ADD_ADDRESS: 'ADD_ADDRESS',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  SET_DEFAULT_ADDRESS: 'SET_DEFAULT_ADDRESS',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    // User actions
    case actionTypes.SET_USER:
      return { ...state, user: { ...state.user, ...action.payload } }
    
    case actionTypes.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } }
    
    case actionTypes.LOGOUT_USER:
      return { ...state, user: { ...initialState.user, isAuthenticated: false } }
    
    // Wallet actions
    case actionTypes.UPDATE_WALLET_BALANCE:
      return { 
        ...state, 
        wallet: { ...state.wallet, balance: action.payload } 
      }
    
    case actionTypes.ADD_MONEY_TO_WALLET:
      return { 
        ...state, 
        wallet: { 
          ...state.wallet, 
          balance: state.wallet.balance + action.payload 
        } 
      }
    
    // Order actions
    case actionTypes.SET_ORDERS:
      return { ...state, orders: action.payload }
    
    case actionTypes.ADD_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          active: [...state.orders.active, action.payload]
        }
      }
    
    case actionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          active: state.orders.active.map(order =>
            order.id === action.payload.id ? { ...order, ...action.payload } : order
          )
        }
      }
    
    case actionTypes.CANCEL_ORDER:
      return {
        ...state,
        orders: {
          active: state.orders.active.filter(order => order.id !== action.payload),
          history: [...state.orders.history, 
            { ...state.orders.active.find(order => order.id === action.payload), status: 'cancelled' }
          ]
        }
      }
    
    // Address actions
    case actionTypes.SET_ADDRESSES:
      return { ...state, addresses: action.payload }
    
    case actionTypes.ADD_ADDRESS:
      return { 
        ...state, 
        addresses: [...state.addresses, action.payload] 
      }
    
    case actionTypes.UPDATE_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.map(addr =>
          addr.id === action.payload.id ? { ...addr, ...action.payload } : addr
        )
      }
    
    case actionTypes.DELETE_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr.id !== action.payload)
      }
    
    case actionTypes.SET_DEFAULT_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload
        }))
      }
    
    // Notification actions
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { 
          id: Date.now(), 
          timestamp: new Date(), 
          ...action.payload 
        }]
      }
    
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // API simulation functions (replace with real API calls)
  const api = {
    // User APIs
    async getUserProfile() {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // dispatch({ type: actionTypes.SET_USER, payload: userData })
        dispatch({ type: actionTypes.SET_LOADING, payload: false })
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      }
    },

    async updateUserProfile(userData) {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        dispatch({ type: actionTypes.UPDATE_USER, payload: userData })
        dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: {
          type: 'success',
          message: 'Profile updated successfully'
        }})
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      }
    },

    // Order APIs
    async createOrder(orderData) {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        const newOrder = {
          id: `CBN${Date.now()}`,
          ...orderData,
          status: 'pending',
          createdAt: new Date()
        }
        dispatch({ type: actionTypes.ADD_ORDER, payload: newOrder })
        dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: {
          type: 'success',
          message: 'Order created successfully'
        }})
        return newOrder
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    async cancelOrder(orderId) {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        dispatch({ type: actionTypes.CANCEL_ORDER, payload: orderId })
        dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: {
          type: 'info',
          message: 'Order cancelled successfully'
        }})
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      }
    },

    // Wallet APIs
    async addMoneyToWallet(amount) {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        // Simulated payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        dispatch({ type: actionTypes.ADD_MONEY_TO_WALLET, payload: amount })
        dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: {
          type: 'success',
          message: `₹${amount} added to wallet successfully`
        }})
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    // Address APIs
    async addAddress(addressData) {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newAddress = { id: Date.now(), ...addressData }
        dispatch({ type: actionTypes.ADD_ADDRESS, payload: newAddress })
        dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: {
          type: 'success',
          message: 'Address added successfully'
        }})
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      }
    }
  }

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      setTimeout(() => {
        dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notification.id })
      }, 5000)
    })
  }, [state.notifications])

  const value = {
    state,
    dispatch,
    actionTypes,
    api
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
