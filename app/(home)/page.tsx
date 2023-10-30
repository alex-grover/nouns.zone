'use client'

import { FeedResponse } from 'neynar-next/server'
import { useCallback } from 'react'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import Cast from './cast'
import styles from './page.module.css'

export default function HomePage() {
  const { data, isLoading, setSize } = useSWRInfinite<FeedResponse, string>(
    getKey,
  )

  const loadMore = useCallback(() => {
    void setSize((current) => current + 1)
  }, [setSize])

  return (
    <main className={styles.main}>
      {data?.map((page) =>
        page.casts.map((cast) => <Cast key={cast.hash} cast={cast} />),
      )}
      {isLoading ? 'Loading...' : <button onClick={loadMore}>Load More</button>}
    </main>
  )
}

const API_URL = '/api/casts'

const getKey: SWRInfiniteKeyLoader<FeedResponse> = (_, previousPageData) => {
  if (!previousPageData) return API_URL
  if (!previousPageData.casts.length) return null

  const params = new URLSearchParams({ cursor: previousPageData.next.cursor })
  return `${API_URL}?${params.toString()}`
}
