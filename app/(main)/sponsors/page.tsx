'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, User, Mail, Phone, Package, CheckCircle, 
  AlertCircle, Loader2, Star, Award, Shield, Zap, Upload, CreditCard
} from 'lucide-react'
import PaymentInformation from '@/components/PaymentInformation'

interface FormData {
  company_name: string
  contact_person: string
  email: string
  phone: string
  selected_package: string
  paymentProof: File | null
}

const sponsorshipPackages = [
  {
    id: 'bronze',
    name: 'Bronze Package',
    price: 1000,
    description: 'Perfect for small businesses and startups',
    icon: Star,
    color: 'yellow',
    features: [
      'Logo on website',
      'Social media mention',
      '1 conference pass',
      'Basic booth space'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Package',
    price: 2500,
    description: 'Great for growing companies',
    icon: Award,
    color: 'gray',
    features: [
      'Logo on website and materials',
      'Social media promotion',
      '2 conference passes',
      'Premium booth space',
      'Welcome reception access'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Package',
    price: 5000,
    description: 'Ideal for established organizations',
    icon: Shield,
    color: 'yellow',
    features: [
      'Prominent logo placement',
      'Dedicated social media campaign',
      '5 conference passes',
      'Prime booth location',
      'Welcome reception access',
      'Speaking opportunity'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Package',
    price: 10000,
    description: 'Maximum visibility and impact',
    icon: Zap,
    color: 'purple',
    features: [
      'Title sponsor recognition',
      'Comprehensive marketing campaign',
      '10 conference passes',
      'Largest booth space',
      'Welcome reception access',
      'Keynote speaking slot',
      'Custom branding opportunities'
    ]
  }
]

export default function SponsorsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    selected_package: 'bronze',
    paymentProof: null
  })

  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  }>({ type: null, title: '', message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev: any) => ({
      ...prev,
      paymentProof: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult({ type: null, title: '', message: '' })

    // Validate required fields
    if (!formData.company_name || !formData.contact_person || !formData.email || 
        !formData.phone || !formData.selected_package || !formData.paymentProof) {
      setSubmitResult({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields and upload payment proof.'
      })
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('company_name', formData.company_name)
      formDataToSend.append('contact_person', formData.contact_person)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('selected_package', formData.selected_package)
      formDataToSend.append('paymentProof', formData.paymentProof)

      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          type: 'success',
          title: 'Sponsorship Application Successful!',
          message: 'Thank you for your sponsorship application! We will review it and get back to you within 2-3 business days.'
        })
        setFormData({
          company_name: '',
          contact_person: '',
          email: '',
          phone: '',
          selected_package: 'bronze',
          paymentProof: null
        })
      } else {
        const errorMessage = result.error || result.message || 'Sponsorship application failed. Please try again.'
        setSubmitResult({
          type: 'error',
          title: 'Application Failed',
          message: errorMessage
        })
      }
    } catch (error) {
      setSubmitResult({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the server. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPackage = sponsorshipPackages.find(pkg => pkg.id === formData.selected_package)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Sponsor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partner with us for the National Digital Health Conference 2025 and showcase your brand to industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sponsorship Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-600 rounded-lg mr-4">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sponsorship Application</h2>
            </div>

            {submitResult.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitResult.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {submitResult.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <div>
                    <h3 className="font-semibold">{submitResult.title}</h3>
                    <p className="text-sm mt-1">{submitResult.message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Company Information
                </h3>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Select Sponsorship Package *
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {sponsorshipPackages.map((pkg) => {
                    const IconComponent = pkg.icon
                    const isSelected = formData.selected_package === pkg.id
                    return (
                      <div
                        key={pkg.id}
                        className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? `border-${pkg.color}-500 bg-${pkg.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData((prev: any) => ({ ...prev, selected_package: pkg.id }))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${
                              isSelected ? `bg-${pkg.color}-600` : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`h-6 w-6 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{pkg.name}</h4>
                              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                              <div className="space-y-2">
                                {pkg.features.map((feature, index) => (
                                  <div key={index} className="flex items-center text-sm">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="text-gray-700">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">${pkg.price.toLocaleString()}</div>
                            {isSelected && (
                              <div className="mt-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Payment Proof *
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your payment proof (PDF, JPG, PNG)
                  </p>
                  <input
                    type="file"
                    id="paymentProof"
                    name="paymentProof"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="hidden"
                  />
                  <label
                    htmlFor="paymentProof"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                  {formData.paymentProof && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.paymentProof.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Sponsorship Application'
                )}
              </button>
            </form>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            <PaymentInformation 
              type="sponsorship" 
              selectedPackage={formData.selected_package}
            />
            
            {/* Sponsorship Summary */}
            {selectedPackage && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sponsorship Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-2xl text-purple-600">${selectedPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-500">
                      <strong>Includes:</strong> {selectedPackage.features.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}