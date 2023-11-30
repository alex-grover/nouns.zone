import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { DB } from '@/lib/db/generated/db'
import { DB as ReplicatorDB } from '@/lib/db/generated/replicator'
import env from '@/lib/env'

const dbUrl = new URL(env.DATABASE_URL)
const replicatorUrl = new URL(env.REPLICATOR_DATABASE_URL)

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: dbUrl.pathname.slice(1),
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      port: parseInt(dbUrl.port),
      max: 1,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})

export default db

export const replicatorDb = new Kysely<ReplicatorDB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: replicatorUrl.pathname.slice(1),
      host: replicatorUrl.hostname,
      user: replicatorUrl.username,
      password: replicatorUrl.password,
      port: parseInt(replicatorUrl.port),
      max: 1,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})
