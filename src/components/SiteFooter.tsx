import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row gap-8 justify-between text-[13px] text-white/60 leading-relaxed">
        <div className="flex flex-col gap-2 max-w-lg">
          <p className="m-0">
            Bygget med stolthed (som få) af Anders &ldquo;Fernis&rdquo; Døssing Jepsen.{' '}
            Lavet af Sture Sandø og Michael &ldquo;Jøden&rdquo; Mühlenbach Christiansen.
          </p>
          <p className="m-0">
            Rettighederne til indholdet tilhører Hvid Røg og dets ophavsmænd
            Sture Sandø og Michael Mühlenbach Christiansen.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link href="/suggest" className="text-white/50 hover:text-white transition-colors">
            Foreslå en dato til almanakken →
          </Link>
        </div>
      </div>
    </footer>
  )
}
