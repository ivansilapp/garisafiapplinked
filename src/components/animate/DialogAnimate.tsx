import PropTypes from 'prop-types'
import { m, AnimatePresence } from 'framer-motion'
// @mui
import { Dialog, Box, Paper } from '@mui/material'
//
import { varFade } from './variants'

// ----------------------------------------------------------------------

// DialogAnimate.propTypes = {
//     sx: PropTypes.object,
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     children: PropTypes.node,
//     variants: PropTypes.object,
// }

export default function DialogAnimate({
    open = false,
    variants,
    onClose,
    children,
    sx,
    ...other
}: any) {
    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={open}
                    onClose={onClose}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    PaperComponent={(props) => (
                        <Box
                            component={m.div}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...(variants ||
                                varFade({
                                    distance: 120,
                                    durationIn: 0.32,
                                    durationOut: 0.24,
                                    easeIn: 'easeInOut',
                                }).inUp)}
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                onClick={onClose}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'fixed',
                                }}
                            />
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Paper sx={sx} {...props}>
                                {/* eslint-disable-next-line react/prop-types */}
                                {props.children}
                            </Paper>
                        </Box>
                    )}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...other}
                >
                    {children}
                </Dialog>
            )}
        </AnimatePresence>
    )
}
