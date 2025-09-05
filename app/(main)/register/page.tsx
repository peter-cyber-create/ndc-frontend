'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, Mail, Phone, Building, Briefcase, Calendar, 
  CreditCard, Upload, CheckCircle, AlertCircle, Loader2, Star, Shield, Award
} from 'lucide-react'
import PaymentInformation from '@/components/PaymentInformation'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  position: string
  registrationType: string
  paymentProof: File | null
}

const registrationTypes = [
  {
    id: 'undergrad',
    name: 'Undergraduate Student',
    price: 50,
    description: 'For undergraduate students',
    icon: User,
    color: 'blue',
    features: ['Conference access', 'Lunch included', 'Certificate']
  },
  {
    id: 'grad',
    name: 'Graduate Student',
    price: 75,
    description: 'For graduate students',
    icon: Award,
    color: 'green',
    features: ['Conference access', 'Lunch included', 'Certificate', 'Networking session']
  },
  {
    id: 'local',
    name: 'Local Professional',
    price: 100,
    description: 'For local professionals',
    icon: Briefcase,
    color: 'purple',
    features: ['Conference access', 'Lunch included', 'Certificate', 'Networking session', 'Workshop access']
  },
  {
    id: 'international',
    name: 'International Professional',
    price: 200,
    description: 'For international professionals',
    icon: Shield,
    color: 'red',
    features: ['Conference access', 'Lunch included', 'Certificate', 'Networking session', 'Workshop access', 'Welcome dinner']
  },
  {
    id: 'online',
    name: 'Online Participant',
    price: 25,
    description: 'Virtual participation',
    icon: Calendar,
    color: 'indigo',
    features: ['Live streaming access', 'Digital materials', 'Certificate']
  }
]

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    registrationType: 'undergrad',
    paymentProof: null
  })

  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  }>({ type: null, title: '', message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.organization || !formData.position || !formData.registrationType || !formData.paymentProof) {
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
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('organization', formData.organization)
      formDataToSend.append('position', formData.position)
      formDataToSend.append('registrationType', formData.registrationType)
      formDataToSend.append('paymentProof', formData.paymentProof)

      const response = await fetch('/api/registrations', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          type: 'success',
          title: 'Registration Successful!',
          message: 'Thank you for registering! Your registration has been submitted successfully. You will receive a confirmation email shortly.'
        })
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          registrationType: 'undergrad',
          paymentProof: null
        })
      } else {
        const errorMessage = result.error || result.message || 'Registration failed. Please try again.'
        setSubmitResult({
          type: 'error',
          title: 'Registration Failed',
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

  const selectedType = registrationTypes.find(type => type.id === formData.registrationType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for the National Digital Health Conference 2025. Register now to secure your spot!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-600 rounded-lg mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Registration Form</h2>
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
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position/Title *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Registration Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Registration Type *
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {registrationTypes.map((type) => {
                    const IconComponent = type.icon
                    const isSelected = formData.registrationType === type.id
                    return (
                      <div
                        key={type.id}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData((prev: any) => ({ ...prev, registrationType: type.id }))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? `bg-${type.color}-600` : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{type.name}</h4>
                              <p className="text-sm text-gray-600">{type.description}</p>
                              <div className="mt-2">
                                <ul className="text-xs text-gray-500 space-y-1">
                                  {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">${type.price}</div>
                            {isSelected && (
                              <div className="mt-1">
                                <CheckCircle className="h-5 w-5 text-green-500" />
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </form>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            <PaymentInformation 
              type="registration" 
              selectedPackage={formData.registrationType}
            />
            
            {/* Registration Summary */}
            {selectedType && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Type:</span>
                    <span className="font-semibold">{selectedType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-2xl text-blue-600">${selectedType.price}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-500">
                      Includes: {selectedType.features.join(', ')}
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