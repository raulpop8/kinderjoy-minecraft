import Header from '@/components/Header'
import FigurineGrid from '@/components/FigurineGrid'
import LoginModal from '@/components/LoginModal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-7">
        <FigurineGrid />
      </main>
      <div className="max-w-screen-xl mx-auto">
        <Footer />
      </div>
      <LoginModal />
    </>
  )
}