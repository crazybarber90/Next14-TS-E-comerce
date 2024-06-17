'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CartModal from './CartModal'
import { useWixClient } from '@/hooks/useWixClient'
import Cookies from 'js-cookie'
import { useCartStore } from '@/hooks/useCartStore'

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState<Boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<Boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const wixClient = useWixClient()

  // const isLoggedIn = false

  const isLoggedIn = wixClient.auth.loggedIn()

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setIsProfileOpen((prev) => !prev)
    }
  }

  // AUTH WITH WIX-MANAMGED AUTH
  // this is dummy function from wix documentation with necesery things

  // const login = () => {
  //   const loginRequestData = wixClient.auth.generateOAuthData(
  //     'https://www.mysite.com/callback',
  //     'https://www.mysite.com/login' // optional
  //   )
  // }

  // THIS IS MY FUNCTON WITH MY THINGS
  // THIS FUNCTION GIVE US LOGIN WITH GOOGE/ FACEBOOK
  // const login = async () => {
  //   const loginRequestData = wixClient.auth.generateOAuthData(
  //     'http://localhost:3000'
  //   )
  //   console.log(' THIS IS LOGIN REQUEST DATA ', loginRequestData)
  //   // when we click here, we will get object from wix, that we should save to LocalStorage and use for redirect

  //   localStorage.setItem('oAuthRedirectData', JSON.stringify(loginRequestData))
  //   // this will generate unique url and using that url we will be able to reach our wix website
  //   const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData)
  //   window.location.href = authUrl
  // }

  const handleLogout = async () => {
    setIsLoading(true)
    Cookies.remove('refreshToken')
    const { logoutUrl } = await wixClient.auth.logout(window.location.href)
    setIsLoading(false)
    setIsProfileOpen(false)
    router.push(logoutUrl)
  }

  const { cart, counter, getCart } = useCartStore()

  useEffect(() => {
    getCart(wixClient)
  }, [wixClient, getCart])

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
        // onClick={login}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/">Profile</Link>
          <div onClick={handleLogout} className="mt-2 cursor-pointer">
            {isLoading ? 'Loggining out ...' : 'Logout'}
          </div>
        </div>
      )}
      <Image src="/notification.png" alt="" width={22} height={22} />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image
          src="/cart.png"
          alt=""
          width={22}
          height={22}
          className="cursor-pointer"
          // onClick={() => setIsCartOpen((prev) => !prev)}
        />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-pinkara rounded-full text-white text-sm flex items-center justify-center">
          {counter}
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
