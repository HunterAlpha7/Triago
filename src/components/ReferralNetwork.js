'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react'

export default function ReferralNetwork({ referralId }) {
  const [network, setNetwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (referralId) {
      fetchReferralNetwork()
    }
  }, [referralId])

  const fetchReferralNetwork = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${referralId}/referrals`)
      if (!response.ok) {
        throw new Error('Failed to fetch referral network')
      }
      const data = await response.json()
      setNetwork(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (!network) {
    return null
  }

  const { user, levels, stats } = network

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-sm text-gray-500">Referral ID: {user.referralId}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{stats.totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Level 1</p>
              <p className="text-2xl font-bold text-gray-900">{stats.level1Count}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Level 2</p>
              <p className="text-2xl font-bold text-gray-900">{stats.level2Count}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Level 3</p>
              <p className="text-2xl font-bold text-gray-900">{stats.level3Count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Network Visualization */}
      <div className="space-y-8">
        {/* Level 1 - Direct Referrals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            Level 1 Referrals (10% Commission)
            <span className="ml-2 text-sm text-gray-500">({levels.level1.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.level1.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} level={1} />
            ))}
            {levels.level1.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No Level 1 referrals yet
              </div>
            )}
          </div>
        </div>

        {/* Level 2 - Indirect Referrals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlus className="h-5 w-5 text-green-600 mr-2" />
            Level 2 Referrals (5% Commission)
            <span className="ml-2 text-sm text-gray-500">({levels.level2.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.level2.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} level={2} />
            ))}
            {levels.level2.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No Level 2 referrals yet
              </div>
            )}
          </div>
        </div>

        {/* Level 3 - Third Level Referrals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
            Level 3 Referrals (2% Commission)
            <span className="ml-2 text-sm text-gray-500">({levels.level3.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.level3.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} level={3} />
            ))}
            {levels.level3.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No Level 3 referrals yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReferralCard({ referral, level }) {
  const levelColors = {
    1: 'border-blue-200 bg-blue-50',
    2: 'border-green-200 bg-green-50',
    3: 'border-purple-200 bg-purple-50'
  }

  const levelIcons = {
    1: Users,
    2: UserPlus,
    3: TrendingUp
  }

  const Icon = levelIcons[level]

  return (
    <div className={`border rounded-lg p-4 ${levelColors[level]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${
            level === 1 ? 'text-blue-600' : 
            level === 2 ? 'text-green-600' : 'text-purple-600'
          }`} />
          <span className="ml-2 text-sm font-medium text-gray-600">
            Level {level}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(referral.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="font-medium text-gray-900">
            {referral.firstName} {referral.lastName}
          </p>
          <p className="text-sm text-gray-600">@{referral.username}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Referral ID:</span>
          <span className="font-mono font-medium text-gray-900">
            {referral.referralId}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Their referrals:</span>
          <span className="font-medium text-gray-900">
            {referral.referralCount}
          </span>
        </div>
      </div>
    </div>
  )
}
