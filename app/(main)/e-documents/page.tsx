import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Download, Clock, Users, Presentation, BookOpen, Video, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata = {
  title: 'Conference E-Documents - NACNDC & JASH Conference 2025',
  description: 'Access all conference materials, presentations, research papers, and multimedia resources from the NACNDC & JASH Conference 2025.',
  keywords: 'conference documents, presentations, research papers, multimedia resources, NACNDC, JASH, conference materials',
}

const documentCategories = [
  {
    id: 1,
    title: 'Conference Presentations',
    description: 'Keynote speeches, plenary sessions, and track presentations',
    icon: Presentation,
    color: 'bg-blue-500',
    count: 0
  },
  {
    id: 2,
    title: 'Research Papers',
    description: 'Accepted abstracts and full research papers',
    icon: FileText,
    color: 'bg-green-500',
    count: 0
  },
  {
    id: 3,
    title: 'Conference Proceedings',
    description: 'Complete conference proceedings and program materials',
    icon: BookOpen,
    color: 'bg-purple-500',
    count: 0
  },
  {
    id: 4,
    title: 'Multimedia Resources',
    description: 'Videos, photos, and audio recordings from sessions',
    icon: Video,
    color: 'bg-orange-500',
    count: 0
  },
  {
    id: 5,
    title: 'Conference Photos',
    description: 'Official conference photography and event highlights',
    icon: ImageIcon,
    color: 'bg-pink-500',
    count: 0
  },
  {
    id: 6,
    title: 'Speaker Materials',
    description: 'Speaker bios, presentation slides, and handouts',
    icon: Users,
    color: 'bg-indigo-500',
    count: 0
  }
]

export default function EDocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference E-Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Access all conference materials, presentations, research papers, and multimedia resources from the NACNDC & JASH Conference 2025.
          </p>
          
          {/* Coming Soon Message */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-primary-200 mr-4" />
              <h2 className="text-3xl font-bold">Materials Coming Soon</h2>
            </div>
            <p className="text-lg text-primary-100 mb-6">
              We're currently preparing all conference materials for your access. Check back after the conference for:
            </p>
            <ul className="text-left text-primary-100 space-y-2 max-w-2xl mx-auto">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-200 rounded-full mr-3"></div>
                Complete presentation slides and keynote speeches
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-200 rounded-full mr-3"></div>
                Research papers and accepted abstracts
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-200 rounded-full mr-3"></div>
                Conference proceedings and program materials
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-200 rounded-full mr-3"></div>
                Video recordings and multimedia resources
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-200 rounded-full mr-3"></div>
                Official conference photography
              </li>
            </ul>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {documentCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 150} direction="up">
              <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  {/* Category Icon */}
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Category Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Coming Soon Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    Coming Soon
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            We'll notify you as soon as conference materials become available. Follow us for updates and don't miss out on accessing valuable resources from the NACNDC & JASH Conference 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Get Notified
            </Button>
            <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3">
              <FileText className="h-5 w-5 mr-2" />
              View Conference Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
