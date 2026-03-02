export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4 text-white/40 text-xs text-center">
        <p>
          Sture Sandø og Michael &apos;Jøden&apos; Mühlenbach står bag podcasten &apos;Hvid Røg&apos;, som leverer indhold til denne side.
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
          Som udgiver af podcasten &apos;Hvid Røg&apos;, som har en satirisk karakter, tilfalder ophavsretten på denne side Jyllands-Posten,
          som dog ikke står til ansvar for at al information på siden er korrekt.{' '}
          © Alt materiale på denne side er omfattet af gældende lov om ophavsret.{' '}
          <a
            href="https://jyllands-posten.dk/ophavsret"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            Læs om reglerne her.
          </a>
        </p>
      </div>
    </footer>
  )
}
