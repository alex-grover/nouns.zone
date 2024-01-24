import {
  SignInButton as FarcasterSignInButton,
  type StatusAPIResponse,
} from '@farcaster/auth-kit'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSession from '@/lib/auth/client'

export default function SignInButton() {
  const { session, signIn } = useSession()

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

  return session?.id ? (
    <div></div>
  ) : (
    <FarcasterSignInButton onSuccess={handleSuccess} onError={handleError} />
  )
}
