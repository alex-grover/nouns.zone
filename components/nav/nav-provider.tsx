'use client'

import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react'

type NavContext = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const navContext = createContext<NavContext>({
  open: false,
  setOpen: () => {
    throw new Error('Not initialized')
  },
})

export function NavProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false)

  return (
    <navContext.Provider value={{ open, setOpen }}>
      {children}
    </navContext.Provider>
  )
}

export function useNav() {
  return useContext(navContext)
}
