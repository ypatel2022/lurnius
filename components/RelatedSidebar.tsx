import { Resource } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

const topics = [
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'computer science',
  'economics',
  'psychology',
]

export default function RelatedSidebar({
  resources,
}: {
  resources: Resource[]
}) {
  return (
    <div className='w-96'>
      <div className='font-bold mb-4'>Related Resources</div>

      <div className='grid gap-4 border rounded-md bg-gray-50 p-4'>
        {resources.map((res) => (
          <Link
            key={res.id}
            href={res.url}
            className={`flex gap-4 items-center hover:text-sky-500 hover:underline`}
          >
            <div>{res.name.slice(0, 30)}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
