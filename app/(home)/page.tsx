'use client'

import { useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import { CastsResponse } from '@/app/api/casts/route'
import LoadingSpinner from '@/components/loading-spinner'
import Cast from './cast'
import styles from './page.module.css'

export default function HomePage() {
  const { data, isLoading, setSize } = useSWRInfinite<CastsResponse, string>(
    getKey,
  )

  const [element, setElement] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach(() => void setSize((current) => current + 1))
    })

    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [setSize, element])

  if (isLoading)
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    )

  return (
    <>
      {data?.map((page) =>
        page.casts.map((cast) => <Cast key={cast.hash} cast={cast} />),
      )}
      <div
        className={styles.loader}
        ref={(ref) => {
          setElement(ref)
        }}
      >
        <LoadingSpinner />
      </div>
    </>
  )
}

const API_URL = '/api/casts'

const getKey: SWRInfiniteKeyLoader<CastsResponse> = (_, previousPageData) => {
  if (!previousPageData) return API_URL
  if (!previousPageData.next.cursor) return null

  const params = new URLSearchParams({ cursor: previousPageData.next.cursor })
  return `${API_URL}?${params.toString()}`
}
