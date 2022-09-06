import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
