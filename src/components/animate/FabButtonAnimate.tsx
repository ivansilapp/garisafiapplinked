import PropTypes from 'prop-types'
import { m } from 'framer-motion'
import { forwardRef } from 'react'
// @mui
import { Box, Fab } from '@mui/material'

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const FabButtonAnimate = forwardRef(
    ({ size = 'large', children, sx, sxWrap, ...other }: any, ref) => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <AnimateWrap size={size} sxWrap={sxWrap}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Fab ref={ref} size={size} sx={sx} {...other}>
                {children}
            </Fab>
        </AnimateWrap>
    )
)

// FabButtonAnimate.propTypes = {
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
//     sx: PropTypes.object,
//     sxWrap: PropTypes.object,
// }

export default FabButtonAnimate

// ----------------------------------------------------------------------

const varSmall = {
    hover: { scale: 1.07 },
    tap: { scale: 0.97 },
}

const varMedium = {
    hover: { scale: 1.06 },
    tap: { scale: 0.98 },
}

const varLarge = {
    hover: { scale: 1.05 },
    tap: { scale: 0.99 },
}

// AnimateWrap.propTypes = {
//     children: PropTypes.node,
//     size: PropTypes.oneOf(['small', 'medium', 'large']),
//     sxWrap: PropTypes.object,
// }

function AnimateWrap({ size, children, sxWrap }: any) {
    const isSmall = size === 'small'
    const isLarge = size === 'large'

    return (
        <Box
            component={m.div}
            whileTap="tap"
            whileHover="hover"
            variants={
                (isSmall && varSmall) || (isLarge && varLarge) || varMedium
            }
            sx={{
                display: 'inline-flex',
                ...sxWrap,
            }}
        >
            {children}
        </Box>
    )
}
