import React from 'react'
import Link from 'next/link'
import { User, Award, Building, ExternalLink, Mail } from 'lucide-react'

const speakers = [
  {
    id: 1,
    name: "Dr. Jane Ruth Aceng Ocero",
    title: "Minister for Health",
    organization: "Ministry of Health Uganda",
    image: "/images/ruth.jpeg",
    role: "Opening Ceremony Speaker"
  },
  {
    id: 2,
    name: "Dr. Diana Atwine",
    title: "Permanent Secretary",
    organization: "Ministry of Health Uganda",
    image: "/images/diana.jpeg",
    role: "Roundtable Discussion Participant"
  },
  {
    id: 3,
    name: "Dr. Charles Olaro",
    title: "Director General",
    organization: "Ministry of Health Uganda",
    image: "/images/charles.jpeg",
    role: "Roundtable Discussion Participant"
  },
  {
    id: 4,
    name: "Dr. Queen Dube",
    title: "Newborn Health Program Lead",
    organization: "World Health Organization (WHO) Headquarters, Switzerland",
    image: "/images/speakers/dr-queen-dube.jpg",
    role: "Keynote Speaker - Opening Ceremony",
    bio: "Dr. Queen Dube is a consultant paediatrician and clinical epidemiologist who serves as the Newborn Health Program Lead at WHO Headquarters. She is a leading figure in African newborn health, known for driving national strategies in several countries (including spearheading Malawi's Every Newborn Action Plan) and directing the pivotal NEST360 research to reduce neonatal mortality in African hospitals. Her expertise and research focus primarily on paediatric HIV and neonatal infections."
  },
  {
    id: 5,
    name: "Prof. Omaswa",
    title: "Guest Speaker",
    organization: "TBA",
    image: "/images/speakers/prof-omaswa.jpg",
    role: "Guest Speaker - Friday, 7th November 2025"
  },
  {
    id: 6,
    name: "Dr. Wilson",
    title: "Session Chair",
    organization: "AHF (AIDS Healthcare Foundation)",
    image: "/images/speakers/dr-wilson.jpg",
    role: "Session Chair - AHF Monday Side Event"
  },
  {
    id: 7,
    name: "Prof. Moses Kamya",
    title: "Principal",
    organization: "Makerere University College of Health Sciences",
    image: "/images/speakers/prof-moses-kamya.jpg",
    role: "Conference Speaker"
  },
  {
    id: 8,
    name: "Dr. Christine Munduru",
    title: "Director General",
    organization: "Uganda National Health Laboratory Services",
    image: "/images/speakers/dr-christine-munduru.jpg",
    role: "Conference Speaker"
  }
]

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference Speakers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the distinguished speakers and thought leaders who will share their expertise and insights at the NACNDC & JASHConference 2025.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              {/* Speaker Image */}
              <div className="relative h-80 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                {['/images/charles.jpeg','/images/diana.jpeg','/images/ruth.jpeg'].includes(speaker.image) ? (
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-56 h-56 object-cover rounded-full border-4 border-primary-400 shadow-2xl z-10 bg-white"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-primary-200 rounded-full flex items-center justify-center border-2 border-primary-100">
                    <User className="h-20 w-20 text-primary-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>

              {/* Speaker Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                <p className="text-primary-600 font-semibold mb-1">{speaker.title}</p>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-sm">{speaker.organization}</span>
                </div>
                {speaker.role && (
                  <div className="mb-3">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {speaker.role}
                    </span>
                  </div>
                )}
                {speaker.bio && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {speaker.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to be a Speaker?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking for passionate health professionals to share their knowledge and experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/abstracts"
                className="btn-primary"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Submit Abstract
              </Link>
              <Link
                href="/contact"
                className="btn-outline"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


