import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"

export function Login() {
  const pathname = usePathname()
  const { isAuthenticated, loginWithRedirect, error } = useAuth0()
  useEffect(() => {
    if (pathname === "/login") loginWithRedirect()
  }, [pathname, loginWithRedirect])
  if ((isAuthenticated && !error) || !process.env.NEXT_PUBLIC_AUTH0_DOMAIN)
    return null
  return (
    <button
      className="w-full p-2 bg-gray-100 dark:bg-gray-800"
      onClick={() => loginWithRedirect()}
    >
      Login
    </button>
  )
}
