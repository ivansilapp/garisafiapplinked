import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from '@mui/material'
import { fCurrency } from '../../../utils/formatNumber'
import { fDateTime } from '../../../utils/formatTime'

function TaskPaymentCard({ payments, task }: any) {
    const totalPaid = payments.reduce(
        (acc: any, payment: any) => acc + payment.amount,
        0
    )

    const due = (task?.cost ?? 0) - totalPaid

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
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography>
                                            <b> Amount paid: </b>{' '}
                                            {fCurrency(payment.amount)}
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
