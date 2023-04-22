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
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import axios from '../../utils/axios'
import { apiUrl } from '../../config-global'
import GroupedTasksTable from '../tasks/_components/GroupedTasksTable'
import useOccupiedPigeoholes from '../../hooks/pigeoholes/useOccupiedPigeonholes'
import InternalError from '../../components/shared/500Error'
import PigeonholesTable from './_components/PigeonholesTable'
import Iconify from '../../components/iconify'
import usePigeoholes from '../../hooks/pigeoholes/usePigeonholes'

function PigeonholesReport() {
    const { themeStretch } = useSettingsContext()

    const { pigeonholes } = usePigeoholes()

    const { enqueueSnackbar } = useSnackbar()

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
                heading="Services report"
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
                    {
                        name: 'history',
                        href: PATH_DASHBOARD.reports.pigeonholesHistory,
                    },
                ]}
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
// postgres=# alter user postgres with password '123456';
//  ALTER USER postgres WITH PASSWORD '123456';

export default PigeonholesReport
