import React from 'react'
import { Auth, withSSRContext, Hub } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifyChatbot } from '@aws-amplify/ui-react'
import { useRouter } from 'next/router'
import { useAuthUser } from '../utils'

function AuthPage() {
	const [showLogin, setShowLogin] = React.useState(false)
	const router = useRouter()

	const redirectAuthUser = () => router.push('/app')

	React.useEffect(() => {
		Hub.listen('auth', ({payload: {event}}) => {
			if (event === 'signIn' || event === 'signUp') return redirectAuthUser()
			setShowLogin(true)
		})

		Auth.currentAuthenticatedUser()
		.then(() => redirectAuthUser())
		.catch(() => setShowLogin(true))
	},[])

  if (!showLogin) return null
  return <AmplifyAuthenticator/>
}

export default AuthPage






