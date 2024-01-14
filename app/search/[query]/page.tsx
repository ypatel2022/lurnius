import Navbar from '@/components/Navbar'
import RelatedSidebar from '@/components/RelatedSidebar'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import LogoIcon from '@/components/icons/LogoIcon'
import db from '@/lib/db'
import { findMore } from '@/lib/find'
import { Resource } from '@prisma/client'
import Image from 'next/image'

export default async function SearchQuery({
  params,
}: {
  params: { query: string }
}) {
  params.query = params.query.replace(/%20/g, ' ')
  // console.log(params.query)

  let resources
  let relatedResources
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

    if (resources.length < 5) {
      try {
        if (resources.length < 15) {
          await findMore(params.query)
        }
      } catch (err) {
        console.log(err)
      }

      // do or search with all words from query
      const queryWords = params.query.split(' ')
      resources = await db.resource.findMany({
        where: {
          OR: queryWords.map((word) => ({
            name: {
              contains: word,
            },
          })),
        },
        take: 30,
        orderBy: {
          upvotes: 'desc',
        },
      })
    }

    let keywords: string[] = []
    // loop over resources and get name
    resources.forEach((resource) => {
      // split name into words
      const words = resource.name.split(' ')
      // loop over words and add to keywords
      words.forEach((word) => {
        // check if word is in keywords
        if (!keywords.includes(word)) {
          // add to keywords
          keywords.push(word)
        }
      })
    })

    // find resources that match keywords
    relatedResources = await db.resource.findMany({
      where: {
        OR: keywords.map((keyword) => ({
          name: {
            contains: keyword,
          },
        })),
      },
      take: 30,
      orderBy: {
        upvotes: 'desc',
      },
    })

    console.log(relatedResources)
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
              Learn + Curious + AI = Lurnius with us!
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
        {relatedResources && <RelatedSidebar resources={relatedResources} />}
      </main>
    </main>
  )
}
