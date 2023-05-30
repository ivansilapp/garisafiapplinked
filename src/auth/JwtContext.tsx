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
    rights: [],
    modules: [],
}

const reducer = (state: any, action: any) => {
    if (action.type === 'INITIAL') {
        return {
            isInitialized: true,
            isAuthenticated: action.payload.isAuthenticated,
            user: action.payload.user,
            rights: action.payload?.rights,
            modules: action.payload?.modules,
        }
    }
    if (action.type === 'LOGIN') {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
            rights: action.payload?.rights,
            modules: action.payload?.modules,
            settings: action.payload?.settings,
            accounts: action.payload?.accounts,
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
            modules: [],
            rights: [],
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
                    rights: [],
                    modules: [],
                    settings: null,
                    accounts: [],
                },
            })

        const dispatchLogedIn = (
            user: any,
            rights: any,
            modules: any,
            settings: any,
            accounts: any
        ) =>
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: true,
                    user,
                    rights,
                    modules,
                    settings,
                    accounts,
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

                const rights = localStorage.getItem('rights')
                    ? JSON.parse(localStorage.getItem('rights') ?? '')
                    : []
                const modules = localStorage.getItem('modules')
                    ? JSON.parse(localStorage.getItem('modules') ?? '')
                    : []
                const settings = localStorage.getItem('system_settings')
                    ? JSON.parse(localStorage.getItem('system_settings') ?? '')
                    : null
                const accounts = localStorage.getItem('accounts')
                    ? JSON.parse(localStorage.getItem('accounts') ?? '')
                    : []

                // const response = await axios.get('/api/account/my-account')

                // const { user } = response.data
                const user = jwtDecode(accessToken)

                dispatchLogedIn(
                    {
                        email: user.username,
                        role: user.role,
                        name: user.username,
                    },
                    rights,
                    modules,
                    settings,
                    accounts
                )
            } else {
                //  attempt renewing token
                // eslint-disable-next-line no-lonely-if
                if (refreshToken && isValidToken(refreshToken)) {
                    const response = await renewAccess()
                    const data = response ? response?.data : null

                    if (data && data?.accessToken) {
                        const { rights, modules, settings, accounts } = data
                        //
                        localStorage.setItem('accessToken', data.accessToken)
                        const user = jwtDecode(data.accessToken)

                        dispatchLogedIn(
                            {
                                email: user.username,
                                role: user.role,
                                name: user.username,
                            },
                            rights,
                            modules,
                            settings,
                            accounts
                        )
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

        const {
            accessToken,
            refreshToken,
            user,
            rights,
            modules,
            settings,
            accounts,
        } = response.data

        //  console.log(accessToken, refreshToken, user, 'Response data')
        if (localStorageAvailable()) {
            localStorage.setItem('rights', JSON.stringify(rights))
            localStorage.setItem('modules', JSON.stringify(modules))
            localStorage.setItem('system_settings', JSON.stringify(settings))
            localStorage.setItem('accounts', JSON.stringify(accounts))
        }
        setSession(accessToken)

        // console.log('returned modules  -->', modules)

        if (refreshToken && accessToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
                rights,
                modules,
                settings,
                accounts,
            },
        })
    }, [])

    // REGISTER
    const register = useCallback(
        async (email: any, password: any, firstName: any, lastName: any) => {
            const response = await axios.post('/user', {
                email,
                password,
                firstName,
                name: `${firstName} ${lastName}`,
                lastName,
                role: 'ADMIN',
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
            rights: state.rights,
            modules: state.modules,
            settings: state.settings,
            accounts: state.accounts,
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
            state.rights,
            state.modules,
            state.settings,
            state.accounts,
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
