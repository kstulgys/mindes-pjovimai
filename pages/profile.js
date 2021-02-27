import { useState, useEffect } from 'react'
import { Auth, withSSRContext } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function Profile({username, authenticated}) {
    console.log({username})
    console.log({authenticated})

//   const [user, setUser] = useState(null)
//   useEffect(() => {
//     // Access the user session on the client
//     Auth.currentAuthenticatedUser()
//       .then(user => {
//         console.log("User: ", user)
//         setUser(user)
//       })
//       .catch(err => setUser(null))
//   }, [])
  return (
    <div>
      { authenticated && <h1>Welcome, {username}</h1> }
      <AmplifySignOut />
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
    const { Auth } = withSSRContext({ req })
    try {
      const user = await Auth.currentAuthenticatedUser()
      console.log({user})
      return {
        props: {
          authenticated: true,
          username: user.username
        }
      }
    } catch (err) {
      res.writeHead(302, { Location: '/auth' })
      res.end()
    }
    return {props: {}}
  }

export default withAuthenticator(Profile)