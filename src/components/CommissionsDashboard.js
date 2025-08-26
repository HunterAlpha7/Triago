'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react'

export default function CommissionsDashboard({ referralId }) {
  const [commissions, setCommissions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (referralId) {
      fetchCommissions()
    }
  }, [referralId, fetchCommissions])

  const fetchCommissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${referralId}/commissions`)
      if (!response.ok) {
        throw new Error('Failed to fetch commissions')
      }
      const data = await response.json()
      setCommissions(data)
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

  if (!commissions) {
    return null
  }

  const { user, summary, byLevel } = commissions

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Commissions Dashboard
        </h2>
        <p className="text-gray-600">
          Track your earnings from the multi-level referral system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.pendingEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.paidEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Commissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalCommissions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Breakdown by Level */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Commission Breakdown by Level
        </h3>
        
        <div className="space-y-4">
          {/* Level 1 */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Level 1 Referrals</p>
                <p className="text-sm text-gray-600">Direct referrals (10% commission)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${byLevel.level1.earnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {byLevel.level1.count} commissions
              </p>
            </div>
          </div>

          {/* Level 2 */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Level 2 Referrals</p>
                <p className="text-sm text-gray-600">Indirect referrals (5% commission)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${byLevel.level2.earnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {byLevel.level2.count} commissions
              </p>
            </div>
          </div>

          {/* Level 3 */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Level 3 Referrals</p>
                <p className="text-sm text-gray-600">Third level referrals (2% commission)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${byLevel.level3.earnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {byLevel.level2.count} commissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Commissions
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissions.commissions.slice(0, 10).map((commission) => (
                <tr key={commission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      commission.level === 1 ? 'bg-blue-100 text-blue-800' :
                      commission.level === 2 ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      Level {commission.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.purchase.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(commission.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      commission.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      commission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {commissions.commissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No commissions yet. Start referring users to earn commissions!
          </div>
        )}
      </div>
    </div>
  )
}
