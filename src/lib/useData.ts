import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"
import type { DataEntry, Resolution } from "./types"
import type { Selected } from "@/components/View/useSelected"
import { useIndexedDB } from "./useIndexedDB"

const DATA_API = process.env.NEXT_PUBLIC_DATA_API
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const UPD_INTERVAL = 60000

export type DeleteFunc = (selected: Selected) => Promise<boolean | undefined>

export function useData(resolution?: Resolution) {
  const [isLoading, setIsLoading] = useState(false)
  const dbKey = `data-${resolution ?? "default"}`
  const [data, setData, isLoaded] = useIndexedDB<DataEntry[]>(dbKey, [])
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const latestTs = useRef<number | undefined>(undefined)

  const getToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently()
    } catch (e: any) {
      if (e?.error === "missing_refresh_token" || e?.error === "invalid_grant") {
        loginWithRedirect()
      }
      throw e
    }
  }, [getAccessTokenSilently, loginWithRedirect])

  const updateData = useCallback(async () => {
    setIsLoading(true)
    const newData = await getData(getToken, resolution, latestTs.current)
    if (newData.length) latestTs.current = newData.toSorted((a, b) => a.ts - b.ts).pop()?.ts
    setData((prevData) => mergeData(prevData, newData))
    setIsLoading(false)
  }, [getToken, resolution, setData])

  const deleteEntry: DeleteFunc = useCallback(
    async (selected: Selected) => {
      const { ts, key } = selected
      setIsLoading(true)
      const success = await deleteData(getToken, ts, key)
      if (success)
        setData((prevData) => prevData.map((d) => (d.ts === ts ? { ...d, [key]: null } : d)))
      setIsLoading(false)
      return success
    },
    [getToken, setData],
  )

  useEffect(() => {
    if (isLoaded) latestTs.current = data.toSorted((a, b) => a.ts - b.ts).pop()?.ts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    if (!!AUTH0_DOMAIN && !isAuthenticated) return
    const initial = setTimeout(updateData, 0)
    const interval = setInterval(updateData, UPD_INTERVAL)
    const onTabResumed = () => !document.hidden && updateData()
    document.addEventListener("visibilitychange", onTabResumed)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onTabResumed)
    }
  }, [isAuthenticated, updateData, isLoaded])

  const sortedData = useMemo(() => data.sort((a, b) => a.ts - b.ts), [data])

  return [sortedData, updateData, deleteEntry, isLoading] as const
}

function mergeData(prevData: DataEntry[], newData: DataEntry[]) {
  const byTs = new Map(prevData.map((d) => [d.ts, d]))
  for (const d of newData) byTs.set(d.ts, d)
  return [...byTs.values()]
}

async function getData(
  getAccessToken: () => Promise<string>,
  resolution?: Resolution,
  latestTs?: number,
) {
  if (document.visibilityState === "hidden") return [] as DataEntry[]
  if (!DATA_API) throw new Error("DATA_API is not defined")
  const accessToken = AUTH0_DOMAIN ? await getAccessToken() : ""
  if (process.env.NODE_ENV === "development") console.log({ accessToken })
  const url = new URL(`${DATA_API}/data`)
  if (resolution) url.searchParams.set("resolution", resolution)
  if (latestTs) url.searchParams.set("from", latestTs.toString())
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      return data as DataEntry[]
    } else throw new Error(`Server error: ${await res.text()}`)
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error("An unexpected error occurred")
    }
    return []
  }
}

async function deleteData(getAccessToken: () => Promise<string>, ts: number, key: keyof DataEntry) {
  if (!window.confirm("Sure?")) return
  if (!DATA_API) throw new Error("DATA_API is not defined")
  const accessToken = AUTH0_DOMAIN ? await getAccessToken() : ""
  const url = new URL(`${DATA_API}/data`)
  url.searchParams.set("ts", String(ts))
  url.searchParams.set("key", key as string)
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const success = res.ok
  const resText = await res.text()
  if (!success) console.error("Delete failed. Server responded:", resText)
  return success
}
