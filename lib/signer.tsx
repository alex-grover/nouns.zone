'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { type SignerResponse } from '@/app/api/signer/route'
import { useSignerDialog } from '@/components/signer-dialog'
import useSession from '@/lib/session'
import { createMutationFetcher } from '@/lib/swr'

const ROUTE = '/api/signer'

export function useSigner() {
  const { session } = useSession()
  const { open } = useSignerDialog()

  const {
    data: signer,
    isLoading,
    mutate,
  } = useSWR<SignerResponse | null>(session?.id ? ROUTE : null, {
    refreshInterval: (data) =>
      open && data?.status === 'pending_approval' ? 2000 : 0,
  })

  const { trigger: createSigner } = useSWRMutation(
    ROUTE,
    createMutationFetcher<SignerResponse>({ method: 'PUT' }),
    { revalidate: false, populateCache: true },
  )

  const clearSigner = useCallback(
    () => mutate(null, { revalidate: false, populateCache: true }),
    [mutate],
  )

  return {
    signer,
    createSigner,
    clearSigner,
    isLoading,
  }
}
