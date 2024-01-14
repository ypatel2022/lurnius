import React from 'react'
import ArrowDownCircleIcon from './icons/ArrowDownCircleIcon'
import ArrowUpCircleIcon from './icons/ArrowUpCircleIcon'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
// import { upvote, downvote } from '@/actions/upvote'

export default function UpvoteSystem({
  id,
  upvotes,
}: {
  id: number
  upvotes: number
}) {
  async function upvote() {
    'use server'
    const data = await db.resource.findUnique({
      where: { id },
    })

    if (!data) {
      return null
    }

    const resource = await db.resource.update({
      where: { id },
      data: {
        upvotes: upvotes + 1,
      },
    })

    revalidatePath('/')

    return resource
  }

  async function downvote() {
    'use server'
    const data = await db.resource.findUnique({
      where: { id },
    })

    if (!data) {
      return null
    }

    const resource = await db.resource.update({
      where: { id },
      data: {
        upvotes: upvotes - 1,
      },
    })

    revalidatePath('/')

    return resource
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <form action={upvote}>
        <button className='cursor-pointer'>
          <ArrowUpCircleIcon />
        </button>
      </form>
      {upvotes}
      <form action={downvote}>
        <button>
          <ArrowDownCircleIcon />
        </button>
      </form>
    </div>
  )
}
