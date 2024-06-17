'use client'

enum MODE {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

import { useWixClient } from '@/hooks/useWixClient'
import { LoginState } from '@wix/sdk'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const LoginPage = () => {
  const [mode, setMode] = useState(MODE.LOGIN)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const wixClient = useWixClient()
  const pathname = usePathname()
  const router = useRouter()
  const isLoggedIn = wixClient.auth.loggedIn()

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  const formTitle =
    mode === MODE.LOGIN
      ? 'Log in'
      : mode === MODE.REGISTER
      ? 'Register'
      : mode === MODE.RESET_PASSWORD
      ? 'Reset Your Password'
      : 'Verify Your Password'

  const buttonTitle =
    mode === MODE.LOGIN
      ? 'Login'
      : mode === MODE.REGISTER
      ? 'Register'
      : mode === MODE.RESET_PASSWORD
      ? 'Reset'
      : 'Verify'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      //since we are using different responce for each mode we will make it dynamically
      let response
      // SWITCH CASE COS WE HAVE 4modes
      switch (mode) {
        case MODE.LOGIN:
          response = await wixClient.auth.login({
            email, //email: email
            password, //password: password
          })
          break

        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          })
          break

        case MODE.RESET_PASSWORD:
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            window.location.href
          )
          setMessage('Password reset email sent. Please check Your email')
          break

        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode,
          })
          break

        default:
          break
      }

      // ----------- SWITCH CASES FOR RESPONSE AFTER LOGIN
      switch (response?.loginState) {
        // SUCCESS LOGIN
        case LoginState.SUCCESS:
          setMessage('Successful! You are being redirected.')
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          )
          Cookies.set('refreshToken', JSON.stringify(tokens.refreshToken), {
            expires: 2,
          })
          wixClient.auth.setTokens(tokens)
          router.push('/')
          break

        // FAIL LOGIN
        case LoginState.FAILURE:
          if (
            response.errorCode === 'invalidEmail' ||
            response.errorCode === 'invalidPassword'
          ) {
            setError('Invalid email or password!')
          } else if (response.errorCode === 'emailAlreadyExists') {
            setError('Email allready exist')
          } else if ((response.errorCode = 'resetPassword')) {
            setError('You need to reset Your password')
          } else {
            setError('Something went wrong')
          }

        // W8ing FOR EMAIL VERIFICATION
        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION)
        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage('Your accont is pending approval')

        default:
          break
      }
    } catch (error) {
      console.log(error)
      setError('Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold">{formTitle}</h1>

        {/* USERNAME FORM INPUT */}
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        ) : null}

        {/* EMAIL FORM INPUT */}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@email.com"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmailCode(e.target.value)}
            />
          </div>
        )}

        {/*  */}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        ) : null}

        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.RESET_PASSWORD)}
          >
            Forgot Password?
          </div>
        )}

        <button
          disabled={isLoading}
          className=" bg-pinkara text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.REGISTER)}
          >
            {"Dont't"} have an account?
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Allready have an account?
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Go back to login
          </div>
        )}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  )
}

export default LoginPage
