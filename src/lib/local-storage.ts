"use client"

import { useState, useEffect } from "react"

const LOCAL_STORAGE_KEY = "my-dashboard"

export function useLocalStorage<T>(initialValue: T, key = LOCAL_STORAGE_KEY) {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setValue(JSON.parse(item) as T)
    } catch (err) {
      console.error(err)
    }
  }, [key])

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }
  }, [key, value])

  return [value, setValue] as const
}
