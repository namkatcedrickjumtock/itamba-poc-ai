import * as React from 'react'
import Link from 'next/link'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-white ">  
      <Link href="/" rel="nofollow" className="mr-2 font-bold">
        Itamba Poc Ai
      </Link>
      <select 
        className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue=""
      >
        <option value="" disabled>Select Model</option>
        <option value="deepseek">Deepseek</option>
        <option value="anthropic">Anthropic</option>
        <option value="llama">Llama</option>
      </select>
    </header>
  )
}
