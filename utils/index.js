import React from 'react'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/router'

export function useAuthUser(){
  const [user, setUser] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const router = useRouter()

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => router.push('/auth')).finally(() => setIsLoading(false))
  }, [])

  return { isLoading, user }
}



