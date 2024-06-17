import { OAuthStrategy, createClient } from '@wix/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
  const cookies = request.cookies
  const res = NextResponse.next()

  if (cookies.get('refreshToken')) {
    return res
  }

  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  })

  // CREATING COOKIE FOR VISITORS TO BE ABLE TO ADD PRODUCTS IN CART !
  // when visitor came to shop, he will get visitor refresh token
  // if he login, his token will be replaced with realone
  // if he logout , his token will be again visitors token
  const tokens = await wixClient.auth.generateVisitorTokens()
  res.cookies.set('refreshToken', JSON.stringify(tokens.refreshToken), {
    maxAge: 60 * 60 * 24 * 30,
  })

  return res
}
