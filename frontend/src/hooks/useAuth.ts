import { useState, useEffect, useCallback } from 'react'
import { authApi } from '@/api/auth'
import type { MemberProfile } from '@/types'

let _member: MemberProfile | null = null
const listeners = new Set<() => void>()

function notify() { listeners.forEach((fn) => fn()) }

export function useAuth() {
  const [member, setMember] = useState<MemberProfile | null>(_member)

  useEffect(() => {
    const sync = () => setMember(_member)
    listeners.add(sync)
    return () => { listeners.delete(sync) }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem('token', res.token)
    _member = res.member
    notify()
  }, [])

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    const res = await authApi.register({ firstName, lastName, email, password })
    localStorage.setItem('token', res.token)
    _member = res.member
    notify()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    _member = null
    notify()
  }, [])

  const loadMe = useCallback(async () => {
    if (!localStorage.getItem('token')) return
    try {
      _member = await authApi.me()
      notify()
    } catch {
      localStorage.removeItem('token')
    }
  }, [])

  return { member, login, register, logout, loadMe }
}
