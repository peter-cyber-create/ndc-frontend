'use client'

import React from 'react'
import { CreditCard, Banknote, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PaymentInformationProps {
  type: 'registration' | 'sponsorship' | 'exhibition'
  selectedPackage?: string
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ type, selectedPackage }) => {
  const getRegistrationAmount = (registrationType: string): number => {
    const amounts: { [key: string]: number } = {
      'undergrad': 50,
      'grad': 75,
      'local': 100,
      'international': 200,
      'online': 25
    }
    return amounts[registrationType] || 0
  }

  const getSponsorshipAmount = (packageType: string): number => {
    const amounts: { [key: string]: number } = {
      'bronze': 1000,
      'silver': 2500,
      'gold': 5000,
      'platinum': 10000
    }
    return amounts[packageType] || 0
  }

  const getExhibitionAmount = (packageType: string): number => {
    const amounts: { [key: string]: number } = {
      'platinum': 10000,
      'gold': 7000,
      'silver': 5000,
      'bronze': 4000,
      'nonprofit': 2500
    }
    return amounts[packageType] || 0
  }

  const getAmount = () => {
    if (type === 'registration') {
      return selectedPackage ? getRegistrationAmount(selectedPackage) : 0
    } else if (type === 'sponsorship') {
      return selectedPackage ? getSponsorshipAmount(selectedPackage) : 0
    } else if (type === 'exhibition') {
      return selectedPackage ? getExhibitionAmount(selectedPackage) : 0
    }
    return 0
  }

  const amount = getAmount()

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-primary-50 to-primary-100">
      <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <CreditCard className="h-6 w-6 mr-3" />
          Payment Information
        </CardTitle>
        <CardDescription className="text-primary-100">
          Complete your payment to secure your spot
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {amount > 0 && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-primary-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Amount Due:</span>
              <span className="text-2xl font-bold text-primary-600">${amount.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500">
              {type === 'registration' ? 'Registration Fee' : 
               type === 'sponsorship' ? `${selectedPackage?.toUpperCase()} Package` :
               type === 'exhibition' ? `${selectedPackage?.toUpperCase()} Exhibition Package` : 'Package'}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Bank Transfer Details */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Banknote className="h-5 w-5 mr-2 text-green-600" />
              Bank Transfer Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">UGX Account</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border text-sm">
                    <div className="font-mono text-gray-900">Account Title: MU SPH Research Account</div>
                    <div className="font-mono text-gray-900">Account Number: 9030005611449</div>
                    <div className="font-mono text-gray-900">Bank: Stanbic Bank Uganda Limited</div>
                    <div className="font-mono text-gray-900">Branch: Corporate Branch</div>
                    <div className="font-mono text-gray-900">Swift Code: SBICUGKX</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">USD Account</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border text-sm">
                    <div className="font-mono text-gray-900">Intermediary Bank: Citibank New York</div>
                    <div className="font-mono text-gray-900">Address: New York, NY</div>
                    <div className="font-mono text-gray-900">USD Account: 36110279</div>
                    <div className="font-mono text-gray-900">SWIFT: CITIUS33</div>
                    <div className="font-mono text-gray-900">ABA Number: 021000089</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Important Payment Instructions</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Use your full name as the payment reference</li>
                  <li>• Upload payment proof immediately after transfer</li>
                  <li>• Payment must be made within 24 hours of registration</li>
                  <li>• Contact us if you need assistance with payment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Confirmation */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Payment Confirmation</h4>
                <p className="text-sm text-green-700">
                  Your payment will be verified within 24-48 hours. You'll receive a confirmation email once approved.
                </p>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">Processing Time</h4>
                <p className="text-sm text-primary-700">
                  Payment verification typically takes 1-2 business days. You can track your application status in your email.
                </p>
              </div>
            </div>
          </div>

          {/* Link to Detailed Instructions */}
          <div className="text-center">
            <Button asChild variant="outline" className="w-full">
              <a href="/payment-instructions" className="flex items-center justify-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Complete Payment Instructions & Package Pricing
              </a>
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 p-4 bg-gray-900 rounded-xl text-white">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm text-gray-300 mb-3">
            If you have any questions about payment or need assistance, please contact us:
          </p>
          <div className="text-sm space-y-1">
            <div>📧 Email: moh.conference@health.go.ug</div>
            <div>📞 Phone: 0800-100-066</div>
            <div>🕒 Hours: Mon-Fri, 9:00 AM - 5:00 PM EAT</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentInformation