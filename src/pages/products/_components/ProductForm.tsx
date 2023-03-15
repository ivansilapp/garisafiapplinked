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
    RHFTextField,
    RHFSwitch,
} from '../../../components/hook-form'
import { useSnackbar } from '../../../components/snackbar'

function ProductForm({ product, onSubmit, handleClose }: any) {
    // const { enqueueSnackbar } = useSnackbar()

    const NewProductSchema = Yup.object().shape({
        name: Yup.string().required('Attendant name required'),
        price: Yup.string().required('Attendant phone required'),
        inStock: Yup.bool(),
    })

    const defaultValues = useMemo(
        () => ({
            name: product?.name || '',
            price: product?.price || '',
            inStock: product?.inStock || true,
        }),
        [product]
    )
    const isEdit = product?.id && product.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
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
                <RHFTextField name="name" label="Product name" />
                <RHFTextField name="price" label="price" />
                <RHFSwitch name="inStock" label="Availability" />
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
                        disabled={isSubmitting}
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

export default ProductForm
