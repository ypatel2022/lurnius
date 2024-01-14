'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import SearchIcon from './icons/SearchIcon'

type SearchResult = {
  name: string
  index: number
}

export default function SearchBar() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [active, setActive] = useState(false)

  const [suggestions, setSuggestions] = useState<SearchResult[]>([])

  const [currentSuggestionFocusIndex, setCurrentSuggestionFocusIndex] =
    useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)

    setCurrentSuggestionFocusIndex(0)

    // if (e.target.value.length > 0) {
    //   // also look for ticker, however only insert the name into the suggestions. The index of the ticker is the same as the name's index
    //   let value = e.target.value.toLowerCase()

    //   let _suggestions: SearchResult[] = []

    //   nasdaqNames.forEach((name, index) => {
    //     // max 8 suggestions
    //     if (
    //       name.toLowerCase().includes(value) ||
    //       nasdaqTickers[index].toLowerCase().includes(value)
    //     ) {
    //       _suggestions.push({
    //         name: name,
    //         index: index,
    //       })
    //     }
    //   })

    //   setSuggestions(_suggestions.splice(0, 8))
    // } else {
    //   setSuggestions([])
    // }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(suggestions[currentSuggestionFocusIndex].name)
      setActive(false)

      // redirect to stock page using next js router
      //   router.push(
      //     '/stock/' +
      //       nasdaqTickers[suggestions[currentSuggestionFocusIndex].index]
      //   )

      // reset suggestions
      setSuggestions([])

      // reset focus index
      setCurrentSuggestionFocusIndex(0)

      // remove focus from input
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setActive(false)
      // lose focus
      e.currentTarget.blur()
    }

    if (e.key === 'ArrowDown') {
      if (currentSuggestionFocusIndex < suggestions.length - 1) {
        setCurrentSuggestionFocusIndex(currentSuggestionFocusIndex + 1)
      }

      if (currentSuggestionFocusIndex == suggestions.length - 1) {
        setCurrentSuggestionFocusIndex(0)
      }
    }

    if (e.key === 'ArrowUp') {
      if (currentSuggestionFocusIndex > 0) {
        setCurrentSuggestionFocusIndex(currentSuggestionFocusIndex - 1)
      }

      if (currentSuggestionFocusIndex == 0) {
        setCurrentSuggestionFocusIndex(suggestions.length - 1)
      }
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setActive(true)
    if (search.length > 0) {
      // also look for ticker, however only insert the name into the suggestions. The index of the ticker is the same as the name's index
      let value = search.toLowerCase()

      let _suggestions: SearchResult[] = []

      //   nasdaqNames.forEach((name, index) => {
      //     // max 8 suggestions
      //     if (
      //       name.toLowerCase().includes(value) ||
      //       nasdaqTickers[index].toLowerCase().includes(value)
      //     ) {
      //       _suggestions.push({
      //         name: name,
      //         index: index,
      //       })
      //     }
      //   })

      setSuggestions(_suggestions.splice(0, 8))
    }
  }

  const handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setSearch(e.currentTarget.innerText)
    setActive(false)
  }

  // handle what happens on key press
  const handleKeyPress = useCallback((event: any) => {
    console.log(`Key pressed: ${event.key}`)
    if (event.key === '/') {
      event.preventDefault()
      setActive(true)
      document.getElementById('search-input')?.focus()
    }
  }, [])

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress)

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <div>
      <div
        className={`fixed inset-0 z-10 ${active ? 'block' : 'hidden'}`}
        onClick={() => {
          setActive(false)
        }}
      ></div>

      <div className='relative z-20'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <SearchIcon />
        </div>

        <input
          className='w-full rounded-md bg-gray-50 border px-4 py-2 pl-10 outline-1 outline-sky-200'
          type='text'
          placeholder='What are you lurnius about today?'
          name='search'
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          autoComplete='off'
          id='search-input'
        />

        <div
          className={`absolute left-0 top-12 w-full rounded-lg bg-white shadow-xl transition-all md:w-96 ${
            active && suggestions.length > 0
              ? 'scale-100'
              : 'invisible scale-90 opacity-0'
          }`}
        >
          <div className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-semibold'>Suggestions</div>
            </div>
            <div className=''>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <Link
                    // href={'/stock/' + nasdaqTickers[suggestion.index]}
                    href='#'
                    key={index}
                  >
                    <div
                      onClick={handleSelect}
                      className={`mt-2 cursor-pointer rounded-lg p-2 transition-all duration-100 hover:bg-gray-100 active:bg-gray-200 ${
                        index == currentSuggestionFocusIndex && 'bg-sky-100'
                      }`}
                    >
                      {suggestion.name}
                    </div>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
