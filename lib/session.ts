import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { type LoginSchema, type SessionResponse } from '@/app/api/auth/route'
import { createMutationFetcher } from '@/lib/swr'

const ROUTE = '/api/auth'

export default function useSession() {
  const { data: session, isLoading } = useSWR<SessionResponse>(ROUTE)

  const { trigger: signIn } = useSWRMutation(
    ROUTE,
    createMutationFetcher<SessionResponse, LoginSchema>({ method: 'POST' }),
    { revalidate: false, populateCache: true },
  )
  const { trigger: signOut } = useSWRMutation<SessionResponse>(
    ROUTE,
    createMutationFetcher({ method: 'DELETE' }),
    { revalidate: false, populateCache: true },
  )

  return { session, signOut, signIn, isLoading }
}
