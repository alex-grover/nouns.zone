'use client'

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

type SignerContextType = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

function notInitialized() {
  throw new Error('Not initialized')
}

const SignerContext = createContext<SignerContextType>({
  open: false,
  setOpen: notInitialized,
})

export default function SignerDialogProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false)

  return (
    <SignerContext.Provider value={{ open, setOpen }}>
      {children}
    </SignerContext.Provider>
  )
}

export function useSignerDialog() {
  return useContext(SignerContext)
}
