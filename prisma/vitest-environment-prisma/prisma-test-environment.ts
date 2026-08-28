import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import type { Environment } from 'vitest/runtime'
import { prisma } from '../../src/lib/prisma'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Criar o banco de teste
    const schema = randomUUID()
    const databaseUrl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync(`npx prisma migrate deploy`)

    return {
      async teardown() {
        // Apagar o banco de teste
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
