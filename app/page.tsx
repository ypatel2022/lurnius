import Navbar from '@/components/Navbar'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import TopicSidebar from '@/components/TopicSidebar'
import db from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'

const topics = [
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'computer science',
  'economics',
  'psychology',
]

export default async function Home() {
  let resources
  try {
    // get 10 random resources
    // randomResources = await db.resource.findMany({
    //   take: 10,
    //   skip: Math.floor(Math.random() * 1000),
    //   orderBy: {
    //     upvotes: 'desc',
    //   },
    // })

    // get most upvoted resources
    resources = await db.resource.findMany({
      take: 30,
      orderBy: {
        upvotes: 'desc',
      },
    })

    // console.log(randomResources)
  } catch (error) {
    console.log(error)
  }

  return (
    <main className='min-h-screen p-24'>
      <Navbar />

      <main className='flex gap-4'>
        <div>
          <div className='grid gap-4 mb-4'>
            <div className='font-bold'>Learn + Curious = Lurnious with us!</div>

            <SearchBar />
          </div>
          <div className='grid gap-4'>
            {resources &&
              resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </div>
        {/* <div>Related Resources</div> */}
        <TopicSidebar params={{ topic: '' }} />
      </main>
    </main>
  )
}
