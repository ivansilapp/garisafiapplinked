import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
// routes
import axios from 'axios'
import { PATH_AUTH } from '../../routes/paths'
// components
import FormProvider, { RHFTextField } from '../../components/hook-form'
import { apiUrl } from '../../config-global'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email must be a valid email address'),
    })

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { email: '' },
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: any) => {
        try {
            // eslint-disable-next-line no-promise-executor-return, @typescript-eslint/no-implied-eval
            const response = await axios.get(
                `${apiUrl}/password-reset-request/${data.email}`
            )
            if (response.status === 200) {
                sessionStorage.setItem('email-recovery', data.email)
                navigate(PATH_AUTH.newPassword)
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
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="email" label="Email address" />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ mt: 3 }}
            >
                Send Request
            </LoadingButton>
        </FormProvider>
    )
}
