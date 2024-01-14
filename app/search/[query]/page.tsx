import Navbar from '@/components/Navbar'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import LogoIcon from '@/components/icons/LogoIcon'
import db from '@/lib/db'
import Image from 'next/image'

export default async function SearchQuery({
  params,
}: {
  params: { query: string }
}) {
  params.query = params.query.replace(/%20/g, ' ')
  // console.log(params.query)

  let resources
  try {
    // get most top upvoted resources that match the query

    // using or operator

    resources = await db.resource.findMany({
      where: {
        OR: [
          {
            name: {
              contains: params.query,
            },
          },
          {
            description: {
              contains: params.query,
            },
          },
        ],
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

      <section className='grid gap-4 mb-4'>
        <div className='font-bold'>Learn + Curious = Lurnious with us!</div>

        <SearchBar defaultSearch={params.query} />
      </section>

      <section className='grid gap-4'>
        {resources &&
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
      </section>
    </main>
  )
}
