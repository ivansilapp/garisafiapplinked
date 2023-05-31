/* eslint-disable jsx-a11y/anchor-is-valid */
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Link, Typography } from '@mui/material'
// routes
import axios from 'axios'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { PATH_AUTH } from '../../routes/paths'
// components
import Iconify from '../../components/iconify'
// sections
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm'
// assets
import { SentIcon } from '../../assets/icons'
import { apiUrl } from '../../config-global'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
    const [loader, setLoader] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const emailRecovery =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('email-recovery')
            : ''

    const submit = async () => {
        try {
            setLoader(true)

            if (!emailRecovery) {
                enqueueSnackbar('invalid user email')
                return
            }
            const response = await axios.get(
                `${apiUrl}/password-reset-request/${emailRecovery}`
            )
            if (response.status === 200) {
                enqueueSnackbar('Code sent to your email')
            } else {
                enqueueSnackbar(
                    response.data.error ?? 'Could not complete the request.',
                    { variant: 'error' }
                )
            }
        } catch (error: any) {
            enqueueSnackbar(
                error.message ||
                    error.error ||
                    'Could not complete the request.',
                { variant: 'error' }
            )
        } finally {
            setLoader(false)
        }
    }

    return (
        <>
            <Helmet>
                <title> New Password </title>
            </Helmet>

            <SentIcon sx={{ mb: 5, height: 96 }} />

            <Typography variant="h3" paragraph>
                Request sent successfully!
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                We&apos;ve sent a 6-digit confirmation email to your email.
                <br />
                Please enter the code in below box to verify your email.
            </Typography>

            <AuthNewPasswordForm />

            <Typography variant="body2" sx={{ my: 3 }}>
                Don’t have a code? &nbsp;
                <LoadingButton onClick={submit} loading={loader} color="info">
                    Resend code
                </LoadingButton>
            </Typography>

            <Link
                component={RouterLink}
                to={PATH_AUTH.login}
                color="inherit"
                variant="subtitle2"
                sx={{
                    mx: 'auto',
                    alignItems: 'center',
                    display: 'inline-flex',
                }}
            >
                <Iconify icon="eva:chevron-left-fill" width={16} />
                Return to sign in
            </Link>
        </>
    )
}
