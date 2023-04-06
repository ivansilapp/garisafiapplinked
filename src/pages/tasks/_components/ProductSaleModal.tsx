import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'
import ProductAutocomplete from '../../products/_components/ProductAutocomplete'

export default function ProductSaleModal({
    open,
    setProduct,
    handleClose,
    handleSubmit,
    loading,
}: any) {
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={() => handleClose(false)}
        >
            <DialogTitle>Add product</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }} gap={3} display="grid">
                    <ProductAutocomplete setProduct={setProduct} />

                    <TextField
                        label="Quantity"
                        type="number"
                        defaultValue={1}
                    />
                    <Stack alignItems="flex-end" sx={{ my: 3 }}>
                        <Box gap={2} display="flex">
                            <Button
                                color="warning"
                                variant="contained"
                                onClick={() => handleClose(false)}
                            >
                                Cancel
                            </Button>
                            <LoadingButton
                                loading={loading}
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Add product
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
