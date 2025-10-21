import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import ToastContainer from '../../components/ToastContainer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen main-content">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}
