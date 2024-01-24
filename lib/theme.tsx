'use client'

import { ThemeProvider as BaseThemeProvider } from 'next-themes'
import { type PropsWithChildren } from 'react'

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <BaseThemeProvider themeColor="var(--background)">
      {children}
    </BaseThemeProvider>
  )
}
