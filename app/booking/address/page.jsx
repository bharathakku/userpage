'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Plus, Navigation, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddressSelectionPage() {
  const router = useRouter()
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropAddress, setDropAddress] = useState('')
  const [selectedPickupId, setSelectedPickupId] = useState(null)
  const [selectedDropId, setSelectedDropId] = useState(null)
  const [savedAddresses] = useState([
    { id: 1, type: 'Home', address: 'Rohit Niwas, Sola', isRecent: false },
    { id: 2, type: 'Office', address: 'Ashoka Arcade, Sola Road', isRecent: true },
    { id: 3, type: 'Shop', address: 'High Court Road, Ashika Drive, Sola2, Kareli', isRecent: false },
  ])

  const handleSelectPickupAddress = (address) => {
    setPickupAddress(address.address)
    setSelectedPickupId(address.id)
  }

  const handleSelectDropAddress = (address) => {
    setDropAddress(address.address)
    setSelectedDropId(address.id)
  }

  const handleProceed = () => {
    if (pickupAddress && dropAddress) {
      router.push('/booking/vehicle-selection')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Select Addresses</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Address Forms */}
          <div className="space-y-6">
            {/* Pick Up Address */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Pick Up From</h3>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Enter pickup address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>

                {pickupAddress && (
                  <div className="mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Change
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 mb-2">Saved Addresses</h4>
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        selectedPickupId === address.id ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      onClick={() => handleSelectPickupAddress(address)}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`h-4 w-4 ${
                          selectedPickupId === address.id ? 'text-green-600' : 'text-gray-500'
                        }`} />
                        <div>
                          <p className={`font-medium text-sm ${
                            selectedPickupId === address.id ? 'text-green-800' : 'text-gray-900'
                          }`}>{address.type}</p>
                          <p className={`text-sm ${
                            selectedPickupId === address.id ? 'text-green-700' : 'text-gray-600'
                          }`}>{address.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {address.isRecent && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Recent
                          </span>
                        )}
                        {selectedPickupId === address.id && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drop Address */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Drop To</h3>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Enter drop address"
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>

                {dropAddress && (
                  <div className="mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Change
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 mb-2">Saved Addresses</h4>
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        selectedDropId === address.id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      onClick={() => handleSelectDropAddress(address)}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`h-4 w-4 ${
                          selectedDropId === address.id ? 'text-red-600' : 'text-gray-500'
                        }`} />
                        <div>
                          <p className={`font-medium text-sm ${
                            selectedDropId === address.id ? 'text-red-800' : 'text-gray-900'
                          }`}>{address.type}</p>
                          <p className={`text-sm ${
                            selectedDropId === address.id ? 'text-red-700' : 'text-gray-600'
                          }`}>{address.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {address.isRecent && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Recent
                          </span>
                        )}
                        {selectedDropId === address.id && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add a saved address
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-gray-200 h-full">
              <CardContent className="p-0 h-full">
                <div className="h-96 lg:h-full rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.4829807823733!2d72.51495461498097!3d23.073584984938785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e83a8ed5b0b9f%3A0x871d2e8da15e3b2f!2sSola%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1704365000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Interactive Map"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Proceed Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="container mx-auto max-w-6xl flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 text-sm font-medium border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              + Add Stop
            </Button>
            <Button 
              onClick={handleProceed}
              disabled={!pickupAddress || !dropAddress}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold text-white"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
