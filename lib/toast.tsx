'use client'

import { useTheme } from 'next-themes'
import { Toaster } from 'sonner'

export default function ToastConfig() {
  const { resolvedTheme } = useTheme()
  return <Toaster theme={resolvedTheme === 'light' ? 'light' : 'dark'} />
}
