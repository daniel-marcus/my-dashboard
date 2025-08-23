import { App } from "@/components/app"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <App />
        {children}
      </body>
    </html>
  )
}
