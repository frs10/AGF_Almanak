import Link from 'next/link'
import JesperHansenToggle from './JesperHansenToggle'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4 text-white/40 text-xs text-center">
        <p>
          <a
            href="https://www.linkedin.com/in/sture-sand%C3%B8-5a236567/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            Sture Sandø
          </a>{' '}og{' '}
          <a
            href="https://www.facebook.com/michael.m.christiansen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            Michael &apos;Jøden&apos; Mühlenbach Christiansen
          </a>{' '}står bag podcasten &apos;Hvid Røg&apos;, som leverer indhold til denne side.
          Siden er gjort tilgængelig på nettet af{' '}
          <a
            href="https://www.linkedin.com/in/andersdjepsen/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            Anders &apos;Fernis&apos; Døssing Jepsen
          </a>
          .
        </p>
        <p>
          © Som udgiver af podcasten &apos;Hvid Røg&apos; tilfalder ophavsretten for indholdet på denne side Jyllands-Posten.{' '}
          Alt materiale på denne side er omfattet af gældende lov om ophavsret. {' '}
          <a
            href="https://jyllands-posten.dk/ophavsret"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            Læs om reglerne her.
          </a>
        </p>
        <div className="pt-2 flex items-center justify-between">
          <Link href="/login" className="text-white/20 hover:text-white/50 transition-colors">
            Admin
          </Link>
          <JesperHansenToggle />
        </div>
      </div>
    </footer>
  )
}
