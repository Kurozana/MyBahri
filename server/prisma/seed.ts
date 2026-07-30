import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Bootstrap ONLY: ensure a single admin account exists, created from environment
 * config (never hardcoded in source). No demo users, employees, todos or release
 * notes — all real data comes from actual sources (GCP user sync, the admin
 * creating records, user actions). Idempotent: safe to run repeatedly.
 */
async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME ?? 'Administrator'

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment to bootstrap the admin.')
  }

  const initials =
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD'

  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      name,
      initials,
      role: 'admin',
      title: 'System Administrator',
      department: 'IT',
      leaveBalance: 0,
    },
  })

  console.log(`Bootstrapped admin account: ${admin.email} (${admin.name})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
