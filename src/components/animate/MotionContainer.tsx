import PropTypes from 'prop-types'
import { m } from 'framer-motion'
// @mui
import { Box } from '@mui/material'
//
import { varContainer } from './variants'

// ----------------------------------------------------------------------

// MotionContainer.propTypes = {
//   action: PropTypes.bool,
//   animate: PropTypes.bool,
//   children: PropTypes.node,
// };

export default function MotionContainer({
    animate,
    action = false,
    children,
    ...other
}: any) {
    if (action) {
        return (
            <Box
                component={m.div}
                initial={false}
                animate={animate ? 'animate' : 'exit'}
                variants={varContainer({})}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...other}
            >
                {children}
            </Box>
        )
    }

    return (
        <Box
            component={m.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={varContainer({})}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        >
            {children}
        </Box>
    )
}
