import { useContext } from 'react'
//
import { AuthContext } from './JwtContext'
// import { AuthContext } from './Auth0Context';
// import { AuthContext } from './FirebaseContext';
// import { AuthContext } from './AwsCognitoContext';

// ----------------------------------------------------------------------

// eslint-disable-next-line import/prefer-default-export
export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context)
        throw new Error(
            'useAuthContext context must be use inside AuthProvider'
        )

    return context
}
