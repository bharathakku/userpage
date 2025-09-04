'use client'

import { useState } from 'react'
import { Plus, History, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentsPage() {
  const [walletBalance] = useState(5000)
  const [selectedTab, setSelectedTab] = useState('wallet')

  const paymentHistory = [
    { id: 1, date: '25 Aug 2024', amount: 1000, type: 'credit', status: 'Success', method: 'UPI' },
    { id: 2, date: '20 Aug 2024', amount: 150, type: 'debit', status: 'Success', method: 'Wallet' },
    { id: 3, date: '20 Aug 2024', amount: 500, type: 'credit', status: 'NetBanking', method: 'HDFC' }
  ]

  const addMoneyOptions = [
    { amount: 100, bonus: 0 },
    { amount: 500, bonus: 25 },
    { amount: 1000, bonus: 50 },
    { amount: 2000, bonus: 100 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payments & Wallet</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Manage your wallet, payment methods, and transaction history</p>
          </div>
        </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Wallet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Balance Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Wallet Balance</CardTitle>
                  <CardDescription className="text-blue-100">Available balance</CardDescription>
                </div>
                <Wallet className="h-8 w-8 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">₹{walletBalance.toLocaleString()}</div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className={`h-4 w-4 ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'credit' ? 'Money Added' : 'Payment'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Add Money */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Add Money Card */}
            <Card>
              <CardHeader>
                <CardTitle>Add Money</CardTitle>
                <CardDescription>Choose an amount to add to your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {addMoneyOptions.map((option) => (
                    <Button
                      key={option.amount}
                      variant="outline"
                      className="h-16 flex-col gap-1"
                    >
                      <span className="font-semibold">₹{option.amount}</span>
                      {option.bonus > 0 && (
                        <span className="text-xs text-green-600">+₹{option.bonus} bonus</span>
                      )}
                    </Button>
                  ))}
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <Button className="w-full">Add Money</Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-gray-500">HDFC Bank</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Special Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="font-semibold text-orange-800">Cashback Offer</p>
                  </div>
                  <p className="text-sm text-orange-700">
                    Get 5% cashback on wallet top-ups above ₹500
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
