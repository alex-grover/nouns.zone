import { Hash } from 'viem'
import { z } from 'zod'

const hash = z.custom<Hash>((val) =>
  typeof val === 'string' ? val.startsWith('0x') : false,
)

export default hash
