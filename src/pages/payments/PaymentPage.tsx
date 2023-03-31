import { Container } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import usePaymentList from '../../hooks/payments/usePaymentList'
import { PATH_DASHBOARD } from '../../routes/paths'
import PaymentsTable from './_components/PaymentTable'

function PaymentPage() {
    const { themeStretch } = useSettingsContext()
    const { payments } = usePaymentList()

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading payments data" />}
            >
                <CustomBreadcrumbs
                    heading="Payments"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'payments',
                            href: PATH_DASHBOARD.payments.root,
                        },
                    ]}
                    // action={
                    //     <Button
                    //         onClick={() => setOpen(true)}
                    //         variant="contained"
                    //         startIcon={<Iconify icon="eva:plus-fill" />}
                    //     >
                    //         New product
                    //     </Button>
                    // }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <PaymentsTable data={payments} />
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default PaymentPage
