// import React from 'react'
// import { Auth } from 'aws-amplify'


// function useProtectedClient(){
//     const [user, setUser] = React.useState(null)
//     const router = useRouter()

//     React.useEffect(() => {
//       Auth.currentAuthenticatedUser()
//         .then(user => setUser(user))
//         .catch(() => router.push('/auth'))
//     }, [])

//   return user
// }

// function withAuth(WrappedComponent) {
//   const user = useProtectedClient()

//   if (!user){
//     return 
//   }
//   // return class extends React.Component {
//   //   componentDidUpdate(prevProps) {
//   //     console.log('Current props: ', this.props);
//   //     console.log('Previous props: ', prevProps);
//   //   }
//   //   render() {
//   //     // Wraps the input component in a container, without mutating it. Good!
//   //     return <WrappedComponent {...this.props} />;
//   //   }
//   // }
// }



