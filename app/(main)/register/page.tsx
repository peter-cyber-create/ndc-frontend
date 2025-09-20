'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, Mail, Phone, Building, MapPin, Upload, CheckCircle, 
  AlertCircle, Loader2, CreditCard, Award, Users, Target, Heart, Shield, Globe, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PaymentInformation from '@/components/PaymentInformation'
import { useToast } from '@/hooks/useToast'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  institution: string
  position: string
  country: string
  city: string
  selected_package: string
  paymentProof: File | null
  passportPhoto: File | null
}

const registrationTypes = [
  {
    id: 'undergrad',
    name: 'Undergraduate Student',
    price: 100000,
    currency: 'UGX',
    description: 'For undergraduate students',
    icon: Users,
    color: 'blue',
    features: ['Conference access', 'Lunch included', 'Certificate of participation']
  },
  {
    id: 'grad',
    name: 'Graduate Student',
    price: 150000,
    currency: 'UGX',
    description: 'For graduate students',
    icon: Award,
    color: 'green',
    features: ['Conference access', 'Lunch included', 'Certificate of participation', 'Networking session']
  },
  {
    id: 'local',
    name: 'Local Professional',
    price: 350000,
    currency: 'UGX',
    description: 'For Uganda / East Africa participants (non-students)',
    icon: Building,
    color: 'purple',
    features: ['Full conference access', 'All meals included', 'Certificate', 'Networking', 'Workshop access']
  },
  {
    id: 'international',
    name: 'International Professional',
    price: 300,
    currency: 'USD',
    description: 'For international delegates',
    icon: Target,
    color: 'orange',
    features: ['Full conference access', 'All meals included', 'Certificate', 'Networking', 'Workshop access', 'Cultural tour']
  },
  {
    id: 'online',
    name: 'Virtual Attendance',
    price: 180000,
    currency: 'UGX',
    description: 'Online participation only',
    icon: Heart,
    color: 'pink',
    features: ['Live streaming access', 'Digital materials', 'Online networking', 'Digital certificate']
  }
]

export default function RegisterPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    position: '',
    country: '',
    city: '',
    selected_package: 'local',
    paymentProof: null,
    passportPhoto: null
  })

  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  }>({ type: null, title: '', message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
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

  const handlePassportPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev: any) => ({
      ...prev,
      passportPhoto: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult({ type: null, title: '', message: '' })

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.institution || !formData.position || 
        !formData.country || !formData.city || !formData.selected_package || !formData.paymentProof || !formData.passportPhoto) {
      error('Please fill in all required fields and upload both payment proof and passport photo.')
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('institution', formData.institution)
      formDataToSend.append('position', formData.position)
      formDataToSend.append('country', formData.country)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('registrationType', formData.selected_package)
      formDataToSend.append('paymentProof', formData.paymentProof)
      formDataToSend.append('passportPhoto', formData.passportPhoto)

      const response = await fetch('/api/registrations', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        success('Submission Successful! Registration submitted successfully. We will review your payment and contact you within 24-48 hours.')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          institution: '',
          position: '',
          country: '',
          city: '',
          selected_package: 'local',
          paymentProof: null,
          passportPhoto: null
        })
      } else {
        const errorMessage = result.error || result.message || 'Please check your information and try again.'
        error('Submission Failed: ' + errorMessage)
      }
    } catch (err) {
      error('Submission Failed: Could not connect to the server. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPackage = registrationTypes.find(pkg => pkg.id === formData.selected_package)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Registration Form</h1>
          <p className="text-lg text-gray-600">National Conference 2025</p>
        </div>

        {/* Registration Packages */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Categories</h2>
            <p className="text-gray-600">Select the appropriate registration category for your participation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {registrationTypes.map((type) => {
              const IconComponent = type.icon
              const isSelected = formData.selected_package === type.id
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 shadow-lg ${
                    isSelected ? 'ring-2 ring-primary-600 shadow-xl bg-gradient-to-br from-primary-50 to-primary-100' : 'bg-white hover:shadow-xl'
                  }`}
                  onClick={() => setFormData((prev: any) => ({ ...prev, selected_package: type.id }))}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center shadow-md ${
                      isSelected ? `bg-${type.color}-500` : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <CardDescription className="text-sm">{type.description}</CardDescription>
                    <div className="text-2xl font-bold text-gray-900 mt-2">{type.currency} {type.price.toLocaleString()}</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <User className="h-6 w-6 mr-3" />
                Registration Form
              </CardTitle>
              <CardDescription className="text-primary-100">
                Complete all required fields below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {submitResult.type && (
                <div className={`mb-6 p-4 rounded-lg border-2 ${
                  submitResult.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {submitResult.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 mr-3" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3" />
                    )}
                    <div>
                      <h3 className="font-semibold">{submitResult.title}</h3>
                      <p className="text-sm">{submitResult.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Package Display */}
                {selectedPackage && (
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-${selectedPackage.color}-500 rounded-lg flex items-center justify-center shadow-sm`}>
                          <selectedPackage.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedPackage.name}</h4>
                          <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600">{selectedPackage.currency} {selectedPackage.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Amount</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Include country code (e.g., +256)"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary-600" />
                    Professional Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium text-gray-700">Institution/Organization *</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Enter your institution or organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">Position/Title *</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Enter your position or title"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary-600" />
                    Location Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                        placeholder="Enter your country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Proof Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary-600" />
                    Payment Verification
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentProof" className="text-sm font-medium text-gray-700">Payment Proof Document *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors bg-gray-50 hover:bg-primary-50">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        PDF, JPG, or PNG files only. Maximum size: 5MB
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
                      <Label
                        htmlFor="paymentProof"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        Choose File
                      </Label>
                      {formData.paymentProof && (
                        <p className="text-sm text-green-600 mt-3 font-medium">
                          Selected: {formData.paymentProof.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Passport Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary-600" />
                    Passport Photo
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passportPhoto" className="text-sm font-medium text-gray-700">Passport Photo *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors bg-gray-50 hover:bg-primary-50">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        JPG or PNG files only. Maximum size: 5MB
                      </p>
                      <input
                        type="file"
                        id="passportPhoto"
                        name="passportPhoto"
                        onChange={handlePassportPhotoChange}
                        accept=".jpg,.jpeg,.png"
                        required
                        className="hidden"
                      />
                      <Label
                        htmlFor="passportPhoto"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        Choose Photo
                      </Label>
                      {formData.passportPhoto && (
                        <p className="text-sm text-green-600 mt-3 font-medium">
                          Selected: {formData.passportPhoto.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-80 h-14 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-primary-600 hover:border-primary-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <Shield className="h-6 w-6 mr-3" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-center text-gray-600 mt-4 text-sm">
                  By submitting this form, you agree to the conference terms and conditions.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <div className="space-y-6">
            <PaymentInformation 
              type="registration" 
              selectedPackage={formData.selected_package}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
