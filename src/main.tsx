import { startReactDsfr } from '@codegouvfr/react-dsfr/spa'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Link } from 'react-router-dom'
import { MFSProvider } from './utils/context/isMFSContext'
import { store } from './utils/reducer/reducer'
import React, { useEffect } from 'react'
import { Root } from './components/Root/Root'

function App() {
  useEffect(() => {
    var _mtm = (window._mtm = window._mtm || [])
    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' })
    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.async = true
    g.src = import.meta.env.VITE_MATOMO_URL
    s.parentNode.insertBefore(g, s)
  }, [])

  return (
    <BrowserRouter basename="/">
      <MFSProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Root />
          </QueryClientProvider>
        </Provider>
      </MFSProvider>
    </BrowserRouter>
  )
}

startReactDsfr({ defaultColorScheme: 'system', Link })
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
