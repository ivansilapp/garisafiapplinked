import { useState } from 'react'
import { Outlet } from 'react-router-dom'
// @mui
import { Box } from '@mui/material'
// hooks
import { ErrorBoundary } from 'react-error-boundary'
import useResponsive from '../../hooks/useResponsive'
// components
import { useSettingsContext } from '../../components/settings'
//
import Main from './Main'
import Header from './header'
import NavMini from './nav/NavMini'
import NavVertical from './nav/NavVertical'
import NavHorizontal from './nav/NavHorizontal'
// import Page500 from '../../pages/Page500'
import InternalError from '../../components/shared/500Error'
import { fallbackRender } from '../../auth/utils'

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    const { themeLayout } = useSettingsContext()

    const isDesktop = useResponsive('up', 'lg', '')

    const [open, setOpen] = useState(false)

    const isNavHorizontal = themeLayout === 'horizontal'

    const isNavMini = themeLayout === 'mini'

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const renderNavVertical = (
        <NavVertical openNav={open} onCloseNav={handleClose} />
    )

    if (isNavHorizontal) {
        return (
            <>
                <Header onOpenNav={handleOpen} />

                {isDesktop ? <NavHorizontal /> : renderNavVertical}

                <Main>
                    <Outlet />
                </Main>
            </>
        )
    }

    if (isNavMini) {
        return (
            <>
                <Header onOpenNav={handleOpen} />

                <Box
                    sx={{
                        display: { lg: 'flex' },
                        minHeight: { lg: 1 },
                    }}
                >
                    {isDesktop ? <NavMini /> : renderNavVertical}

                    <Main>
                        <Outlet />
                    </Main>
                </Box>
            </>
        )
    }

    return (
        <>
            <Header onOpenNav={handleOpen} />
            <Box
                sx={{
                    display: { lg: 'flex' },
                    minHeight: { lg: 1 },
                }}
            >
                {renderNavVertical}

                <Main>
                    <ErrorBoundary
                        // fallback={<InternalError error="Error loading page" />}
                        fallbackRender={fallbackRender}
                        onReset={(details) => {
                            window.history.back()
                        }}
                    >
                        <Outlet />
                    </ErrorBoundary>
                </Main>
            </Box>
        </>
    )
}
