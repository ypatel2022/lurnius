import React from 'react'
import LogoIcon from './icons/LogoIcon'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className='font-bold mb-8 text-4xl'>
      <Link href='/'>
        <div className='flex gap-4 items-center'>
          <LogoIcon />
          Lurnius AI
        </div>
      </Link>
    </nav>
  )
}
