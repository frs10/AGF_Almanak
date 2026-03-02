import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <Header />
      <div className="flex-1">
        <Timeline />
      </div>
      <Footer />
    </div>
  )
}
