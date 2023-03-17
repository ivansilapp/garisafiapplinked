import { Button, Container } from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import { PATH_DASHBOARD } from '../../routes/paths'
import AnalyticsBar from './_components/AnalyticsBar'

function Tasks() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading tasks" />}
            >
                <CustomBreadcrumbs
                    heading="Tasks"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'tasks',
                            href: PATH_DASHBOARD.tasks.root,
                        },
                    ]}
                    action={
                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.tasks.new}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Task
                        </Button>
                    }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <AnalyticsBar />
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default Tasks
