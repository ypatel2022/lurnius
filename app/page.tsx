import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import LogoIcon from '@/components/icons/LogoIcon'
import db from '@/lib/db'
import Image from 'next/image'

export default async function Home() {
  let randomResources
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
    randomResources = await db.resource.findMany({
      take: 10,
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
      <nav className='font-bold mb-8'>
        <div className='flex gap-4 items-center'>
          <LogoIcon />
          Lurnius
        </div>
      </nav>

      <main className='flex gap-4'>
        <div>
          <div className='grid gap-4 mb-4'>
            <div className='font-bold'>Learn + Curious = Lurnious with us!</div>

            <SearchBar />
          </div>
          <div className='grid gap-4'>
            {randomResources &&
              randomResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </div>
        <div>Related Resources</div>
        <div>Topics</div>
      </main>
    </main>
  )
}
