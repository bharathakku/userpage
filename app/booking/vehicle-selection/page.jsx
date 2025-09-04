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
      id: 'ramesh-bike',
      name: 'Ramesh',
      vehicleNumber: '7547201177',
      type: '2 Wheeler',
      distance: '7.3 km',
      time: '7 mins',
      price: 110,
      image: 'https://cdn-icons-png.flaticon.com/512/9561/9561839.png',
      rating: 4.8
    },
    {
      id: 'james-truck',
      name: 'JAMES',
      vehicleNumber: '6456551326',
      type: 'Tata Ace',
      distance: '4.0 km',
      time: '12 mins',
      description: '(25 Kg • 2.5 mtrs)',
      price: 495,
      image: 'https://cdn-icons-png.flaticon.com/512/870/870130.png',
      rating: 4.9
    },
    {
      id: 'wheeler-truck',
      name: 'Arjun',
      vehicleNumber: '9876543210',
      type: '3 Wheeler',
      distance: '5.2 km',
      time: '15 mins',
      description: '(68 Kg • 20 mtrs)',
      price: 407,
      image: 'https://cdn-icons-png.flaticon.com/512/6179/6179815.png',
      rating: 4.7
    },
    {
      id: 'suresh-bike',
      name: 'Suresh',
      vehicleNumber: '8547201234',
      type: '2 Wheeler',
      distance: '6.1 km',
      time: '9 mins',
      price: 125,
      image: 'https://cdn-icons-png.flaticon.com/512/9561/9561839.png',
      rating: 4.6
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Vehicle Image */}
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.type}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                          unoptimized
                        />
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{vehicle.name}</h3>
                          <span className="text-sm text-gray-500">• {vehicle.vehicleNumber}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-700">{vehicle.type}</span>
                          {vehicle.description && (
                            <span className="text-sm text-gray-500">{vehicle.description}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{vehicle.distance} • {vehicle.time}</span>
                          {vehicle.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span>{vehicle.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-gray-900">₹{vehicle.price}</div>
                      {isSelected && (
                        <div className="text-sm text-blue-600 font-medium mt-1">Selected</div>
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
