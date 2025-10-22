import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import HomeSlideshow from '../../components/HomeSlideshow'
import { Navbar } from '../../components/Navbar'
import CountdownTimer from '../../components/CountdownTimer'
import SpeakersSlideshow from '../../components/SpeakersSlideshow'
import { Footer } from '../../components/Footer'
import AnimatedCounter from '@/components/AnimatedCounter'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export const metadata = {
  title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
  description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
  keywords: 'uganda health conference, ministry of health uganda, national health, communicable diseases, non-communicable diseases, health policy, conference 2025, NACNDC, JASH',
  openGraph: {
    title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
    description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
    images: ['/images/uganda-coat-of-arms.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
    description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section with Slideshow, Overlay, and Title */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center items-center overflow-hidden border-b border-primary-900 pt-20">
        <div className="absolute inset-0 z-0 w-full h-full">
          <HomeSlideshow />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-20 pb-8 px-3 sm:px-4 md:px-6 animate-fade-in">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight drop-shadow-xl animate-slide-up text-center max-w-7xl">
            NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025
          </h1>
          <h2 className="text-primary-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 animate-fade-in delay-100 text-center max-w-5xl px-2">
            UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES
          </h2>
          <p className="text-primary-200 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 animate-fade-in delay-200 text-center max-w-3xl px-2">
            3rd - 7th November, 2025 • Speke Resort Munyonyo, Uganda
          </p>
          
        </div>
      </section>

      {/* Speakers Slideshow Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Distinguished Speakers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Leading health professionals and experts who will share their insights and expertise at the conference.
            </p>
          </div>
          <SpeakersSlideshow />
          <div className="text-center mt-8">
            <Link 
              href="/speakers" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              View All Speakers
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Countdown Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Conference Countdown
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              November 3, 2025 • 9:00 AM EAT
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Side Event Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Side Event - 3rd November 2025
            </h2>
            <p className="text-xl text-primary-100 max-w-4xl mx-auto">
              "Unifying Health: Building an Integrated, Equitable, and Sustainable Health System for Uganda"
            </p>
          </div>
        </div>
      </section>

      {/* Animated Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conference Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join a growing community of health professionals making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center scroll-reveal">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover-lift">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expected Attendees</h3>
                <p className="text-gray-600">Health professionals from across Uganda</p>
              </div>
            </div>
            
            <div className="text-center scroll-reveal">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover-lift">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  <AnimatedCounter end={5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conference Days</h3>
                <p className="text-gray-600">Comprehensive program and networking</p>
              </div>
            </div>
            
            <div className="text-center scroll-reveal">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover-lift">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  <AnimatedCounter end={1} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Venue</h3>
                <p className="text-gray-600">Speke Resort Munyonyo, Uganda</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </>
  )
}
