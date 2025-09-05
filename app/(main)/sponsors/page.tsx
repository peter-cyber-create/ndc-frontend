'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, User, Mail, Phone, Package, CheckCircle, 
  AlertCircle, Loader2, Star, Award, Shield, Zap
} from 'lucide-react'

export default function SponsorsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    selected_package: 'bronze'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Sponsorship application submitted successfully!')
        setFormData({
          company_name: '',
          contact_person: '',
          email: '',
          phone: '',
          selected_package: 'bronze'
        })
      } else {
        alert(`Submission failed: ${result.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Error submitting sponsorship:', error)
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const packages = [
    {
      id: 'platinum',
      name: 'Platinum',
      price: '$10,000',
      features: [
        'Logo on all conference materials',
        'Keynote speaking opportunity',
        'Exhibition booth (prime location)',
        '10 complimentary registrations',
        'Welcome reception sponsorship',
        'Conference bag sponsorship',
        'Mobile app banner',
        'Social media mentions'
      ],
      color: 'from-gray-100 to-gray-200',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300'
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '$5,000',
      features: [
        'Logo on conference materials',
        'Exhibition booth',
        '5 complimentary registrations',
        'Coffee break sponsorship',
        'Conference bag insert',
        'Mobile app mention',
        'Social media recognition'
      ],
      color: 'from-yellow-100 to-yellow-200',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '$2,500',
      features: [
        'Logo on conference website',
        'Exhibition space',
        '3 complimentary registrations',
        'Lunch sponsorship',
        'Conference materials mention',
        'Social media acknowledgment'
      ],
      color: 'from-gray-100 to-gray-200',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      id: 'bronze',
      name: 'Bronze',
      price: '$1,000',
      features: [
        'Logo on conference website',
        '2 complimentary registrations',
        'Conference materials mention',
        'Social media acknowledgment'
      ],
      color: 'from-orange-100 to-orange-200',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Sponsor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in making the National Digital Health Conference 2025 a success. 
              Choose from our sponsorship packages and showcase your organization to 
              healthcare professionals, policymakers, and technology leaders.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sponsorship Packages */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sponsorship Packages</h2>
            <div className="space-y-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-gradient-to-r ${pkg.color} rounded-lg p-6 border-2 ${pkg.borderColor} ${
                    formData.selected_package === pkg.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${pkg.textColor}`}>
                        {pkg.name} Package
                      </h3>
                      <p className={`text-3xl font-bold ${pkg.textColor}`}>
                        {pkg.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pkg.id === 'platinum' && <Star className="h-6 w-6 text-yellow-500" />}
                      {pkg.id === 'gold' && <Award className="h-6 w-6 text-yellow-600" />}
                      {pkg.id === 'silver' && <Shield className="h-6 w-6 text-gray-500" />}
                      {pkg.id === 'bronze' && <Zap className="h-6 w-6 text-orange-500" />}
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <span className={`${pkg.textColor} text-sm`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, selected_package: pkg.id }))}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      formData.selected_package === pkg.id
                        ? 'bg-blue-600 text-white'
                        : `${pkg.textColor} bg-white hover:bg-gray-50`
                    }`}
                  >
                    {formData.selected_package === pkg.id ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Apply for Sponsorship</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Selected Package Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Package
                  </label>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-lg font-semibold text-blue-800 capitalize">
                        {formData.selected_package} Package
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Submitting Application...
                    </div>
                  ) : (
                    'Submit Sponsorship Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
