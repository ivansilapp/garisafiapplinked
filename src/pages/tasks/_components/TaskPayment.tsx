import {
    Alert,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from '@mui/material'
import { fCurrency } from '../../../utils/formatNumber'
import { fDateTime } from '../../../utils/formatTime'
import Label from '../../../components/label/Label'

function TaskPaymentCard({ payments, task }: any) {
    // console.log('payments', payments)
    const totalPaid = payments.reduce(
        (acc: any, payment: any) =>
            payment?.type === 'task_cancellation' ? acc : acc + payment.amount,
        0
    )
    const salesCost = task?.sales[0] ? task.sales[0].amount : 0
    const due = salesCost + (task?.cost ?? 0) - totalPaid

    const hasTip = task?.tip?.amount || false

    return (
        <Card>
            <CardContent>
                <h2>Task Payment</h2>
                <Box>
                    <Box
                        sx={{ mb: 2 }}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography variant="subtitle1" color="primary">
                                Total paid: {fCurrency(totalPaid)}{' '}
                            </Typography>
                            {due > 0 ? (
                                <Typography color="error">
                                    {' '}
                                    Amount Due {fCurrency(due)}
                                </Typography>
                            ) : null}
                        </Box>

                        <Box>
                            {hasTip && (
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Tip: {fCurrency(task.tip.amount)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box display="grid" gap={3}>
                        {payments.map((payment: any) => (
                            <Card key={payment.id} sx={{ p: 2 }}>
                                {payment.isRedeem ? (
                                    <Alert severity="info">
                                        Redeemed payment
                                    </Alert>
                                ) : null}

                                {payment?.type === 'task_cancellation' ? (
                                    <Alert severity="error">
                                        Payment cancellation
                                    </Alert>
                                ) : null}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography>
                                            <b> Amount paid: </b>{' '}
                                            {payment.isRedeem ? (
                                                <Label color="info">
                                                    {fCurrency(payment.amount)}
                                                </Label>
                                            ) : (
                                                <span>
                                                    {fCurrency(payment.amount)}
                                                </span>
                                            )}
                                        </Typography>
                                        <Typography>
                                            Payment method:{' '}
                                            {payment?.account?.name}
                                            {payment.reference ? (
                                                <small color="primary">
                                                    {' '}
                                                    (Ref: {payment?.reference})
                                                </small>
                                            ) : null}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography>
                                            <b>Recorded by: </b>{' '}
                                            {payment.user.name}
                                        </Typography>
                                        <Typography>
                                            Paid at:{' '}
                                            {fDateTime(payment.paidAt, null)}{' '}
                                        </Typography>
                                    </Grid>
                                    {/* <Grid xs={12}>
                                        {index < payments.length - 1 && (
                                            <Divider />
                                        )}
                                    </Grid> */}
                                </Grid>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TaskPaymentCard
