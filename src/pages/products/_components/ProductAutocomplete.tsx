/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
// import useSWR from 'swr'
import { useSnackbar } from '../../../components/snackbar'
import { apiUrl } from '../../../config-global'
import axios from '../../../utils/axios'

export default function ProductAutocomplete({ setProduct, reset }: any) {
    const url = `${apiUrl}/product/search/`

    const [open, setOpen] = useState(false)
    const [productLoader, setProductLoader] = useState(false)
    const [products, setProducts] = useState([])

    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (val: any) => {
        setProduct(structuredClone(val))
        if (reset) {
            setProducts([])
        }
    }

    const fetchProducts = async (e: any) => {
        try {
            const { value } = e.target
            if (value?.trim() === '') return
            setProductLoader(true)
            const { data } = await axios.get(`${url}${value}`)

            if (data.products) {
                setProducts(data.products)
            } else {
                setProducts([])
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setProductLoader(false)
        }
    }

    return (
        <Autocomplete
            id="product-autocomplete"
            clearOnEscape
            // sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}
            isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
            }
            getOptionLabel={(option) => option.name}
            options={products}
            loading={productLoader}
            onChange={(e, value) => {
                handleChange(value)
                // console.log(value, 'value')
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search product"
                    onChange={fetchProducts}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {productLoader ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}
