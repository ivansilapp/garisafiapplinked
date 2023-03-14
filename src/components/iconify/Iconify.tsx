import PropTypes from 'prop-types'
import { forwardRef } from 'react'
// icons
import { Icon } from '@iconify/react'
// @mui
import { Box } from '@mui/material'

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const Iconify = forwardRef(({ icon, width = 20, sx, ...other }: any, ref) => (
    <Box
        ref={ref}
        component={Icon}
        icon={icon}
        sx={{ width, height: width, ...sx }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
    />
))

export default Iconify
