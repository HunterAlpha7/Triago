'use client'

import { useState } from 'react'
import { ShoppingCart, CheckCircle, DollarSign } from 'lucide-react'

export default function CoursePurchase() {
  const [formData, setFormData] = useState({
    userId: '',
    courseId: '',
    courseName: '',
    amount: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create purchase')
      }

      setSuccess(true)
      setFormData({
        userId: '',
        courseId: '',
        courseName: '',
        amount: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Purchase Created Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Commissions have been automatically calculated for all referral levels.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Another Purchase
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <ShoppingCart className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          Simulate Course Purchase
        </h2>
      </div>

      <p className="text-gray-600 mb-6">
        This form simulates a course purchase and automatically calculates commissions for all referral levels.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User Referral ID *
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter the user's referral ID (e.g., johnsmith)"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is the user making the purchase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Course ID *
            </label>
            <input
              type="text"
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="course-001"
            />
          </div>

          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Advanced JavaScript"
            />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Course Price ($) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="99.99"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing Purchase...' : 'Create Purchase'}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">Commission Calculation:</h4>
        <div className="text-sm text-green-700 space-y-2">
          <div className="flex items-center justify-between">
            <span>Level 1 (Direct referral):</span>
            <span className="font-medium">10% commission</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Level 2 (Indirect referral):</span>
            <span className="font-medium">5% commission</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Level 3 (Third level):</span>
            <span className="font-medium">2% commission</span>
          </div>
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs">
              Commissions are automatically calculated and distributed when a purchase is made.
              Each level in the referral chain receives their respective commission percentage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
