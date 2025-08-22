"use client"

import { Auth0Provider } from "@auth0/auth0-react"
import { Login } from "./login"
import { Dashboard } from "./dashboard"
import { useLocalStorage } from "@/lib/local-storage"
import { DEFAULT_SETTINGS } from "@/lib/constants"

export const App = () => {
  const [settings, setSettings] = useLocalStorage(DEFAULT_SETTINGS)
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ""}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
        audience: `${process.env.NEXT_PUBLIC_DATA_API}/`,
        scope: "read:sensor_data",
      }}
      cacheLocation="localstorage"
    >
      <Login />
      <Dashboard settings={settings} setSettings={setSettings} />
    </Auth0Provider>
  )
}
