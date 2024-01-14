import React from 'react'
import { Resource } from '@prisma/client'
import UpvoteSystem from './UpvoteSystem'

export default function ResourceCard({ resource }: { resource: Resource }) {
  // convert resource.publishedAt to a readable format
  const date = new Date(resource.publishedAt || '')

  const monthToString = (month: number) => {
    switch (month) {
      case 0:
        return 'Jan'
      case 1:
        return 'Feb'
      case 2:
        return 'Mar'
      case 3:
        return 'Apr'
      case 4:
        return 'May'
      case 5:
        return 'Jun'
      case 6:
        return 'Jul'
      case 7:
        return 'Aug'
      case 8:
        return 'Sep'
      case 9:
        return 'Oct'
      case 10:
        return 'Nov'
      case 11:
        return 'Dec'
      default:
        return 'Jan'
    }
  }

  return (
    <div className='rounded-md border px-4 py-2 outline-1 outline-sky-200 flex gap-4'>
      <img src={resource?.thumbnail || ''} alt={resource.name} />
      <div className='flex-grow'>
        <div>
          {date.getDate()} {monthToString(date.getMonth())},{' '}
          {date.getFullYear()}
        </div>
        <div>{resource.name}</div>
        <div>{resource.description || ''}</div>
        <div>{resource.type}</div>
      </div>
      <div>
        <UpvoteSystem id={resource.id} upvotes={resource.upvotes} />
      </div>
    </div>
  )
}
