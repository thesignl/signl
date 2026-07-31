import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Signl team. Editorial, partnerships, press and reader feedback.',
}

const channels = [
  {
    label: 'Editorial',
    email: 'editorial@signl.media',
    description: 'Story ideas, corrections, contributor proposals.',
  },
  {
    label: 'Partnerships',
    email: 'partnerships@signl.media',
    description: 'Research collaborations, sponsorship, syndication.',
  },
  {
    label: 'Press',
    email: 'press@signl.media',
    description: 'Media enquiries and interview requests.',
  },
  {
    label: 'Readers',
    email: 'hello@signl.media',
    description: 'Reader help, feedback, anything else.',
  },
]

export default function ContactPage() {
  return (
    <>
      <header className="page-header-dark">
        <div className="container">
          <div className="page-eyebrow">Contact</div>
          <h1 className="page-title">Reach the Signl team.</h1>
          <p className="page-sub">
            We read every note. Pick the channel that matches your purpose —
            we’ll route the rest internally.
          </p>
        </div>
      </header>

      <section className="story-page" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
              marginTop: -8,
            }}
          >
            {channels.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="brief-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="brief-card-tag">
                  <span className="cat">{c.label}</span>
                </div>
                <div className="brief-card-headline">{c.email}</div>
                <p className="brief-card-body">{c.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
