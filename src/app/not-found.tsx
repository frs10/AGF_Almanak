import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl">

          {/* Illustration */}
          <div className="flex justify-center pt-10 pb-2 px-10">
            <Image
              src="/404-jakob-nielsen.png"
              alt="Skuffet fodboldspiller med tomme lommer"
              width={280}
              height={340}
              className="w-full max-w-[220px] h-auto"
            />
          </div>

          {/* Tekst */}
          <div className="px-8 pb-10 pt-4 flex flex-col gap-5">
            <p className="text-agf-blue text-[15px] leading-relaxed">
              Vi er så skuffede som kun Jakob Nielsen kan være, men der var
              desværre intet at finde her.
            </p>
            <p className="text-[#3A4560] text-[15px] leading-relaxed">
              Gå tilbage til forsiden og prøv dig frem igen. Måske lykkes det
              at finde det du søger. Ellers er der altid næst' år ikk'å.
            </p>
            <Link
              href="/front"
              className="mt-1 inline-flex items-center justify-center h-11 px-6 rounded-xl bg-agf-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Tilbage til forsiden
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
