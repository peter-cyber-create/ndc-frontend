'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Globe, Users, Award, Target, Heart, Shield, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/ScrollReveal'

const partners = [
  {
    name: 'Makerere University School of Public Health (MakSPH)',
    logo: '/images/makCHS-logo-1.png',
    description: 'Makerere University School of Public Health (MakSPH) is a premier institution in Sub-Saharan Africa, renowned for public health training, research, and community engagement. Established in 1954, MakSPH pioneered postgraduate public health education in the region and has grown into a stand-alone school as of 2025, reflecting its outstanding impact and leadership in advancing health in Uganda and beyond.',
    website: '#'
  },
  {
    name: 'Jhpiego',
    logo: '/images/partners/Jhpiego Logo.PNG',
    description: 'Jhpiego is a global non-profit health organization affiliated with Johns Hopkins University, dedicated to improving the health of women and families worldwide.',
    website: ''
  },
  {
    name: 'UgandaCares',
    logo: '/images/partners/UgandaCares.png',
    description: 'UgandaCares is a leading provider of HIV/AIDS prevention, care, and treatment services in Uganda, supporting thousands of individuals and families.',
    website: '#'
  },
  {
    name: 'Infectious Diseases Institute (IDI)',
    logo: '/images/partners/IDI MAK Logo - Copy.png',
    description: 'The Infectious Diseases Institute (IDI) is a leading non-profit national organisation entirely owned by Makerere University. Founded in 2002, IDI is committed to strengthening health systems through research and capacity building to free Africa from the burden of infectious diseases and other emerging and re-emerging health challenges.',
    website: '#'
  },
  {
    name: 'PEPFAR Uganda',
    logo: '/images/partners/PEPFAR-Uganda-tagline (1).jpg',
    description: 'President\'s Emergency Plan for AIDS Relief in Uganda, supporting HIV/AIDS prevention and treatment programs.',
    website: '#'
  },
  {
    name: 'The Global Fund',
    logo: '/images/partners/The Global Fund_Logo_Artwork_Stacked_Colour.png',
    description: 'International financing organization dedicated to fighting AIDS, tuberculosis, and malaria worldwide.',
    website: '#'
  },
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    logo: '/images/partners/CDC.png',
    description: 'U.S. national public health institute, working to protect public health and safety through disease control and prevention.',
    website: '#'
  },
  {
    name: 'Infectious Diseases Research Organisation',
    logo: '/images/partners/IDRC-Logo-480.png',
    description: 'Leading research organization focused on infectious diseases and health system strengthening.',
    website: '#'
  },
  // New Partners - Added from recent logos
  {
    name: 'GAVI, the Vaccine Alliance',
    logo: '/images/partners/GAVI logo.jpeg',
    description: 'GAVI is an international organization that helps vaccinate children in the world\'s poorest countries against deadly and debilitating diseases.',
    website: 'https://www.gavi.org'
  },
  {
    name: 'The Global Fund to Fight AIDS, Tuberculosis and Malaria',
    logo: '/images/partners/Global Fund logo.jpeg',
    description: 'The Global Fund is a partnership designed to accelerate the end of AIDS, tuberculosis and malaria as epidemics.',
    website: 'https://www.theglobalfund.org'
  },
  {
    name: 'Infectious Diseases Institute (IDI) - Makerere University',
    logo: '/images/partners/IDI logo.jpeg',
    description: 'The Infectious Diseases Institute is a leading non-profit national organisation entirely owned by Makerere University, committed to strengthening health systems through research and capacity building.',
    website: 'https://www.idi.co.ug'
  },
  {
    name: 'Malaria Free Uganda',
    logo: '/images/partners/MFU logo.jpeg',
    description: 'Malaria Free Uganda is a leading organization dedicated to eliminating malaria in Uganda through innovative prevention, treatment, and community engagement programs.',
    website: 'https://www.malariafreeuganda.org'
  },
  {
    name: 'Medical Research Council (MRC) Uganda',
    logo: '/images/partners/MRC logo.jpeg',
    description: 'MRC Uganda is a leading research institution conducting high-quality research to improve health outcomes in Uganda and the region.',
    website: 'https://www.mrcuganda.org'
  },
  {
    name: 'The AIDS Support Organisation (TASO)',
    logo: '/images/partners/TASO logo.jpeg',
    description: 'TASO is a leading indigenous organization providing comprehensive HIV/AIDS services in Uganda, supporting thousands of people living with HIV.',
    website: 'https://www.tasouganda.org'
  },
  {
    name: 'Uganda AIDS Commission (UAC)',
    logo: '/images/partners/UAC logo.jpeg',
    description: 'UAC is the national coordinating body for HIV/AIDS activities in Uganda, providing strategic leadership and coordination.',
    website: 'https://www.aidsuganda.org'
  },
  {
    name: 'UNICEF',
    logo: '/images/partners/UNCIEF Logo.png',
    description: 'UNICEF works in over 190 countries and territories to protect the rights of every child, especially the most disadvantaged.',
    website: 'https://www.unicef.org'
  },
  {
    name: 'World Health Organization (WHO)',
    logo: '/images/partners/WHO logo.jpeg',
    description: 'WHO is the directing and coordinating authority on international health work within the United Nations system.',
    website: 'https://www.who.int'
  }
]

