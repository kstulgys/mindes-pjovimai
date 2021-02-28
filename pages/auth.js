import React from 'react'
import { Auth, withSSRContext } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifyChatbot } from '@aws-amplify/ui-react'
import { useRouter } from 'next/router'


export async function getServerSideProps({ req, res }) {
    const { Auth } = withSSRContext({ req });
    try {
        await Auth.currentAuthenticatedUser();
        return {
            redirect: {
            destination: '/app',
            permanent: false,
        },
    }
    } catch (err) {}
    return {props: {}}
}


function AuthPage() {
    const router = useRouter()
    React.useEffect(() => {
      Auth.currentAuthenticatedUser()
        .then(user => router.push('/app'))
        .catch(() => {})
    }, [])
  return null
}

export default withAuthenticator(AuthPage)






