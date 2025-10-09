'use client'
import { useState } from 'react'
import axios from 'axios'

export default function OtpAuth() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [otpToken, setOtpToken] = useState('')

  const sendOtp = async () => {
    try {
      const res = await axios.post('/api/auth/send-otp', { phone })
      setOtpToken(res.data.token)
      setStep(2)
      setMessage('OTP sent!')
    } catch (e) {
      setMessage(e.response?.data?.error || 'Error sending OTP')
    }
  }

  const verifyOtp = async () => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { token: otpToken, code: otp })
      setMessage('OTP verified! Welcome.')
      // Optionally store token/user in localStorage here
      localStorage.setItem('auth_token', res.data.token)
      localStorage.setItem('user_data', JSON.stringify(res.data.user))
    } catch (e) {
      setMessage(e.response?.data?.error || 'Error verifying OTP')
    }
  }

  return (
    <div>
      {step === 1 && (
        <>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}
      {step === 2 && (
        <>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      <div>{message}</div>
    </div>
  )
}