/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
// import useSWR from 'swr'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'

export default function AttendantAutocomplete({ setAttendant }: any) {
    const url = `${apiUrl}/attendant/search/`

    const [open, setOpen] = useState(false)
    const [attendantLoader, setAttendantLoader] = useState(false)
    const [attendants, setAttendants] = useState([])

    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (val: any) => {
        setAttendant(val)
    }

    const fetchAttendants = async (e: any) => {
        try {
            // fetch attendants from api
            const { value } = e.target
            if (value?.trim() === '') return
            setAttendantLoader(true)
            const { data } = await axios.get(`${url}${value}`)

            if (data.attendants) {
                setAttendants(data.attendants)
            } else {
                setAttendants([])
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setAttendantLoader(false)
        }
    }

    return (
        <Autocomplete
            id="attendant-autocomplete"
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
            options={attendants}
            loading={attendantLoader}
            onChange={(e, value) => {
                handleChange(value)
                // console.log(value, 'value')
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search attendant"
                    onChange={fetchAttendants}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {attendantLoader ? (
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
