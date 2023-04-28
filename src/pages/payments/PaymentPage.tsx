import { Button, Container } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import usePaymentList from '../../hooks/payments/usePaymentList'
import { PATH_DASHBOARD } from '../../routes/paths'
import PaymentsTable from './_components/PaymentTable'
import Iconify from '../../components/iconify'
import useAccountList from '../../hooks/account/useAccountList'

function PaymentPage() {
    const { themeStretch } = useSettingsContext()
    const { payments, mutate } = usePaymentList()
    const { accounts } = useAccountList()

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
                    //         component={Link}
                    //         to="/payments/overdue"
                    //         endIcon={
                    //             <Iconify icon="eva:arrow-ios-forward-outline" />
                    //         }
                    //     >
                    //         Overdue payments
                    //     </Button>
                    // }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <PaymentsTable
                        data={payments}
                        mutate={mutate}
                        accounts={accounts}
                    />
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default PaymentPage
