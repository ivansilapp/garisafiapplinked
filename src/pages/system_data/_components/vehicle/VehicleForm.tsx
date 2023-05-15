/* eslint-disable react/jsx-props-no-spreading */
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useMemo } from 'react'
import {
    Box,
    Button,
    Stack,
    Autocomplete,
    Chip,
    TextField,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import FormProvider, {
    RHFSelect,
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
} from '../../../../components/hook-form'
import { useSnackbar } from '../../../../components/snackbar'

function VehicleForm({
    vehicle,
    onSubmit,
    loading,
    handleClose,
    clients,
    bodyTypes,
}: any) {
    const { enqueueSnackbar } = useSnackbar()

    const NewVehicleSchema = Yup.object().shape({
        registration: Yup.string().required('Vehicle registration required'),
        clientId: Yup.string(),
        bodyId: Yup.string().required('Body type required'),
        model: Yup.string(),
        points: Yup.number().required('Reward points required'),
    })

    const defaultValues = useMemo(
        () => ({
            registration: vehicle?.registration || '',
            clientId: vehicle?.clientId || '',
            bodyId: vehicle?.bodyId || '',
            model: vehicle?.model || '',
            points: vehicle?.points?.points || 0,
        }),
        [vehicle]
    )
    const isEdit = vehicle?.id && vehicle.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewVehicleSchema),
        defaultValues,
    })

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting },
    } = methods

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{ pt: 3 }}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                }}
            >
                <RHFTextField
                    autoComplete="off"
                    name="registration"
                    label="Registration"
                />

                <RHFTextField autoComplete="off" name="model" label="Model" />

                <RHFSelect native name="bodyId" label="Body type">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {bodyTypes.map((type: any) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </RHFSelect>

                <RHFTextField
                    type="number"
                    autoComplete="off"
                    name="points"
                    label="Reward points"
                />

                <RHFSelect native name="clientId" label="Client">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {clients.map((client: any) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </RHFSelect>
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
                        color="warning"
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

export default VehicleForm
