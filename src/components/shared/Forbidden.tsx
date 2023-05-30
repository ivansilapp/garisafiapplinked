import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
// @mui
import { Button, Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../animate'
// assets
import { ForbiddenIllustration } from '../../assets/illustrations'

// ----------------------------------------------------------------------

export default function ForbiddenError({
    error,
    resetErrorBoundary,
}: {
    error: string
    resetErrorBoundary: any
}) {
    const getPath = () => {
        const ref = document.referrer
        const url = new URL(ref)
        return url.pathname
    }
    return (
        <MotionContainer
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justify: 'center',
            }}
        >
            <m.div variants={varBounce({}).in}>
                <Typography variant="h3" paragraph>
                    No permission
                </Typography>
            </m.div>

            <m.div variants={varBounce({}).in} style={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>
                    The page you&apos;re trying access has restricted access.
                    <br />
                    <b> {error} </b>
                </Typography>
            </m.div>

            <m.div variants={varBounce({}).in}>
                <ForbiddenIllustration
                    sx={{ height: 260, my: { xs: 5, sm: 10 } }}
                />
            </m.div>

            <Button
                onClick={() => {
                    resetErrorBoundary()
                }}
                size="large"
                variant="contained"
            >
                Go to Back
            </Button>
            {/* <a href={getPath()}>Go back</a> */}
        </MotionContainer>
    )
}
