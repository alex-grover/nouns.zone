import { type Hex, isHex } from 'viem'
import { z } from 'zod'

const hexString = z.custom<Hex>((val) => isHex(val))

export default hexString
