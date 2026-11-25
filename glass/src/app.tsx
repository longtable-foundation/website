import { useEffect } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'

import { Footer, Header } from './site/chrome'
import { ProposalProvider } from './site/forms'
import { Foundation } from './pages/foundation'
import { GetInvolved } from './pages/get-involved'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Press } from './pages/press'
import { Proposal } from './pages/proposal'
import { Roadmap } from './pages/roadmap'
import { Signatories } from './pages/signatories'
import { UseCasePage } from './pages/use-case'
import { UC } from './data'

const TITLES: Record<string, string> = {
  '/foundation/': 'Foundation',
  '/roadmap/': 'Roadmap',
  '/signatories/': 'Signatories',
  '/press/': 'Press',
  '/get-involved/': 'Get involved',
  '/proposal/': 'Proposal',
}

/** New page: start at the top, or at the #section the link names. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const key = pathname.endsWith('/') ? pathname : pathname + '/'
    const uc = UC.find((u) => key === `/use-cases/${u.slug}/`)
    const t = uc ? `Use case ${uc.n}: ${uc.t}` : TITLES[key]
    document.title = t ? `${t} · Longtable Foundation` : 'Longtable Foundation · Multimodal clearing'
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView())
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function UseCaseRoute() {
  const { n } = useParams()
  const i = n ? UC.findIndex((u) => u.slug === n) : 0
  return i < 0 ? <NotFound /> : <UseCasePage key={i} i={i} />
}

export function App() {
  return (
    <ProposalProvider>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-ui focus:text-background">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/use-cases" element={<UseCaseRoute />} />
          <Route path="/use-cases/:n" element={<UseCaseRoute />} />
          <Route path="/signatories" element={<Signatories />} />
          <Route path="/press" element={<Press />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ProposalProvider>
  )
}
