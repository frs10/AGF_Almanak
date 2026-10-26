export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-white/60 leading-relaxed">
        <p className="m-0">
          Lavet af Sture Sandø og Michael Mühlenbach Christiansen.
          Bibliografien er udarbejdet af [afklares].
        </p>
        <p className="m-0">
          Rettighederne til indholdet tilhører Jyllands-Posten som udgiver.{' '}
          <a
            href="https://jyllands-posten.dk/ophavsret"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors"
          >
            Læs om ophavsret
          </a>
        </p>
      </div>
    </footer>
  )
}
