'use server'

import { revalidatePath } from 'next/cache'

import db from '@/lib/db'

async function upvote(id: number) {
  const data = await db.resource.findUnique({
    where: { id },
  })

  if (!data) {
    return null
  }

  const resource = await db.resource.update({
    where: { id },
    data: {
      upvotes: data.upvotes + 1,
    },
  })

  return resource
}

async function downvote(id: number) {
  const data = await db.resource.findUnique({
    where: { id },
  })

  if (!data) {
    return null
  }

  const resource = await db.resource.update({
    where: { id },
    data: {
      upvotes: data.upvotes - 1,
    },
  })

  return resource
}

export { upvote, downvote }
