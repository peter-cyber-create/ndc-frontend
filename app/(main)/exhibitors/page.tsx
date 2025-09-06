'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, Mail, Phone, MapPin, Upload, CheckCircle, 
  AlertCircle, Loader2, CreditCard, Award, Users, Target, Heart, Shield, Globe, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PaymentInformation from '@/components/PaymentInformation'
import { useToast } from '@/hooks/useToast'

interface FormData {
  organizationName: string
  contactPerson: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  country: string
  selected_package: string
  paymentProof: File | null
  additionalInfo: string
}

const exhibitionPackages = [
  {
    id: 'bronze',
    name: 'Bronze Exhibition',
    price: 4000,
    description: 'Basic exhibition package',
    icon: Building,
    color: 'orange',
    features: ['6x6 booth space', 'Basic booth setup', 'Company listing', 'Conference materials']
  },
  {
    id: 'silver',
    name: 'Silver Exhibition',
    price: 5000,
    description: 'Enhanced exhibition package',
    icon: Award,
    color: 'gray',
    features: ['8x8 booth space', 'Enhanced booth setup', 'Company listing', 'Conference materials', 'Logo on website', 'Social media mention']
  },
  {
    id: 'gold',
    name: 'Gold Exhibition',
    price: 7000,
    description: 'Premium exhibition package',
    icon: Target,
    color: 'yellow',
    features: ['10x10 booth space', 'Premium booth setup', 'Company listing', 'Conference materials', 'Logo on website', 'Social media mention', 'Banner display', 'Recognition in program']
  },
  {
    id: 'platinum',
    name: 'Platinum Exhibition',
    price: 10000,
    description: 'Exclusive exhibition package',
    icon: Heart,
    color: 'purple',
    features: ['12x12 booth space', 'Exclusive booth setup', 'Company listing', 'Conference materials', 'Logo on website', 'Social media mention', 'Banner display', 'Recognition in program', 'Premium location', 'Speaking opportunity']
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit Exhibition',
    price: 2500,
    description: 'Special rate for non-profit organizations',
    icon: Users,
    color: 'green',
    features: ['6x6 booth space', 'Basic booth setup', 'Company listing', 'Conference materials', 'Special recognition']
  }
]

export default function ExhibitorsPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    country: '',
    selected_package: 'bronze',
    paymentProof: null,
    additionalInfo: ''
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.organizationName || !formData.contactPerson || !formData.email || 
        !formData.phone || !formData.address || !formData.city || !formData.country || 
        !formData.selected_package || !formData.paymentProof) {
      showError('Please fill in all required fields and upload payment proof.')
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('organizationName', formData.organizationName)
      formDataToSend.append('contactPerson', formData.contactPerson)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('website', formData.website)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('country', formData.country)
      formDataToSend.append('selected_package', formData.selected_package)
      formDataToSend.append('additionalInfo', formData.additionalInfo)
      formDataToSend.append('paymentProof', formData.paymentProof)

      const response = await fetch('/api/exhibitors', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        success('Exhibition application submitted successfully! We will review your payment and get back to you within 24-48 hours.')
        setFormData({
          organizationName: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          city: '',
          country: '',
          selected_package: 'bronze',
          paymentProof: null,
          additionalInfo: ''
        })
      } else {
        const errorMessage = result.error || result.message || 'Exhibition application failed. Please try again.'
        showError(errorMessage)
      }
    } catch (error) {
      showError('Could not connect to the server. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPackage = exhibitionPackages.find(pkg => pkg.id === formData.selected_package)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Exhibition Application Form</h1>
          <p className="text-lg text-gray-600">National Digital Health Conference 2025</p>
        </div>

        {/* Exhibition Packages */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Exhibition Packages</h2>
            <p className="text-gray-600">Select the exhibition package that best fits your organization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {exhibitionPackages.map((pkg) => {
              const IconComponent = pkg.icon
              const isSelected = formData.selected_package === pkg.id
              return (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 shadow-lg ${
                    isSelected ? 'ring-2 ring-primary-600 shadow-xl bg-gradient-to-br from-primary-50 to-primary-100' : 'bg-white hover:shadow-xl'
                  }`}
                  onClick={() => setFormData((prev: any) => ({ ...prev, selected_package: pkg.id }))}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center shadow-md ${
                      isSelected ? `bg-${pkg.color}-500` : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription className="text-sm">{pkg.description}</CardDescription>
                    <div className="text-2xl font-bold text-gray-900 mt-2">${pkg.price.toLocaleString()}</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {pkg.features.map((feature, index) => (
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
          {/* Exhibition Form */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Building className="h-6 w-6 mr-3" />
                Exhibition Application Form
              </CardTitle>
              <CardDescription className="text-primary-100">
                Complete all required fields below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">

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
                        <div className="text-xl font-bold text-primary-600">${selectedPackage.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Amount</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Organization Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary-600" />
                    Organization Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Enter your organization name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Full name of the contact person"
                    />
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
                        className="h-11"
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
                        className="h-11"
                        placeholder="Include country code (e.g., +256)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website (Optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="h-11"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary-600" />
                    Location Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Enter your organization address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary-600" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us more about your organization and what you plan to exhibit"
                    />
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
                        Processing Application...
                      </>
                    ) : (
                      <>
                        <Shield className="h-6 w-6 mr-3" />
                        Submit Exhibition Application
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
              type="exhibition" 
              selectedPackage={formData.selected_package}
            />
          </div>
        </div>
      </div>
    </div>
  )
}