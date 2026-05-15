'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const initializeSession = async () => {

      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("INITIAL SESSION:", session)

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {

      console.log("AUTH EVENT:", event)
      console.log("CURRENT SESSION:", currentSession)

      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setIsLoading(false)

    })

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)