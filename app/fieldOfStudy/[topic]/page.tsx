import Navbar from '@/components/Navbar'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import TopicSidebar from '@/components/TopicSidebar'
import LogoIcon from '@/components/icons/LogoIcon'
import db from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'

export default async function SearchQuery({
  params,
}: {
  params: { topic: string }
}) {
  params.topic = params.topic.replace(/%20/g, ' ')
  // console.log(params.topic)

  let resources
  try {
    // topic is fieldOfStudy in the db

    resources = await db.resource.findMany({
      where: {
        fieldOfStudy: {
          contains: params.topic,
        },
      },
      take: 30,
      orderBy: {
        upvotes: 'desc',
      },
    })

    // console.log(resources)

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
            <div className='font-bold'>
              Learn + Curious + AI = Lurnious with us!
            </div>

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
        <TopicSidebar params={params} />
      </main>
    </main>
  )
}
