"use client"

import { Auth0Provider } from "@auth0/auth0-react"
import { Toaster } from "sonner"
import { Login } from "./login"
import { Dashboard } from "./dashboard"
import { SettingsProvider } from "@/lib/settings"

export const App = () => (
  <SettingsProvider>
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
      <Dashboard />
      <Toaster position="top-right" richColors />
    </Auth0Provider>
  </SettingsProvider>
)
