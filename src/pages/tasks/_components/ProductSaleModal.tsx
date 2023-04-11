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
import VehicleAutocomplete from '../../system_data/_components/vehicle/VehicleAutocomplete'

export default function ProductSaleModal({
    open,
    setProduct,
    productName,
    vehicleReg,
    setVehicle,
    setAddVehicleModal,
    setQuantity,
    quantity,
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
                    {productName ? (
                        <TextField
                            label="Product"
                            defaultValue={productName}
                            disabled
                        />
                    ) : (
                        <ProductAutocomplete setProduct={setProduct} />
                    )}

                    {vehicleReg ? (
                        <TextField
                            label="Vehicle"
                            defaultValue={vehicleReg}
                            disabled
                        />
                    ) : (
                        <VehicleAutocomplete
                            setVehicle={setVehicle}
                            setAddVehicleModal={setAddVehicleModal}
                        />
                    )}

                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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
                                Record sale
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
