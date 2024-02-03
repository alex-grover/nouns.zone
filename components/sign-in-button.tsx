import {
  SignInButton as FarcasterSignInButton,
  type StatusAPIResponse,
  useProfile,
} from '@farcaster/auth-kit'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSession from '@/lib/session'

export default function SignInButton() {
  const { isAuthenticated } = useProfile()
  const { session, isLoading, signIn } = useSession()

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      if (res.state !== 'completed' || !res.message || !res.signature) {
        toast('Failed to sign in')
        return
      }

      void signIn({
        message: res.message,
        signature: res.signature,
        nonce: res.nonce,
      })
    },
    [signIn],
  )

  const handleError = useCallback(() => toast('Error signing in'), [])

  if (isLoading || isAuthenticated || session?.id) return null

  return (
    <FarcasterSignInButton
      onSuccess={handleSuccess}
      onError={handleError}
      hideSignOut
    />
  )
}
