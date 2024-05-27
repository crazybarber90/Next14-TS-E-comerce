'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import CartModal from './CartModal'

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState<Boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<Boolean>(false)
  const router = useRouter()
  const isLoggedIn = false

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push('/login')
      setIsProfileOpen((prev) => !prev)
    }
  }
  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 z-20 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <Link href="/">Profile</Link>
          <div className="mt-2 cursor-pointer">Logout</div>
        </div>
      )}
      <Image src="/notification.png" alt="" width={22} height={22} />
      <div className="cursor-pointer">
        <Image
          src="/cart.png"
          alt=""
          width={22}
          height={22}
          className="cursor-pointer"
          onClick={() => setIsCartOpen((prev) => !prev)}
        />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-pinkara rounded-full text-white text-sm flex items-center justify-center">
          2
        </div>
      </div>
      {isCartOpen && (
        <div>
          <CartModal />
        </div>
      )}
    </div>
  )
}

export default NavIcons
