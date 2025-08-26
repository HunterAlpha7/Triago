'use client'

import { useState } from 'react'
import { Users, DollarSign, ShoppingCart, BarChart3, UserPlus } from 'lucide-react'
import ReferralNetwork from '@/components/ReferralNetwork'
import CommissionsDashboard from '@/components/CommissionsDashboard'
import UserRegistration from '@/components/UserRegistration'
import CoursePurchase from '@/components/CoursePurchase'

export default function Home() {
  const [activeTab, setActiveTab] = useState('network')
  const [currentReferralId, setCurrentReferralId] = useState('johnsmith')

  const tabs = [
    {
      id: 'network',
      name: 'Referral Network',
      icon: Users,
      description: 'View your multi-level referral tree'
    },
    {
      id: 'commissions',
      name: 'Commissions',
      icon: DollarSign,
      description: 'Track your earnings and commission history'
    },
    {
      id: 'register',
      name: 'Add Users',
      icon: UserPlus,
      description: 'Register new users to the referral system'
    },
    {
      id: 'purchase',
      name: 'Simulate Purchase',
      icon: ShoppingCart,
      description: 'Test commission calculations with course purchases'
    }
  ]

  const handleReferralIdChange = (e) => {
    setCurrentReferralId(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Triago: Multi-level Referral System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="referralId" className="text-sm font-medium text-gray-700">
                View User:
              </label>
              <input
                type="text"
                id="referralId"
                value={currentReferralId}
                onChange={handleReferralIdChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter referral ID"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'network' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Referral Network
              </h2>
              <p className="text-gray-600">
                View the complete referral network for user: <span className="font-mono font-medium text-blue-600">{currentReferralId}</span>
              </p>
            </div>
            <ReferralNetwork referralId={currentReferralId} />
          </div>
        )}

        {activeTab === 'commissions' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Commissions Dashboard
              </h2>
              <p className="text-gray-600">
                Track earnings and commission history for user: <span className="font-mono font-medium text-blue-600">{currentReferralId}</span>
              </p>
            </div>
            <CommissionsDashboard referralId={currentReferralId} />
          </div>
        )}

        {activeTab === 'register' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                User Registration
              </h2>
              <p className="text-gray-600">
                Add new users to the referral system. Each user can refer up to 5 others.
              </p>
            </div>
            <UserRegistration />
          </div>
        )}

        {activeTab === 'purchase' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Course Purchase Simulation
              </h2>
              <p className="text-gray-600">
                Simulate course purchases to test the automatic commission calculation system.
              </p>
            </div>
            <CoursePurchase />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              Multi-Level Referral System • Commission rates: Level 1 (10%), Level 2 (5%), Level 3 (2%)
            </p>
            <p className="text-xs mt-2">
              Each user can refer up to 5 direct users. Commissions are automatically calculated on course purchases.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
