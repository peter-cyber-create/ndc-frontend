'use client'

import React from 'react'
import { CreditCard, Banknote, Clock, CheckCircle, AlertCircle, Shield, Download, Phone, Mail, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentInstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-6">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
            Payment Instructions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete your conference registration, sponsorship, or exhibition application by following these payment instructions.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Bank Transfer */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Banknote className="h-8 w-8 mr-3" />
                Bank Transfer
              </CardTitle>
              <CardDescription className="text-primary-100 text-lg">
                Recommended payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* UGX Account */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-primary-600" />
                    UGX Account
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Account Title:</span>
                      <span className="font-mono text-gray-900">MU SPH Research Account</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Account Number:</span>
                      <span className="font-mono text-gray-900">9030005611449</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Bank:</span>
                      <span className="font-mono text-gray-900">Stanbic Bank Uganda Limited</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Branch:</span>
                      <span className="font-mono text-gray-900">Corporate Branch</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-gray-700">Swift Code:</span>
                      <span className="font-mono text-gray-900">SBICUGKX</span>
                    </div>
                  </div>
                </div>

                {/* USD Account */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-blue-600" />
                    USD Account
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-semibold text-gray-700">Intermediary Bank:</span>
                      <span className="font-mono text-gray-900">Citibank New York</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-semibold text-gray-700">Address:</span>
                      <span className="font-mono text-gray-900">New York, NY</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-semibold text-gray-700">USD Account:</span>
                      <span className="font-mono text-gray-900">36110279</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-semibold text-gray-700">SWIFT:</span>
                      <span className="font-mono text-gray-900">CITIUS33</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-gray-700">ABA Number:</span>
                      <span className="font-mono text-gray-900">021000089</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Guidelines */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <CheckCircle className="h-8 w-8 mr-3" />
                Payment Guidelines
              </CardTitle>
              <CardDescription className="text-primary-100 text-lg">
                Important information for successful payment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Important Instructions */}
                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-yellow-800 mb-3">Important Payment Instructions</h4>
                      <ul className="text-yellow-700 space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Use your full name as the payment reference</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Upload payment proof immediately after transfer</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Payment must be made within 24 hours of registration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Contact us if you need assistance with payment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Processing Time */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-blue-800 mb-2">Processing Time</h4>
                      <p className="text-blue-700">
                        Payment verification typically takes 1-2 business days. You can track your application status in your email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-green-800 mb-2">Payment Confirmation</h4>
                      <p className="text-green-700">
                        Your payment will be verified within 24-48 hours. You'll receive a confirmation email once approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package Pricing */}
        <Card className="mb-16 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Package Pricing</CardTitle>
            <CardDescription className="text-primary-100 text-lg text-center">
              Choose the package that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Registration Packages */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">Registration Packages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Undergraduate Student</span>
                    <span className="font-bold text-green-600">$50</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Graduate Student</span>
                    <span className="font-bold text-green-600">$75</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Local Professional</span>
                    <span className="font-bold text-green-600">$100</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">International Professional</span>
                    <span className="font-bold text-green-600">$200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Virtual Attendance</span>
                    <span className="font-bold text-green-600">$25</span>
                  </div>
                </div>
              </div>

              {/* Sponsorship Packages */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">Sponsorship Packages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Bronze Sponsor</span>
                    <span className="font-bold text-blue-600">$1,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Silver Sponsor</span>
                    <span className="font-bold text-blue-600">$2,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Gold Sponsor</span>
                    <span className="font-bold text-blue-600">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Platinum Sponsor</span>
                    <span className="font-bold text-blue-600">$10,000</span>
                  </div>
                </div>
              </div>

              {/* Exhibition Packages */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">Exhibition Packages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Non-Profit Table</span>
                    <span className="font-bold text-purple-600">$2,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Bronze Exhibitor</span>
                    <span className="font-bold text-purple-600">$4,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Silver Exhibitor</span>
                    <span className="font-bold text-purple-600">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Gold Exhibitor</span>
                    <span className="font-bold text-purple-600">$7,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Platinum Exhibitor</span>
                    <span className="font-bold text-purple-600">$10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Need Help?</CardTitle>
            <CardDescription className="text-gray-300 text-lg text-center">
              If you have any questions about payment or need assistance, please contact us
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-300">moh.conference@health.go.ug</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-300">+256 700 000 000</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-300">Mon-Fri, 9:00 AM - 5:00 PM EAT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

