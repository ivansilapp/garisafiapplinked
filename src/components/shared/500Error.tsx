import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Button, Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../animate'
// assets
import { SeverErrorIllustration } from '../../assets/illustrations'

// ----------------------------------------------------------------------

export default function InternalError({ error }: { error: string }) {
    return (
        <>
            {/* <Helmet>
                <title> 500 Internal Server Error | Minimal UI</title>
            </Helmet> */}

            <MotionContainer
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <m.div variants={varBounce({}).in}>
                    <Typography variant="h3" paragraph>
                        500 Internal Server Error
                    </Typography>
                </m.div>

                <m.div variants={varBounce({}).in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {error || 'There was an error, please try again later.'}
                    </Typography>
                </m.div>

                <m.div variants={varBounce({}).in}>
                    <SeverErrorIllustration
                        sx={{ height: 260, my: { xs: 5, sm: 10 } }}
                    />
                </m.div>

                <Button
                    component={RouterLink}
                    to="/"
                    size="large"
                    variant="contained"
                >
                    Go to Home
                </Button>
            </MotionContainer>
        </>
    )
}
