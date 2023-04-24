import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// @mui
import { Box, Stack, Drawer } from '@mui/material'
// hooks
import useResponsive from '../../../hooks/useResponsive'
// config
import { NAV } from '../../../config-global'
// components
import Logo from '../../../components/logo'
import Scrollbar from '../../../components/scrollbar'
import { NavSectionVertical } from '../../../components/nav-section'
//
import navConfig from './config-navigation'
import NavDocs from './NavDocs'
import NavAccount from './NavAccount'
import NavToggleButton from './NavToggleButton'
import useUser from '../../../hooks/user/useUser'
import { useAuthContext } from '../../../auth/useAuthContext'

// ----------------------------------------------------------------------

// NavVertical.propTypes = {
//   openNav: PropTypes.bool,
//   onCloseNav: PropTypes.func,
// };

export default function NavVertical({ openNav, onCloseNav }: any) {
    const { pathname } = useLocation()
    const { user }: any = useAuthContext()

    const [navData, setNavData] = useState<any>([])

    const isDesktop = useResponsive('up', 'lg', '')

    useEffect(() => {
        if (openNav) {
            onCloseNav()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    useEffect(() => {
        if (user) {
            const { role } = user
            const data = navConfig
                .map((item: any) => {
                    const items = item?.items?.filter((navItem: any) => {
                        return navItem?.role?.includes(role)
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
            // console.log(data, 'data')
            setNavData(data)
        }
    }, [user])

    const renderContent = (
        // eslint-disable-next-line react/jsx-filename-extension
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Stack
                spacing={3}
                sx={{
                    pt: 3,
                    pb: 2,
                    px: 2.5,
                    flexShrink: 0,
                }}
            >
                <Logo />

                <NavAccount />
            </Stack>

            <NavSectionVertical data={navData} />

            <Box sx={{ flexGrow: 1 }} />

            <NavDocs />
        </Scrollbar>
    )

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_DASHBOARD },
            }}
        >
            <NavToggleButton />

            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            zIndex: 0,
                            width: NAV.W_DASHBOARD,
                            bgcolor: 'transparent',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {
                            width: NAV.W_DASHBOARD,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    )
}
