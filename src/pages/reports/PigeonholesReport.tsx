/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Button,
    Container,
    Grid,
    Stack,
    Typography,
    Backdrop,
    CircularProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { Suspense, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingButton } from '@mui/lab'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
// import axios from '../../utils/axios'
import { apiUrl } from '../../config-global'
import GroupedTasksTable from '../tasks/_components/GroupedTasksTable'
import useOccupiedPigeoholes from '../../hooks/pigeoholes/useOccupiedPigeonholes'
import InternalError from '../../components/shared/500Error'
import PigeonholesTable from './_components/PigeonholesTable'
import Iconify from '../../components/iconify'
import http from '../../utils/axios'

function PigeonholesReport() {
    const [releaseLoader, setReleaseLoader] = useState(false)
    const { themeStretch } = useSettingsContext()

    const { pigeonholes, mutate } = useOccupiedPigeoholes()

    const { enqueueSnackbar } = useSnackbar()

    const releaseAll = async () => {
        try {
            setReleaseLoader(true)
            const url = `${apiUrl}/task/release-all-keys`
            const response = await http.put(url, {})
            if (response.status === 200) {
                enqueueSnackbar('Keys released', { variant: 'success' })
                mutate()
            }
        } catch (err: any) {
            const msg = err?.error || err?.message || 'Failed to release keys'

            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setReleaseLoader(false)
        }
    }

    const loaderComponent = (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open
            onClick={() => {}}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Key holes report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'key holes',
                        href: PATH_DASHBOARD.reports.pigeonholes,
                    },
                ]}
                action={
                    <Stack gap={2} direction="row">
                        <LoadingButton
                            variant="outlined"
                            loading={releaseLoader}
                            onClick={releaseAll}
                            color="info"
                        >
                            Release all
                        </LoadingButton>
                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.reports.pigeonholesHistory}
                            endIcon={
                                <Iconify icon="eva:arrow-forward-outline" />
                            }
                        >
                            History
                        </Button>
                    </Stack>
                }
            />

            <Grid container>
                <ErrorBoundary
                    fallback={<InternalError error="Error loading data" />}
                >
                    <Suspense fallback={loaderComponent}>
                        <Grid item xs={12}>
                            <PigeonholesTable data={pigeonholes ?? []} />
                        </Grid>
                    </Suspense>
                </ErrorBoundary>
            </Grid>
        </Container>
    )
}

export default PigeonholesReport
