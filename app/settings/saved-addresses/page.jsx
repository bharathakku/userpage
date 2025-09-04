'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Home, 
  Building2, 
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SavedAddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Home Address',
      address: '12 Bagh Street, Chanakyapuri, GA - 403501',
      phone: '+91 9876543210',
      isDefault: true,
      icon: Home
    },
    {
      id: 2,
      type: 'Office',
      name: 'Office Address',
      address: '115 India Buildings Fort, TN - 600001',
      phone: '+91 9876543210',
      isDefault: false,
      icon: Building2
    }
  ])

  const handleBack = () => {
    router.back()
  }

  const handleAddAddress = () => {
    // Navigate to add address page
    console.log('Add new address')
  }

  const handleEditAddress = (addressId) => {
    console.log('Edit address:', addressId)
  }

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId))
  }

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Saved Addresses</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Manage your shipping addresses
        </p>

        {/* Add Address Button */}
        <Card className="mb-4 border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer" onClick={handleAddAddress}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add New Address</span>
            </div>
          </CardContent>
        </Card>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Address Icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <address.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  {/* Address Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{address.name}</h3>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{address.address}</p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address.id)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Set as Default
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no addresses) */}
        {addresses.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
              <p className="text-gray-600 mb-4">
                Add your frequently used addresses for faster booking
              </p>
              <Button onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
