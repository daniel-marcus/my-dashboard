import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"
import type { DataEntry } from "./types"
import type { Selected } from "@/components/view/selected"

const DATA_API = process.env.NEXT_PUBLIC_DATA_API
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const UPD_INTERVAL = 60000

export type DeleteFunc = (selected: Selected) => Promise<boolean | undefined>

export function useData() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<DataEntry[]>([])
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const latestTs = useRef<number | undefined>(undefined)

  const updateData = useCallback(async () => {
    setIsLoading(true)
    const newData = await getData(getAccessTokenSilently, latestTs.current)
    if (newData.length)
      latestTs.current = newData.toSorted((a, b) => a.ts - b.ts).pop()?.ts
    setData((prevData) => [...prevData, ...newData]) // TODO: merge function to prevent duplicates
    setIsLoading(false)
  }, [getAccessTokenSilently])

  const deleteEntry: DeleteFunc = useCallback(
    async (selected: Selected) => {
      const { ts, key } = selected
      setIsLoading(true)
      const success = await deleteData(getAccessTokenSilently, ts, key)
      if (success)
        setData((prevData) =>
          prevData.map((d) => (d.ts === ts ? { ...d, [key]: null } : d))
        )
      setIsLoading(false)
      return success
    },
    [getAccessTokenSilently]
  )

  useEffect(() => {
    if (!!AUTH0_DOMAIN && !isAuthenticated) return
    updateData()
    const timeout = setInterval(updateData, UPD_INTERVAL)
    const onTabResumed = () => !document.hidden && updateData()
    document.addEventListener("visibilitychange", onTabResumed)
    return () => {
      clearInterval(timeout)
      document.removeEventListener("visibilitychange", onTabResumed)
    }
  }, [isAuthenticated, updateData])

  const sortedData = useMemo(() => data.sort((a, b) => a.ts - b.ts), [data])

  return [sortedData, updateData, deleteEntry, isLoading] as const
}

async function getData(
  getAccessToken: () => Promise<string>,
  latestTs?: number
) {
  if (document.visibilityState === "hidden") return [] as DataEntry[]
  if (!DATA_API) throw new Error("DATA_API is not defined")
  const accessToken = !!AUTH0_DOMAIN ? await getAccessToken() : ""
  if (process.env.NODE_ENV === "development") console.log({ accessToken })
  const url = new URL(`${DATA_API}/data`)
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

async function deleteData(
  getAccessToken: () => Promise<string>,
  ts: number,
  key: keyof DataEntry
) {
  if (!window.confirm("Sure?")) return
  if (!DATA_API) throw new Error("DATA_API is not defined")
  const accessToken = !!AUTH0_DOMAIN ? await getAccessToken() : ""
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
