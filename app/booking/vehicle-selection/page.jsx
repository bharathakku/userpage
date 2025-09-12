'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Clock, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function VehicleSelectionPage() {
  const router = useRouter()
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const vehicles = [
    {
      id: 'pickup-medium',
      type: 'Medium Pickup',
      subtitle: 'Heavy Duty',
      distance: '7.3 km',
      time: '8 mins',
      capacity: 'Up to 1000 kg',
      description: 'Perfect for medium to large deliveries',
      price: 280,
      originalPrice: 320,
      image: '/images/pickup-truck-flaticon.png',
      available: true,
      estimatedTime: '8-12 mins'
    },
    {
      id: 'heavy-truck',
      type: 'Heavy Truck',
      subtitle: 'Heavy Duty Truck',
      distance: '4.0 km',
      time: '12 mins',
      capacity: 'Up to 750 kg',
      description: 'Ideal for furniture, appliances & bulk items',
      price: 495,
      originalPrice: 520,
      image: 'https://cdn-icons-png.flaticon.com/512/870/870130.png',
      available: true,
      estimatedTime: '12-18 mins'
    },
    {
      id: 'pickup-small',
      type: 'Small Pickup',
      subtitle: 'Compact & Efficient',
      distance: '5.2 km',
      time: '15 mins',
      capacity: 'Up to 500 kg',
      description: 'Great for small deliveries',
      price: 180,
      originalPrice: 210,
      image: 'https://cdn-icons-png.flaticon.com/512/6179/6179815.png',
      available: true,
      estimatedTime: '15-20 mins'
    }
  ]

  const handleProceed = () => {
    if (selectedVehicle) {
      router.push('/booking/review')
    }
  }

  const handleEditLocation = () => {
    router.push('/booking/address')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/booking/address">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Select Vehicle</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Add Stop
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEditLocation}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Locations
            </Button>
          </div>
        </div>

        {/* Address Summary */}
        <Card className="mb-6 shadow-lg border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Rohit Niwas, Sola</p>
                  <p className="text-sm text-gray-600">Pick up location</p>
                </div>
              </div>
              <div className="ml-6 border-l-2 border-gray-200 h-6"></div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Ashoka Arcade, Sola Road</p>
                  <p className="text-sm text-gray-600">Drop location</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Options */}
        <div className="space-y-3 mb-20">
          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle === vehicle.id
            
            return (
              <Card 
                key={vehicle.id}
                className={`cursor-pointer transition-all duration-200 border ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Vehicle Image */}
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.type}
                          width={45}
                          height={45}
                          className="w-11 h-11 object-contain"
                          unoptimized
                        />
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.type}</h3>
                          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                            {vehicle.subtitle}
                          </p>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Capacity:</span>
                            <span>{vehicle.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">ETA:</span>
                            <span>{vehicle.estimatedTime}</span>
                          </div>
                          <p className="text-gray-600 mt-1">{vehicle.description}</p>
                        </div>
                        
                        {!vehicle.available && (
                          <div className="mt-2">
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="mb-1">
                        {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                          <div className="text-sm text-gray-500 line-through">₹{vehicle.originalPrice}</div>
                        )}
                        <div className="text-xl font-bold text-gray-900">₹{vehicle.price}</div>
                      </div>
                      
                      {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                        <div className="text-xs text-green-600 font-medium">
                          Save ₹{vehicle.originalPrice - vehicle.price}
                        </div>
                      )}
                      
                      {isSelected && (
                        <div className="text-sm text-blue-600 font-medium mt-2 bg-blue-100 px-2 py-1 rounded-full">
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Proceed Button */}
        <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto">
          <Card className="shadow-2xl border-gray-200">
            <CardContent className="p-4">
              <Button 
                onClick={handleProceed}
                disabled={!selectedVehicle}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedVehicle 
                  ? `Continue with ${vehicles.find(v => v.id === selectedVehicle)?.type || 'Vehicle'}` 
                  : 'Select a Vehicle to Continue'
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
