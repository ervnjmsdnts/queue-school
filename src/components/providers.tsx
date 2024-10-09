'use client'

import { PropsWithChildren } from 'react';
import {QueryClient, QueryClientProvider} from 'react-query'

const client = new QueryClient()

export default function Providers({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}