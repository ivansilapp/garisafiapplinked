import PropTypes from 'prop-types'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// components
import LoadingScreen from '../components/loading-screen'
//
import Login from '../pages/auth/LoginPage'
import localStorageAvailable from '../utils/localStorageAvailable'
import { useAuthContext } from './useAuthContext'
import { isValidToken } from './utils'

// ----------------------------------------------------------------------

export default function AAuthGuard({ children }: any) {
    const { isAuthenticated, isInitialized }: any = useAuthContext()

    const { pathname }: any = useLocation()

    const [requestedLocation, setRequestedLocation] = useState(null)

    const isLocalStorageAvailable = localStorageAvailable()

    // checkAuthStatus()

    // console.log(authStatus, 'check auth status')

    // if (!status) {
    //     ini
    // }

    if (!isInitialized) {
        return <LoadingScreen />
    }

    const token = isLocalStorageAvailable
        ? localStorage.getItem('accessToken')
        : null
    const tokenValid = isValidToken(token)

    if (!isAuthenticated || (token && !tokenValid)) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname)
        }
        return <Login />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null)
        return <Navigate to={requestedLocation} />
    }

    return <> {children} </>
}
