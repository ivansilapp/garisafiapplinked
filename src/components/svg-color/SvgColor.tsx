import { forwardRef } from 'react'
// @mui
import { Box } from '@mui/material'

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const SvgColor = forwardRef(({ src, sx, ...other }: any, ref) => (
    <Box
        component="span"
        className="svg-color"
        ref={ref}
        sx={{
            width: 24,
            height: 24,
            display: 'inline-block',
            bgcolor: 'currentColor',
            mask: `url(${src}) no-repeat center / contain`,
            WebkitMask: `url(${src}) no-repeat center / contain`,
            ...sx,
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
    />
))

export default SvgColor
