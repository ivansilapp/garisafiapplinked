import PropTypes from 'prop-types'
import { m } from 'framer-motion'
// @mui
import { Box } from '@mui/material'
// hooks
import useResponsive from '../../hooks/useResponsive'
//
import { varContainer } from './variants'

// ----------------------------------------------------------------------

// MotionViewport.propTypes = {
//     children: PropTypes.node,
//     disableAnimatedMobile: PropTypes.bool,
// }

export default function MotionViewport({
    children,
    disableAnimatedMobile = true,
    ...other
}: any) {
    const isMobile = useResponsive('down', 'sm', '')

    if (isMobile && disableAnimatedMobile) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Box {...other}>{children}</Box>
    }

    return (
        <Box
            component={m.div}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={varContainer({})}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        >
            {children}
        </Box>
    )
}
