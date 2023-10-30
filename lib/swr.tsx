'use client'

import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

async function fetcher<Data>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
): Promise<Data> {
  const res = await fetch(input, init)

  if (!res.ok) throw new Error(await res.text())

  return (await res.json()) as Data
}

export default function SWRProvider({ children }: PropsWithChildren) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
}
