import React from 'react'
import { Resource } from '@prisma/client'
import UpvoteSystem from './UpvoteSystem'
import Link from 'next/link'

const placeholderImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEWpqammpqbT09PX19fc3Nzi4uLm5uajo6Py8vLQ0NDd3d3+/v76+vrx8fHt7e3k5OQpkTr2AAABZ0lEQVR4nO3dQWrCABRF0URNorbV/e+2UmihOKgURE5yzwrenX/4w9v78eNyuczzfJ1uDt/2v+z+b/+nwyPO0wOu853jcF1+jL7lzmmYlmHNxt0wja8e8VSbKDyvvvBQoa1CX4W+Cn0V+ir03Qr3Fdoq9FXoq9BXoa9CX4W+Cn0V+ir0Veir0Fehr0Jfhb4KfZso3FVoq9BXoa9CX4W+Cn0V+ir0Veir0Fehr0Jfhb4KfRX6KvRV6KvQV6GvQt8mLoYqxFXoq9BXoa9CX4W+Cn0V+ir0Veir0Fehr0Jfhb4KfRX6KvRV6KvQV6FvE19YKsRV6KvQV6GvQl+Fvgp9Ffoq9FXoq9BXoa9CX4W+Cn0V+ir0baLwvPrCqUJbhb4KfRX6KvRV6KvQV6GvQl+Fvgp9Ffoq9FXoq9BXoa9CX4W+TRTOy6tHPFWFvgp9Ffoq9FXoq9BXoa9C31fhuGbLaTiedmt2mj8BNIYPDiZn2y8AAAAASUVORK5CYII='

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

  function UpperToTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  return (
    <div className='rounded-md border px-4 py-2 outline-1 outline-sky-200 flex gap-4 max-w-7xl'>
      <img
        src={resource?.thumbnail || placeholderImage}
        alt=''
        className='w-24'
      />
      <div className='flex-grow'>
        <div className='text-gray-400 text-sm'>
          {date.getDate()} {monthToString(date.getMonth())},{' '}
          {date.getFullYear()}
        </div>
        <Link href={resource.url} className='hover:underline font-semibold'>
          {resource.name.slice(0, 50)}
        </Link>
        <div>{resource?.description?.slice(0, 100) || ''}</div>
        <div className='text-sm font-bold text-sky-400'>
          {UpperToTitleCase(resource.type)}
        </div>
      </div>
      <div>
        <UpvoteSystem id={resource.id} upvotes={resource.upvotes} />
      </div>
    </div>
  )
}
