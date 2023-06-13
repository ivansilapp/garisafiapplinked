/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types'
import { memo, useEffect, useState } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import { AppBar, Box, Toolbar } from '@mui/material'
// config
import { HEADER } from '../../../config-global'
// utils
import { bgBlur } from '../../../utils/cssStyles'
// components
import { NavSectionHorizontal } from '../../../components/nav-section'
//
import navConfig from './config-navigation'
import { useAuthContext } from '../../../auth/useAuthContext'

// ----------------------------------------------------------------------

function NavHorizontal() {
    const theme = useTheme()
    const { user, rights }: any = useAuthContext()
    const [navData, setNavData] = useState<any>([])

    useEffect(() => {
        const modules =
            rights?.map((right: any) => {
                return `/${right.module.url}`
            }) ?? []
        // console.log(modules)
        if (user) {
            const data = navConfig
                .map((item: any) => {
                    const items = item?.items?.filter((navItem: any) => {
                        //  return navItem?.role?.includes(role)
                        return modules.includes(navItem?.path)
                    })

                    if (items.length > 0) {
                        const iWChildren = items.map((iw: any) => {
                            if (iw.children) {
                                const children = iw.children
                                    .filter((c: any) => {
                                        return modules.includes(c?.path)
                                    })
                                    .filter((i: any) => i)
                                return {
                                    ...iw,
                                    children,
                                }
                            }
                            return iw
                        })
                        //  if (items)
                        return {
                            ...item,
                            items: iWChildren,
                        }
                    }
                    return null
                })
                .filter((item: any) => item)
            setNavData(data)
        }
    }, [user, rights])

    const styles: any = {
        ...bgBlur({ color: theme.palette.background.default }),
    }

    return (
        <AppBar
            component="nav"
            color="transparent"
            sx={{
                boxShadow: 0,
                top: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            }}
        >
            <Toolbar sx={styles}>
                <NavSectionHorizontal data={navData} />
            </Toolbar>

            <Shadow />
        </AppBar>
    )
}

export default memo(NavHorizontal)

// ----------------------------------------------------------------------

// Shadow.propTypes = {
//     sx: PropTypes.object,
// }

function Shadow({ sx, ...other }: any) {
    return (
        <Box
            sx={{
                left: 0,
                right: 0,
                bottom: 0,
                height: 24,
                zIndex: -1,
                width: 1,
                m: 'auto',
                borderRadius: '50%',
                position: 'absolute',
                boxShadow: (theme: any) => theme.customShadows.z8,
                ...sx,
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        />
    )
}
