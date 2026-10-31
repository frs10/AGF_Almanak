import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Almanakken – Hvid Røg'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0F1D3D',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(201,162,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: '#C9A227',
          }}
        />

        {/* Hvid Røg label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '2px',
              background: '#C9A227',
            }}
          />
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A227',
              fontFamily: 'sans-serif',
            }}
          >
            Hvid Røg
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '20px',
            fontFamily: 'sans-serif',
          }}
        >
          Almanakken
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '26px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.45,
            maxWidth: '780px',
            fontFamily: 'sans-serif',
          }}
        >
          Store øjeblikke, nære nedture og ét motorvejstoilet.
          Dag for dag i AGF&apos;s historie.
        </div>
      </div>
    ),
    { ...size }
  )
}
