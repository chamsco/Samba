import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import {loggerLink} from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { AppRouter } from '../server/routers/app.router'
import "../styles/globals.css";
import "@fontsource/poppins";
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';


// made changes to this component 👇
function MyApp({ Component, pageProps,err }: AppProps & { err: Error }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider session={pageProps.session}>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} err={err} />
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </SessionProvider>
  );
}


export default withTRPC<AppRouter>({
  config({ctx}) {

    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : `http://localhost:3000/api/trpc`
    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url
      })
    ]
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime:60,
          }
        }
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          }
        }
        return {}

  },
      links,
      transformer:superjson,
    }
  },
  ssr: false,
})(MyApp)
