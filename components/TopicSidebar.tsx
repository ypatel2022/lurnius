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

export default function TopicSidebar({
  params,
}: {
  params: { topic: string }
}) {
  return (
    <div className='w-96'>
      <div className='font-bold mb-4'>Topics</div>

      <div className='grid gap-1'>
        {topics.map((topic) => (
          <Link
            key={topic}
            href={`/fieldOfStudy/${topic}`}
            className={`flex gap-4 items-center hover:text-sky-500 hover:underline ${
              topic == params.topic ? 'text-sky-600' : ''
            }`}
          >
            <div>{topic}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
