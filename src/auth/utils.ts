// /import isAfter from 'date-fns/isAfter'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'

// routes
import { PATH_AUTH } from '../routes/paths'
// utils
import axios from '../utils/axios'
import localStorageAvailable from '../utils/localStorageAvailable'

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    )

    return JSON.parse(jsonPayload)
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string | null) => {
    if (!accessToken) {
        return false
    }

    const decoded = jwtDecode(accessToken)

    const currentTime = Date.now()

    const expiresAt: any = new Date(decoded.expiresAt)

    // const isA = isAfter(expiresAt, currentTime)
    const timeLeft = differenceInMilliseconds(expiresAt, currentTime)
    // console.log(expiresAt, currentTime, 'isValidToken', timeLeft)

    return timeLeft > 0
}

// ----------------------------------------------------------------------

export const renewAccess = () => {
    const isLocalStorageAvailable = localStorageAvailable()

    const refreshToken = isLocalStorageAvailable
        ? localStorage.getItem('refreshToken')
        : null

    const accessToken = isLocalStorageAvailable
        ? localStorage.getItem('accessToken')
        : null

    if (!refreshToken) {
        console.log('Refresh token null', refreshToken)
        return null
    }

    const isRefreshTokenValid = isValidToken(refreshToken ?? '')

    if (!isRefreshTokenValid) {
        console.log('Refesh token invalid', refreshToken)
        return null
    }

    if (isValidToken(accessToken)) {
        console.log('Access token is still valid', accessToken)
        return null
    }

    return axios.post('/renew-access', {
        refreshToken,
    })
}

// ----------------------------------------------------------------------

export const tokenExpired = (exp: any) => {
    // eslint-disable-next-line prefer-const
    let expiredTimer

    const currentAccessToken = localStorage.getItem('accessToken') ?? null

    //  const currentTime = Date.now()

    // Test token expires after 10s
    // const timeLeft = currentTime + 10000 - currentTime; // ~10s
    // const timeLeft = exp * 1000 - currentTime

    const timeLeft = differenceInMilliseconds(new Date(exp), new Date())

    // console.log(timeLeft, 'time left')

    clearTimeout(expiredTimer)

    // console.log('time left', timeLeft)

    expiredTimer = setTimeout(async () => {
        // alert('Token expired')
        // console.log('Checking token expiry timer', timeLeft)
        const resp = await renewAccess()
        if (!resp) {
            if (!isValidToken(currentAccessToken)) {
                alert('Token expired')
                localStorage.removeItem('accessToken')
                window.location.href = PATH_AUTH.login
            }
        } else {
            // renew session
            const { accessToken } = resp.data
            console.log('renewing token with ', accessToken)

            if (accessToken) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                setSession(accessToken)
            } else {
                alert('Token expired')
                localStorage.removeItem('accessToken')
                window.location.href = PATH_AUTH.login
            }
        }
    }, timeLeft)
}

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

        // This function below will handle when token is expired
        const { expiresAt } = jwtDecode(accessToken) // ~3 days by minimals server
        tokenExpired(new Date(expiresAt))
    } else {
        const refreshToken = localStorageAvailable()
            ? localStorage.getItem('refreshToken')
            : null

        if (refreshToken && isValidToken(refreshToken)) {
            axios.post('/logout', { refreshToken })
            localStorage.removeItem('refreshToken')
        }

        localStorage.removeItem('accessToken')

        delete axios.defaults.headers.common.Authorization
    }
}
