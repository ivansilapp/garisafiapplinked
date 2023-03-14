import PropTypes from 'prop-types'
// @mui
import { Popover, useTheme } from '@mui/material'
//
import getPosition from './getPosition'
import { StyledArrow } from './styles'

// ----------------------------------------------------------------------

export default function MenuPopover({
    open,
    children,
    arrow = 'top-right',
    disabledArrow,
    sx,
    ...other
}: any) {
    const { style, anchorOrigin, transformOrigin } = getPosition(arrow)

    const theme: any = useTheme()

    return (
        <Popover
            open={Boolean(open)}
            anchorEl={open}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            PaperProps={{
                sx: {
                    p: 1,
                    width: 'auto',
                    overflow: 'inherit',
                    ...style,
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': {
                            mr: 2,
                            width: 20,
                            height: 20,
                            flexShrink: 0,
                        },
                    },
                    ...sx,
                },
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        >
            {!disabledArrow && <StyledArrow theme={theme} arrow={arrow} />}

            {children}
        </Popover>
    )
}
