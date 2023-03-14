/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types'
import { memo } from 'react'
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

// ----------------------------------------------------------------------

function NavHorizontal() {
    const theme = useTheme()

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
                <NavSectionHorizontal data={navConfig} />
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
