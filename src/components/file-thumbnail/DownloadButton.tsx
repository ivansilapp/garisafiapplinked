import PropTypes from 'prop-types'
// @mui
import { useTheme } from '@mui/material/styles'
import { IconButton } from '@mui/material'
// utils
import { bgBlur } from '../../utils/cssStyles'
//
import Iconify from '../iconify'

// ----------------------------------------------------------------------

// DownloadButton.propTypes = {
//   onDownload: PropTypes.func,
// };

export default function DownloadButton({ onDownload }: any) {
    const theme: any = useTheme()

    const styles: any = {
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: 'absolute',
        borderRadius: 'unset',
        // color: 'common.white',
        justifyContent: 'center',
        bgcolor: 'grey.800',
        color: 'common.white',
        transition: theme.transitions.create('opacity'),

        '&:hover': {
            opacity: 1,
            ...bgBlur({
                opacity: 0.64,
                color: theme.palette.grey[900],
            }),
        },
    }

    return (
        <IconButton
            // color="inherit"
            onClick={onDownload}
            sx={styles}
        >
            <Iconify icon="eva:arrow-circle-down-fill" width={24} />
        </IconButton>
    )
}
