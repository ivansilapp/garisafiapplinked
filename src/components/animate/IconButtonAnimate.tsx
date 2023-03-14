import PropTypes from 'prop-types'
import { m } from 'framer-motion'
import { forwardRef } from 'react'
// @mui
import { Box, IconButton } from '@mui/material'

// ----------------------------------------------------------------------

// IconButtonAnimate.propTypes = {
//     children: PropTypes.node,
//     color: PropTypes.oneOf([
//         'inherit',
//         'default',
//         'primary',
//         'secondary',
//         'info',
//         'success',
//         'warning',
//         'error',
//     ]),
//     size: PropTypes.oneOf(['small', 'medium', 'large']),
// }

// ----------------------------------------------------------------------

const varSmall = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
}

const varMedium = {
    hover: { scale: 1.09 },
    tap: { scale: 0.97 },
}

const varLarge = {
    hover: { scale: 1.08 },
    tap: { scale: 0.99 },
}

// AnimateWrap.propTypes = {
//     children: PropTypes.node,
//     size: PropTypes.oneOf(['small', 'medium', 'large']),
// }

function AnimateWrap({ size, children }: any) {
    const isSmall = size === 'small'
    const isLarge = size === 'large'

    return (
        // eslint-disable-next-line react/jsx-filename-extension
        <Box
            component={m.div}
            whileTap="tap"
            whileHover="hover"
            variants={
                (isSmall && varSmall) || (isLarge && varLarge) || varMedium
            }
            sx={{
                display: 'inline-flex',
            }}
        >
            {children}
        </Box>
    )
}
// eslint-disable-next-line react/display-name
const IconButtonAnimate = forwardRef(
    // eslint-disable-next-line react/prop-types
    ({ children, size = 'medium', ...other }: any, ref) => (
        // eslint-disable-next-line react/jsx-filename-extension
        <AnimateWrap size={size}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <IconButton size={size} ref={ref} {...other}>
                {children}
            </IconButton>
        </AnimateWrap>
    )
)
export default IconButtonAnimate
