import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { DB } from '@/lib/db/generated/db'
import env from '@/lib/env'

const url = new URL(env.DATABASE_URL)

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: url.pathname.slice(1),
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: parseInt(url.port),
      max: 1,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})

export default db
