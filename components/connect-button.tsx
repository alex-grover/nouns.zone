import { ConnectKitButton } from 'connectkit'
import Button from '@/components/button'

// TODO: display Farcaster username/avatar
export default function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ ensName, isConnected, show, truncatedAddress }) => (
        <Button onClick={show}>
          {isConnected ? ensName ?? truncatedAddress : 'Sign In'}
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}
