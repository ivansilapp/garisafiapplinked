import PropTypes from 'prop-types'
import { m } from 'framer-motion'
// @mui
import { Box } from '@mui/material'
//
import { varFade } from './variants'

// ----------------------------------------------------------------------

// TextAnimate.propTypes = {
//     text: PropTypes.string,
//     variants: PropTypes.object,
//     sx: PropTypes.object,
// }

export default function TextAnimate({ text, variants, sx, ...other }: any) {
    return (
        <Box
            component={m.div}
            sx={{
                m: 0,
                typography: 'h1',
                overflow: 'hidden',
                display: 'inline-flex',
                ...sx,
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        >
            {text.split('').map((letter: string, index: number) => (
                <m.span
                    key={`_${letter}`}
                    variants={variants || varFade({}).inUp}
                >
                    {letter}
                </m.span>
            ))}
        </Box>
    )
}
