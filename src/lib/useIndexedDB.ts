"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { openDB, type IDBPDatabase } from "idb"

const DB_NAME = "my-dashboard"
const STORE_NAME = "keyval"

let dbPromise: Promise<IDBPDatabase> | undefined

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME)
      },
    })
  }
  return dbPromise
}

export function useIndexedDB<T>(dbKey: string, initialValue: T) {
  const [allData, setAllData] = useState<Record<string, T>>({})
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set())
  const requestedKeys = useRef<Set<string>>(new Set())

  // Seed a newly-seen dbKey synchronously during render so `value` is
  // always sourced from the stable `allData` map, never a fresh literal.
  if (!(dbKey in allData)) {
    setAllData((prev) => ({ ...prev, [dbKey]: initialValue }))
  }

  const isLoaded = loadedKeys.has(dbKey)
  const value = dbKey in allData ? allData[dbKey] : initialValue

  // Fetch each dbKey from IndexedDB at most once per hook lifetime, keyed
  // independently so switching between already-visited keys never refetches
  // or clears data for the others.
  useEffect(() => {
    if (requestedKeys.current.has(dbKey)) return
    requestedKeys.current.add(dbKey)
    ;(async () => {
      let stored: T | undefined
      try {
        const db = await getDB()
        stored = await db.get(STORE_NAME, dbKey)
      } catch (err) {
        console.error(err)
      }
      if (stored !== undefined) setAllData((prev) => ({ ...prev, [dbKey]: stored as T }))
      setLoadedKeys((prev) => new Set(prev).add(dbKey))
    })()
  }, [dbKey])

  useEffect(() => {
    if (!isLoaded) return
    ;(async () => {
      try {
        const db = await getDB()
        await db.put(STORE_NAME, value, dbKey)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [dbKey, value, isLoaded])

  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      setAllData((prev) => {
        const prevValue = dbKey in prev ? prev[dbKey] : initialValue
        const nextValue = typeof val === "function" ? (val as (prev: T) => T)(prevValue) : val
        return { ...prev, [dbKey]: nextValue }
      })
    },
    [dbKey, initialValue],
  )

  return [value, setValue, isLoaded] as const
}
