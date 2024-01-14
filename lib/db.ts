import { PrismaClient } from '@prisma/client'

let db: PrismaClient

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
  //@ts-ignore
  if (!global.prisma) {
    //@ts-ignore
    global.prisma = new PrismaClient()
  }
  //@ts-ignore
  db = global.prisma
}

export default db
