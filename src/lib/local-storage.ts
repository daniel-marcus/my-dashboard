"use client"

import { useState, useEffect, useRef } from "react"

const LOCAL_STORAGE_KEY = "my-dashboard"

export function useLocalStorage<T>(initialValue: T, key = LOCAL_STORAGE_KEY) {
  const [value, setValue] = useState<T>(initialValue)
  const isLoaded = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const item = window.localStorage.getItem(key)
        if (item) setValue(JSON.parse(item) as T)
      } catch (err) {
        console.error(err)
      }
      isLoaded.current = true
    }, 0)
    return () => clearTimeout(timeout)
  }, [key])

  useEffect(() => {
    if (!isLoaded.current) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }
  }, [key, value])

  return [value, setValue] as const
}
