import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMemo } from 'react'
import { Box, Button, Stack } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import FormProvider, {
    RHFSelect,
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
} from '../../../../components/hook-form'
import { useSnackbar } from '../../../../components/snackbar'

function BodyTypeForm({ type, onSubmit, loading, handleClose }: any) {
    const { enqueueSnackbar } = useSnackbar()
    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Body type is required'),
    })

    const defaultValues = useMemo(
        () => ({
            name: type?.name || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [type]
    )
    const isEdit = type?.id && type.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ py: 2 }}>
                <RHFTextField name="name" label="Body type" />
            </Box>

            <Stack alignItems="flex-end " sx={{ mt: 3 }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        paddingBottom: '8px',
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {!isEdit ? 'Save' : 'Save Changes'}
                    </LoadingButton>
                </div>
            </Stack>
        </FormProvider>
    )
}

export default BodyTypeForm
