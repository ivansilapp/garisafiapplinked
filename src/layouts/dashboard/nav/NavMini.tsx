// @mui
import { Stack, Box } from '@mui/material'
// config
import { useEffect, useState } from 'react'
import { NAV } from '../../../config-global'
// utils
import { hideScrollbarX } from '../../../utils/cssStyles'
// components
import Logo from '../../../components/logo'
import { NavSectionMini } from '../../../components/nav-section'
//
import navConfig from './config-navigation'
import NavToggleButton from './NavToggleButton'
import { useAuthContext } from '../../../auth/useAuthContext'

// ----------------------------------------------------------------------

export default function NavMini() {
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
                        return {
                            ...item,
                            items,
                        }
                    }
                    return null
                })
                .filter((item: any) => item)
            setNavData(data)
        }
    }, [user, rights])

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_DASHBOARD_MINI },
            }}
        >
            <NavToggleButton
                sx={{
                    top: 22,
                    left: NAV.W_DASHBOARD_MINI - 12,
                }}
            />

            <Stack
                sx={{
                    pb: 2,
                    height: 1,
                    position: 'fixed',
                    width: NAV.W_DASHBOARD_MINI,
                    borderRight: (theme) =>
                        `dashed 1px ${theme.palette.divider}`,
                    ...hideScrollbarX,
                }}
            >
                <Logo sx={{ mx: 'auto', my: 2 }} />

                <NavSectionMini data={navData} />
            </Stack>
        </Box>
    )
}
