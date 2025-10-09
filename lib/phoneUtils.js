// Phone number validation and formatting utilities

export const validatePhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Check if it's a valid Indian mobile number (10 digits starting with 6-9)
  const indianMobileRegex = /^[6-9]\d{9}$/
  
  return {
    isValid: indianMobileRegex.test(cleaned),
    cleaned: cleaned,
    formatted: cleaned ? `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}` : ''
  }
}

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  
  return phoneNumber
}

export const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const simulateOTPSend = async (phoneNumber) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would call your backend API
  // For demo purposes, we'll return a mock response
  return {
    success: true,
    message: 'OTP sent successfully',
    // In development, you might want to return the actual OTP for testing
    otp: process.env.NODE_ENV === 'development' ? '123456' : null
  }
}

export const verifyOTP = async (phoneNumber, otp) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would call your backend API
  // For demo purposes, we'll accept '123456' as valid OTP
  const isValid = otp === '123456' || otp === '000000'
  
  return {
    success: isValid,
    message: isValid ? 'OTP verified successfully' : 'Invalid OTP'
  }
}


