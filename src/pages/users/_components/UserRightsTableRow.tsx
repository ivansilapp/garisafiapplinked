/* eslint-disable @typescript-eslint/naming-convention */
// @mui
import { Checkbox, TableRow, TableCell, Typography } from '@mui/material'
// components

// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function UserRightsTableRow({ row, handleUpdate, rights }: any) {
    const { id, name }: any = row
    const right =
        rights.find((r: any) => Number(r.moduleId) === Number(id)) ?? {}

    const handleChange = async (e: any) => {
        const field = e.target.value ?? null
        const value = e.target.checked ?? false
        await handleUpdate({ id, field, value })
    }

    return (
        <TableRow hover>
            <TableCell>
                <Typography variant="body1">{name}</Typography>
            </TableCell>

            <TableCell align="left">
                <Checkbox
                    onChange={handleChange}
                    checked={right?.read ?? false}
                    value="read"
                />
            </TableCell>

            <TableCell align="left">
                <Checkbox
                    onChange={handleChange}
                    checked={right?.write ?? false}
                    value="write"
                />
            </TableCell>

            <TableCell align="left">
                <Checkbox
                    onChange={handleChange}
                    checked={right?.update ?? false}
                    value="update"
                />
            </TableCell>

            <TableCell align="left">
                <Checkbox
                    onChange={handleChange}
                    checked={right?.delete ?? false}
                    value="delete"
                />
            </TableCell>
        </TableRow>
    )
}
