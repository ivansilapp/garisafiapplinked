import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import ProductAutocomplete from '../../products/_components/ProductAutocomplete'
import VehicleAutocomplete from '../../system_data/_components/vehicle/VehicleAutocomplete'
import { RHFSelect } from '../../../components/hook-form'

export default function ProductSaleModal({
    open,
    setProduct,
    productName,
    vehicleReg,
    vehicle,
    setVehicle,
    cancel,
    setAddVehicleModal,
    setQuantity,
    quantity,
    handleClose,
    handleSubmit,
    loading,
    accounts,
    account,
    reference,
    hasReference,
    setReference,
    handleAccountChange,
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
                            activeVehicle={vehicle ?? null}
                        />
                    )}

                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <Select
                        labelId="account-selection-label"
                        id="account-selection"
                        value={account}
                        label="Account"
                        name="account"
                        onChange={handleAccountChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {accounts.map((ac: any) => {
                            return (
                                <MenuItem key={ac.id} value={ac.id}>
                                    {ac.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <TextField
                        fullWidth
                        id="reference-txt"
                        label="Payment reference"
                        variant="outlined"
                        value={reference}
                        disabled={hasReference}
                        onChange={(e) => {
                            setReference(e.target.value)
                        }}
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
