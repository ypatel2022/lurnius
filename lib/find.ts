import db from './db'

import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({
  token: process.env.COHERE_PROD_KEY as string,
})

async function uploadFromYoutubeResults(query: string, prediction: string) {
  const API_URL = 'https://www.googleapis.com/youtube/v3/search'

  const url = `${API_URL}?part=snippet&q=${encodeURIComponent(query)}&key=${
    process.env.GOOGLE_API_KEY
  }&maxResults=${40}&type=video`
  console.log(url)

  const data = await fetch(url)
  const res = await data.json()

  // console.log(res.items)

  let resourcesToSend: any = []

  // console.log(res)

  try {
    res.items.forEach(async (item: any) => {
      // console.log(item.etag)

      resourcesToSend.push({
        name: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        type: 'VIDEO',
        upvotes: Math.floor(Math.random() * 125) - 25,
        fieldOfStudy: prediction,
      })
    })

    try {
      const result = await db.resource.createMany({
        data: resourcesToSend,
        skipDuplicates: true,
      })

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
}

async function uploadFromGoogleBooks(query: string, prediction: string) {
  const API_URL = 'https://www.googleapis.com/books/v1/volumes'

  const url = `${API_URL}?part=snippet&q=${encodeURIComponent(query)}&key=${
    process.env.GOOGLE_API_KEY
  }&maxResults=${40}`

  const data = await fetch(url)
  const res = await data.json()

  // console.log(res.items)

  let resourcesToSend: any = []

  // console.log(res)

  try {
    res.items.forEach(async (item: any) => {
      // console.log(item)
      try {
        let dateString = item.volumeInfo.publishedDate
        // if undefined or null, set to 1970-01-01
        if (!dateString) {
          dateString = '1970-01-01'
        }

        if (dateString.length === 4) {
          dateString += '-01-01'
        }

        const isoDate = new Date(dateString).toISOString()

        resourcesToSend.push({
          name: item.volumeInfo.title,
          description: item?.searchInfo?.textSnipped || '',
          url: `https://books.google.ca/books?id=${item.id}`,
          thumbnail: item?.volumeInfo?.imageLinks?.thumbnail,
          publishedAt: isoDate,
          type: 'BOOK',
          upvotes: Math.floor(Math.random() * 125) - 25,
          fieldOfStudy: prediction,
        })
      } catch (error) {
        console.log(error)
      }
      // console.log(resourcesToSend)
    })
  } catch (error) {
    console.log(error)
  }

  try {
    const result = await db.resource.createMany({
      data: resourcesToSend,
      skipDuplicates: true,
    })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

async function uploadFromCrossref(query: string, prediction: string) {
  const baseUrl = 'https://api.crossref.org/works'
  const queryParams = new URLSearchParams({
    query,
    filter: 'type:journal-article',
    select: 'title,subtitle,URL,created,abstract,subject',
  })

  let resourcesToSend: any = []

  try {
    const response = await fetch(`${baseUrl}?${queryParams}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    try {
      for (const item of data.message.items) {
        resourcesToSend.push({
          name: item.title[0],
          description:
            (item.subtitle && item.subtitle[0]) || item.abstract || '',
          url: item.URL,
          thumbnail: '',
          publishedAt: item?.created?.['date-time'],
          type: 'ARTICLE',
          upvotes: Math.floor(Math.random() * 125) - 25,
          fieldOfStudy: prediction,
        })
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const result = await db.resource.createMany({
        data: resourcesToSend,
        skipDuplicates: true,
      })

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    //@ts-ignore
    console.error(`Error: with crossref idk`)
    return null
  }
}

async function classifyResource(name: string) {
  console.log(name)
  const response = await cohere.classify({
    model: 'embed-english-v3.0',
    inputs: [name],
    // labels: ['mathematics', 'physics', 'chemistry', 'biology', 'computer science', 'economics', 'psychology'],
    examples: [
      {
        text: "Understanding Pascal's Triangle + A comprehensive guide to understanding the main patterns of the Pascal's Triangle",
        label: 'mathematics',
      },
      {
        text: 'Quantum Mechanics and its foundation + Exploring the core principles of Quantum Mechanics',
        label: 'physics',
      },
      {
        text: 'The Chemistry of Baking + A detailed analysis of chemical reactions happening during baking',
        label: 'chemistry',
      },
      {
        text: 'Evolutionary Biology and Genetic Drift + A Primer on the impact of Genetic Drift on Evolutionary Biology',
        label: 'biology',
      },
      {
        text: 'Artificial Intelligence: Deep Learning Techniques + Explanation and applications of deep learning in AI',
        label: 'computer science',
      },
      {
        text: 'Inflation and Its Impact on The Economy + A comprehensive study on inflation dynamics in emerging economies',
        label: 'economics',
      },
      {
        text: 'Human Cognition and its Impact on Behavioral Psychology + The influence of cognition on human behavior',
        label: 'psychology',
      },
      {
        text: 'Riemann Hypothesis and Zeta functions + Understanding the unsolved hypothesis in number theory',
        label: 'mathematics',
      },
      {
        text: 'Theoretical Physics: Beyond Quantum Theory + Advancements beyond Quantum Mechanics and their potential implications',
        label: 'physics',
      },
      {
        text: 'Organic Chemistry: A Study of Carbon Compounds + Detailed exploration on carbon-based compounds in organic chemistry',
        label: 'chemistry',
      },
      {
        text: 'Human Genome Project: A Revelation in Biology + A detailed summary of the Human Genome Project and its impact on biology',
        label: 'biology',
      },
      {
        text: 'Cryptography: Modern Encryption Techniques + A deep dive into the world of cryptography and modern encryption',
        label: 'computer science',
      },
      {
        text: 'Macroeconomics: Unemployment vs Inflation + An examination of the relationship between unemployment and inflation',
        label: 'economics',
      },
      {
        text: 'Child Development: The Role of Cognitive Psychology + A detailed study of child development through the lens of cognitive psychology',
        label: 'psychology',
      },
      {
        text: 'Algebra: Linear and Quadratic Equations + A comparative study of linear and non-linear equations',
        label: 'mathematics',
      },
      {
        text: 'Thermodynamics: The Laws and Their Implications + An investigation into the principles of thermodynamics',
        label: 'physics',
      },
      {
        text: 'Biochemistry: Proteins and Their Functions + A comprehensive look at the structure and function of proteins',
        label: 'chemistry',
      },
      {
        text: 'Ecology: Understanding Populations and Communities + Exploring Population Dynamics in Ecology',
        label: 'biology',
      },
      {
        text: 'Machine Learning: Algorithms and Applications + Explicating machine learning algorithms and their real-world applications',
        label: 'computer science',
      },
      {
        text: 'Economic Policy: The Impacts of Fiscal and Monetary Policy + An analysis of fiscal and monetary policies on an economy',
        label: 'economics',
      },
      {
        text: 'Cognitive Psychology: Perception and Memory + A deep dive into the cognitive aspects of perception and memory',
        label: 'psychology',
      },
      {
        text: 'Number Theory: An Introduction to Prime numbers + A primer on prime numbers and their properties',
        label: 'mathematics',
      },
      {
        text: 'Electromagnetism: Understanding Maxwell’s Equations + Detailed explanation of the mathematical descriptions in electromagnetism',
        label: 'physics',
      },
      {
        text: 'Inorganic Chemistry: Understanding Chemical Bonds + A detailed analysis of bonding in inorganic compounds',
        label: 'chemistry',
      },
      {
        text: 'Genetics: DNA Sequencing and Its Implications + A critical analysis of DNA sequencing and genetic disorders',
        label: 'biology',
      },
      {
        text: 'Data Structures and Algorithms: A Problem-Solving Approach + Solving complex problems using data structures and algorithms',
        label: 'computer science',
      },
      {
        text: 'Global Economics: Understanding Trade and Tariffs + An investigation into the world of international trade and tariffs',
        label: 'economics',
      },
      {
        text: 'Social Psychology: Understanding Conformity and Group Dynamics + A study into the psychological theory of group dynamics',
        label: 'psychology',
      },
      {
        text: 'Geometry: Understanding Shapes and Dimensions + A deeper understanding of different shapes and their properties',
        label: 'mathematics',
      },
      {
        text: 'Astrophysics: Understanding The Universe + Spectacular insights into the workings of the universe',
        label: 'physics',
      },
      {
        text: 'Physical Chemistry: Thermodynamics and Kinetics + A study of energy changes and time in chemical reactions',
        label: 'chemistry',
      },
      {
        text: 'Microbiology: The World of Microorganisms + An introduction to the fascinating world of microorganisms and their role',
        label: 'biology',
      },
      {
        text: 'Computer Networks: Protocols and Architecture + A detailed guide into the design and understanding of computer networks',
        label: 'computer science',
      },
      {
        text: 'Behavioral Economics: Decision Making and Rationality + A critical analysis of decision-making in the field of behavioral economics',
        label: 'economics',
      },
      {
        text: 'Personality Psychology: A Focus on Traits + An examination of personality traits and their measurement',
        label: 'psychology',
      },
      {
        text: 'Calculus: Derivatives and Integrals + A review on the fundamental theories of calculus',
        label: 'mathematics',
      },
      {
        text: 'Particle Physics: The Standard Model and Beyond + An exploration into Particle Physics and its mysteries',
        label: 'physics',
      },
      {
        text: 'Polymer Chemistry: Synthesis and Applications + An overview of the synthesis of polymers and their applications',
        label: 'chemistry',
      },
      {
        text: 'Cell Biology: Structure and Functions + An in-depth look into the workings of the cell',
        label: 'biology',
      },
      {
        text: 'Cybersecurity: Threats and Defense Mechanisms + An exploration into the threats in the cyber world and measures taken to prevent them',
        label: 'computer science',
      },
      {
        text: 'Development Economics: Understanding Economic Growth + Analysis of factors influencing economic growth in developing countries',
        label: 'economics',
      },
      {
        text: 'Developmental Psychology: Childhood and Adolescence + An exploration of psychological developments in early life stages',
        label: 'psychology',
      },
      {
        text: 'Statistics: The Theory of Probability + Understanding probability through the lens of statistics',
        label: 'mathematics',
      },
      {
        text: 'Relativity: Understanding Time and Space + An understanding of time and space through relativity',
        label: 'physics',
      },
      {
        text: 'Nuclear Chemistry: Understanding Radioactivity + A detailed account of radioactivity and nuclear reactions',
        label: 'chemistry',
      },
      {
        text: 'Marine Biology: Life in the Oceans + An exploration into the diverse life forms in the oceans',
        label: 'biology',
      },
      {
        text: "Artificial Intelligence: A Modern Approach + Detailed explanation and discussion on AI and it's modern techniques",
        label: 'computer science',
      },
      {
        text: 'Financial Economics: Market and Risk Analysis + A study on market risks and their impact on financial economics',
        label: 'economics',
      },
      {
        text: 'Clinical Psychology: Understanding Mental Disorders + An in-depth analysis of mental disorders and their treatment',
        label: 'psychology',
      },
    ],
  })

  return response.classifications[0].prediction
}
export async function findMore(query: string) {
  let prediction: string
  try {
    const response = await classifyResource(query)
    prediction = response as string
  } catch (err) {
    prediction = 'mathematics'
    console.log('cohere didnt work :)')
  }

  console.log(`Uploading ${query}...`)

  await uploadFromGoogleBooks(query, prediction)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  await uploadFromYoutubeResults(query, prediction)

  await uploadFromCrossref(query, prediction)

  console.log(`Done.`)
}
