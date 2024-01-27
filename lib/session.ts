import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { type LoginSchema } from '@/app/api/auth/route'
import { type SessionData } from '@/lib/auth'
import { createMutationFetcher } from '@/lib/swr'

const ROUTE = '/api/auth'

export default function useSession() {
  const { data: session, isLoading } = useSWR<SessionData>(ROUTE)

  const { trigger: signIn } = useSWRMutation(
    ROUTE,
    createMutationFetcher<SessionData, LoginSchema>({ method: 'POST' }),
    { revalidate: false, populateCache: true },
  )
  const { trigger: signOut } = useSWRMutation<SessionData>(
    ROUTE,
    createMutationFetcher({ method: 'DELETE' }),
    { revalidate: false, populateCache: true },
  )

  return { session, signOut, signIn, isLoading }
}
