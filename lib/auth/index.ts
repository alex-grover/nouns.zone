export type SessionData =
  | {
      id: number
      username: string
      pfpUrl: string
    }
  | Record<string, never>
