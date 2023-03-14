/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import { useRef } from 'react'
// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { Stack, TextField } from '@mui/material'
// hooks
import useEventListener from '../../hooks/useEventListener'

// ----------------------------------------------------------------------

// RHFCodes.propTypes = {
//   keyName: PropTypes.string,
//   inputs: PropTypes.arrayOf(PropTypes.string),
// };

export default function RHFCodes({ keyName = '', inputs = [], ...other }: any) {
    const codesRef = useRef(null)

    const { control, setValue } = useFormContext()

    const handlePaste = (event: any) => {
        let data = event.clipboardData.getData('text')

        data = data.split('')

        inputs.map((input: any, index: any) => setValue(input, data[index]))

        event.preventDefault()
    }

    const handleChangeWithNextField = (event: any, handleChange: any) => {
        const { maxLength, value, name }: any = event.target

        const fieldIndex = name.replace(keyName, '')

        const fieldIntIndex = Number(fieldIndex)

        const nextfield: any = document.querySelector(
            `input[name=${keyName}${fieldIntIndex + 1}]`
        )

        if (value.length > maxLength) {
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            event.target.value = value[0]
        }

        if (
            value.length >= maxLength &&
            fieldIntIndex < 6 &&
            nextfield !== null
        ) {
            nextfield.focus()
        }

        handleChange(event)
    }

    useEventListener('paste', handlePaste, codesRef, null)

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            ref={codesRef}
        >
            {inputs.map((name: any, index: any) => (
                <Controller
                    key={name}
                    name={`${keyName}${index + 1}`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            error={!!error}
                            autoFocus={index === 0}
                            placeholder="-"
                            onChange={(event) => {
                                handleChangeWithNextField(event, field.onChange)
                            }}
                            onFocus={(event) => event.currentTarget.select()}
                            InputProps={{
                                sx: {
                                    width: { xs: 36, sm: 56 },
                                    height: { xs: 36, sm: 56 },
                                    '& input': { p: 0, textAlign: 'center' },
                                },
                            }}
                            // eslint-disable-next-line react/jsx-no-duplicate-props
                            inputProps={{
                                maxLength: 1,
                                type: 'number',
                            }}
                            {...other}
                        />
                    )}
                />
            ))}
        </Stack>
    )
}
