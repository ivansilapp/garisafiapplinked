import {
    createContext,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
} from 'react'
// utils
import axios from '../utils/axios'
import localStorageAvailable from '../utils/localStorageAvailable'
//
import { isValidToken, jwtDecode, renewAccess, setSession } from './utils'

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
}

const reducer = (state: any, action: any) => {
    if (action.type === 'INITIAL') {
        return {
            isInitialized: true,
            isAuthenticated: action.payload.isAuthenticated,
            user: action.payload.user,
        }
    }
    if (action.type === 'LOGIN') {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
        }
    }
    if (action.type === 'REGISTER') {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
        }
    }
    if (action.type === 'LOGOUT') {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
        }
    }

    return state
}

// ----------------------------------------------------------------------

export const AuthContext = createContext(null)

// ----------------------------------------------------------------------

// AuthProvider.propTypes = {
//   children: PropTypes.node,
// };

export function AuthProvider({ children }: any) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const storageAvailable = localStorageAvailable()

    const initialize = useCallback(async () => {
        const dispatchNotLogedIn = () =>
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            })

        const dispatchLogedIn = (user: any) =>
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: true,
                    user,
                },
            })

        try {
            const accessToken = storageAvailable
                ? localStorage.getItem('accessToken')
                : ''
            const refreshToken = storageAvailable
                ? localStorage.getItem('refreshToken')
                : ''

            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken)

                // const response = await axios.get('/api/account/my-account')

                // const { user } = response.data
                const user = jwtDecode(accessToken)

                dispatchLogedIn({
                    email: user.username,
                    role: user.role,
                    name: user.username,
                })
            } else {
                //  attempt renewing token
                // eslint-disable-next-line no-lonely-if
                if (refreshToken && isValidToken(refreshToken)) {
                    const response = await renewAccess()
                    const data = response ? response?.data : null

                    if (data && data?.accessToken) {
                        //
                        localStorage.setItem('accessToken', data.accessToken)
                        const user = jwtDecode(data.accessToken)

                        dispatchLogedIn({
                            email: user.username,
                            role: user.role,
                            name: user.username,
                        })
                    }
                } else {
                    dispatchNotLogedIn()
                }
            }
        } catch (error) {
            console.error(error)
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            })
        }
    }, [storageAvailable])

    useEffect(() => {
        initialize()
    }, [initialize])

    // LOGIN
    const login = useCallback(async (email: string, password: string) => {
        const response = await axios.post('/login', {
            email,
            password,
        })

        const { accessToken, refreshToken, user } = response.data

        //  console.log(accessToken, refreshToken, user, 'Response data')

        setSession(accessToken)

        if (refreshToken && accessToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }, [])

    // REGISTER
    const register = useCallback(
        async (email: any, password: any, firstName: any, lastName: any) => {
            const response = await axios.post('/api/account/register', {
                email,
                password,
                firstName,
                lastName,
            })
            const { accessToken, user } = response.data

            localStorage.setItem('accessToken', accessToken)

            dispatch({
                type: 'REGISTER',
                payload: {
                    user,
                },
            })
        },
        []
    )

    // check auth status
    const checkAuthStatus = useCallback(() => {
        const accessToken = storageAvailable
            ? localStorage.getItem('accessToken')
            : null

        if (accessToken && isValidToken(accessToken)) {
            return true
        }
        setSession(null)
        dispatch({
            type: 'LOGOUT',
        })
        return false
    }, [storageAvailable])

    // LOGOUT
    const logout = useCallback(() => {
        setSession(null)
        dispatch({
            type: 'LOGOUT',
        })
    }, [])

    const memoizedValue: any = useMemo(
        () => ({
            isInitialized: state.isInitialized,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            method: 'jwt',
            login,
            register,
            logout,
            checkAuthStatus,
        }),
        [
            state.isAuthenticated,
            state.isInitialized,
            state.user,
            login,
            logout,
            register,
            checkAuthStatus,
        ]
    )

    return (
        <AuthContext.Provider value={memoizedValue}>
            {children}
        </AuthContext.Provider>
    )
}
