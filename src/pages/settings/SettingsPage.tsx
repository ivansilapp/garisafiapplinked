/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import useSettings from '../../hooks/settings/useSettings'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'

const defaultCommision = 20.0
const defaultKeyHoles = 60
const defaultCarpet = 30

function SettingsPage() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const { settings } = useSettings()

    const [commission, setCommission] = useState(
        (settings ? settings.commission : 0) || defaultCommision
    )

    const [carpet, setCarpet] = useState(
        (settings ? settings.carpet : 0) || defaultCarpet
    )

    const [keyHoles, setKeyHoles] = useState(
        (settings ? settings.pigeonholes : 0) || defaultKeyHoles
    )

    const handleCommisionChange = (event: any) => {
        const val = parseFloat(event.target.value)

        if (val > 0 && val <= 100) {
            setCommission(val)
            handleSettingsChange({
                pigeonholes: keyHoles,
                commission: val,
                carpet: Number(carpet),
            })
        } else {
            // throw an error
        }
    }

    const handleKeyHolesChange = (event: any) => {
        const val = parseInt(event.target.value, 10)
        // check if val is a number and greater than 0

        if (val > 0) {
            setKeyHoles(val)
            handleSettingsChange({
                pigeonholes: val,
                commission,
                carpet: Number(carpet),
            })
        }
    }

    const handleCarpetChange = (event: any) => {
        const val = event?.target?.value ?? ''
        const carpetVal = Number(val) ?? 1
        handleSettingsChange({
            pigeonholes: keyHoles,
            commission,
            carpet: carpetVal,
        })
        setCarpet(val)
    }

    const handleSettingsChange = async (payload: any) => {
        try {
            const response = await axios.post(`${apiUrl}/settings`, payload)
            if (response.status === 200) {
                enqueueSnackbar('Settings updated successfully', {
                    variant: 'success',
                })
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Something went wrong')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            // set loader to false
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Settings"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Settings',
                        href: PATH_DASHBOARD.settings.root,
                    },
                ]}
            />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardHeader title="Commission percentage" />
                        <CardContent>
                            <TextField
                                label="Percentage"
                                variant="outlined"
                                type="number"
                                autoComplete="off"
                                value={commission}
                                onChange={handleCommisionChange}
                                fullWidth
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardHeader title="Number of key holes" />
                        <CardContent>
                            <TextField
                                label="Key holes"
                                variant="outlined"
                                type="number"
                                autoComplete="off"
                                value={keyHoles}
                                onChange={handleKeyHolesChange}
                                fullWidth
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardHeader title="Carpet cleaning rate" />
                        <CardContent>
                            <TextField
                                label="Carpet rate"
                                variant="outlined"
                                type="number"
                                autoComplete="off"
                                value={carpet}
                                onChange={handleCarpetChange}
                                fullWidth
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SettingsPage
