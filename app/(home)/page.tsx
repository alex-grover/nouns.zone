'use client'

import { FeedResponse } from 'neynar-next/server'
import { useCallback } from 'react'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import Button from '@/components/button'
import LoadingSpinner from '@/components/loading-spinner'
import Cast from './cast'
import styles from './page.module.css'

export default function HomePage() {
  const { data, isLoading, isValidating, setSize } = useSWRInfinite<
    FeedResponse,
    string
  >(getKey)

  const loadMore = useCallback(() => {
    void setSize((current) => current + 1)
  }, [setSize])

  if (isLoading)
    return (
      <main className={styles.loading}>
        <LoadingSpinner />
      </main>
    )

  return (
    <main className={styles.main}>
      {data?.map((page) =>
        page.casts.map((cast) => <Cast key={cast.hash} cast={cast} />),
      )}
      <div className={styles.load}>
        {isValidating ? (
          <LoadingSpinner />
        ) : (
          <Button onClick={loadMore}>Load More</Button>
        )}
      </div>
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
