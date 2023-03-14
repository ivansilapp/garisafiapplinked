/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import { Badge, Avatar } from '@mui/material'

// ----------------------------------------------------------------------

const getCharAtName = (name: any) => name && name.charAt(0).toUpperCase()

const getColorByName = (name: any) => {
    if (['A', 'N', 'H', 'L', 'Q'].includes(getCharAtName(name)))
        return 'primary'
    if (['F', 'G', 'T', 'I', 'J'].includes(getCharAtName(name))) return 'info'
    if (['K', 'D', 'Y', 'B', 'O'].includes(getCharAtName(name)))
        return 'success'
    if (['P', 'E', 'R', 'S', 'U'].includes(getCharAtName(name)))
        return 'warning'
    if (['V', 'W', 'X', 'M', 'Z'].includes(getCharAtName(name))) return 'error'
    return 'default'
}

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const CustomAvatar = forwardRef(
    ({ color, name = '', BadgeProps, children, sx, ...other }: any, ref) => {
        const theme: any = useTheme()

        const charAtName = getCharAtName(name)

        const colorByName = getColorByName(name)

        const colr = color || colorByName

        const renderContent =
            colr === 'default' ? (
                <Avatar ref={ref} sx={sx} {...other}>
                    {name && charAtName}
                    {children}
                </Avatar>
            ) : (
                <Avatar
                    ref={ref}
                    sx={{
                        color: theme.palette[colr]?.contrastText,
                        backgroundColor: theme.palette[colr]?.main,
                        fontWeight: theme.typography.fontWeightMedium,
                        ...sx,
                    }}
                    {...other}
                >
                    {name && charAtName}
                    {children}
                </Avatar>
            )

        return BadgeProps ? (
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                {...BadgeProps}
            >
                {renderContent}
            </Badge>
        ) : (
            renderContent
        )
    }
)

export default CustomAvatar
