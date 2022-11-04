// @/src/pages/index.tsx
import type { NextPage } from "next";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-200">
    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#" className="text-xl font-bold text-gray-500 hover:text-gray-400">Samba</a>
        <p className="py-2 text-gray-500 sm:py-0">All rights reserved ⓒ 2022</p>
    </div>
</footer>
  )
}

export default Footer
