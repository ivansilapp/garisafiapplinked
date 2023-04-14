import PropTypes from 'prop-types'
// @mui
import { Box, Switch, TablePagination, FormControlLabel } from '@mui/material'

// ----------------------------------------------------------------------

// TablePaginationCustom.propTypes = {
//   dense: PropTypes.bool,
//   onChangeDense: PropTypes.func,
//   rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
//   sx: PropTypes.object,
// };

export default function TablePaginationCustom({
    dense,
    onChangeDense,
    rowsPerPageOptions = [10, 30, 50],
    sx,
    ...other
}: any) {
    return (
        <Box sx={{ position: 'relative', ...sx }}>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...other}
            />

            {onChangeDense && (
                <FormControlLabel
                    label="Dense"
                    control={
                        <Switch checked={dense} onChange={onChangeDense} />
                    }
                    sx={{
                        pl: 2,
                        py: 1.5,
                        top: 0,
                        position: {
                            sm: 'absolute',
                        },
                    }}
                />
            )}
        </Box>
    )
}
