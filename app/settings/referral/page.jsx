'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Gift, 
  Copy, 
  Share2, 
  Users, 
  TrendingUp,
  Calendar,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [referralCode] = useState('RBI-S43')

  const handleBack = () => {
    router.back()
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const shareText = `Join YourDelivery using my referral code ${referralCode} and we both get ₹200! Download the app: https://yourdelivery.com/app`
    
    if (navigator.share) {
      navigator.share({
        title: 'Join YourDelivery',
        text: shareText,
        url: 'https://yourdelivery.com/app'
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
      alert('Referral link copied to clipboard!')
    }
  }

  const referralStats = {
    totalReferred: 3,
    totalEarned: 200,
    pendingEarnings: 50,
    thisMonth: 1
  }

  const referralHistory = [
    {
      id: 1,
      friendName: 'Priya S.',
      joinedDate: '2023-12-10',
      status: 'completed',
      earnings: 200
    },
    {
      id: 2,
      friendName: 'Amit K.',
      joinedDate: '2023-12-08',
      status: 'completed',
      earnings: 200
    },
    {
      id: 3,
      friendName: 'Sneha M.',
      joinedDate: '2023-12-15',
      status: 'pending',
      earnings: 200
    }
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Share your code',
      description: 'Send your unique referral code to friends and family'
    },
    {
      step: 2,
      title: 'They sign up',
      description: 'Your friend creates an account using your code'
    },
    {
      step: 3,
      title: 'First booking',
      description: 'They complete their first successful delivery booking'
    },
    {
      step: 4,
      title: 'Both earn ₹200',
      description: 'You and your friend both receive ₹200 credit'
    }
  ]

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
          <h1 className="text-xl font-semibold text-gray-900">Refer and earn ₹200</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Invite friends and earn
        </p>

        {/* Main Referral Card */}
        <Card className="mb-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Gift className="h-6 w-6" />
              Refer & Earn ₹200
            </CardTitle>
            <p className="text-orange-700 text-sm">
              Share your referral code with friends
            </p>
          </CardHeader>
          <CardContent>
            {/* Referral Code */}
            <div className="bg-white p-4 rounded-lg border border-orange-200 mb-4">
              <p className="text-sm text-gray-600 mb-2">Your referral code</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-2xl text-orange-800">{referralCode}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyReferralCode}
                  className="text-orange-700 border-orange-300 hover:bg-orange-50"
                >
                  {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Share Button */}
            <Button 
              onClick={handleShare}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Referral Code
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferred}</p>
              <p className="text-sm text-gray-600">Friends referred</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">₹{referralStats.totalEarned}</p>
              <p className="text-sm text-gray-600">Total earned</p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {howItWorksSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">{step.step}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            {referralHistory.length > 0 ? (
              <div className="space-y-3">
                {referralHistory.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{referral.friendName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {referral.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {referral.status === 'completed' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Completed</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-orange-600">Pending</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {referral.status === 'completed' ? `+₹${referral.earnings}` : `₹${referral.earnings}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No referrals yet</p>
                <p className="text-sm text-gray-400">Start sharing your code to see your earnings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">Terms & Conditions</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• ₹200 credit for both you and your friend on successful referral</p>
              <p>• Friend must complete their first booking to qualify</p>
              <p>• Credits are non-transferable and valid for 1 year</p>
              <p>• Maximum 10 referrals per month per user</p>
              <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                View detailed terms
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