const sponsorshipPackages = [
  {
    name: 'Platinum Sponsor/Exhibitor',
    price: 10000,
    idealFor: 'Major healthcare firms, pharmaceutical companies, diagnostic labs, beverage firms & banking institutions',
    features: [
      'Prime booth location (largest size)',
      'Speaking slot (plenary or breakout)',
      'Logo on all promotional materials',
      '6 complimentary conference passes',
      'Feature in post-conference report',
      'Social media spotlight'
    ]
  },
  {
    name: 'Gold Sponsor/Exhibitor',
    price: 7000,
    idealFor: 'Medical tech companies, NGOs, research institutions',
    features: [
      'Premium booth location',
      'Panel participation opportunity',
      'Logo on website & program booklet',
      '4 complimentary passes',
      'Branded banner at venue'
    ]
  },
  {
    name: 'Silver Exhibitor',
    price: 5000,
    idealFor: 'Health startups, regional health agencies, universities',
    features: [
      'Standard booth',
      'Logo in program booklet',
      '2 complimentary passes',
      'Mention during opening/closing remarks'
    ]
  },
  {
    name: 'Bronze Exhibitor',
    price: 4000,
    idealFor: 'Small businesses, advocacy groups, student-led health initiatives',
    features: [
      'Basic booth',
      '1 complimentary pass',
      'Name listed in program booklet'
    ]
  },
  {
    name: 'Non-Profit/Academic Table',
    price: 2500,
    idealFor: 'Non-profits, student groups, academic researchers',
    features: [
      'Table display space only (shared zone)',
      'No promotional branding',
      '1 access badge',
      'Listing in non-profit section of booklet'
    ]
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organizations working with us to strengthen health systems in Uganda
          </p>
        </div>

        {/* Partners Grid */}
                {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <ScrollReveal key={index} delay={index * 100} direction="up">
              <Card className="group text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white border-0 shadow-lg hover:border-blue-200">
                <CardContent className="pt-0">
                  <div className="mb-6 flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-500 group-hover:from-blue-50 group-hover:to-blue-100">
                      {partner.logo ? (
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-500"
                        />
                      ) : (
                        <Building className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors duration-500" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{partner.name}</h3>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Partnership Opportunities */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us in advancing health innovation and research in Uganda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {sponsorshipPackages.map((pkg, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-2">${pkg.price.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Ideal for:</strong> {pkg.idealFor}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Choose This Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlock unique opportunities to make a lasting impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Network Access</h3>
                <p className="text-gray-600 text-sm">
                  Connect with 500+ health professionals, researchers, and policymakers
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Audience</h3>
                <p className="text-gray-600 text-sm">
                  Reach decision-makers in healthcare, government, and academia
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Enhance your brand visibility among key stakeholders
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Impact</h3>
                <p className="text-gray-600 text-sm">
                  Support initiatives that improve health outcomes in Uganda
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our mission to advance health innovation and research in Uganda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <a href="/sponsors">Register as Sponsor</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}