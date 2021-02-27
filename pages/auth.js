import { useState, useEffect } from 'react'
import { Auth, withSSRContext } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { useRouter } from 'next/router'

function AuthPage() {
  return null
}

export async function getServerSideProps({ req, res }) {
    const { Auth } = withSSRContext({ req })
    try {
      await Auth.currentAuthenticatedUser()
      if(req.headers.referer){
        res.writeHead(200, { Location: '/' + req.headers.referer})
      }else {
        res.writeHead(200, { Location: '/'})
      }
      return {props: {}}
    } catch (err) {
      return {props: {}}
    }
  }

export default withAuthenticator(AuthPage)