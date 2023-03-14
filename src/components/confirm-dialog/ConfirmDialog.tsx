// @mui
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material'

// ----------------------------------------------------------------------

export default function ConfirmDialog({
    title,
    content,
    action,
    open,
    onClose,
    ...other
}: any) {
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={onClose}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        >
            <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

            {content && (
                <DialogContent sx={{ typography: 'body2' }}>
                    {' '}
                    {content}{' '}
                </DialogContent>
            )}

            <DialogActions>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancel
                </Button>

                {action}
            </DialogActions>
        </Dialog>
    )
}
