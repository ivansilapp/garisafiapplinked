/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableContainer,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from '../../../components/table'
import Scrollbar from '../../../components/scrollbar'
import GeneralTableToolbar from '../../../components/shared/GeneralTableToolbar'
import PaymentTableRow from './PaymentTableRow'
import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'

const TABLE_HEAD = [
    { id: 'CreatedAt', label: 'Created at', align: 'left' },
    { id: 'incoming', label: 'Transaction type', align: 'left' },
    { id: 'amount', label: 'Amount', align: 'left' },
    { id: 'account', label: 'Account', align: 'left' },
    { id: 'reference', label: 'Reference', align: 'center' },
    // { id: 'type', label: 'Description', align: 'center' },
    { id: 'user', label: 'user', align: 'left' },
    { id: 'preview', label: 'Edit', align: 'left' },
    { id: '' },
]

function PaymentsTable({ data, accounts, handleUpdate, mutate }: any) {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({})

    const { enqueueSnackbar } = useSnackbar()
    const [deleteLoader, setDeleteLoader] = useState(false)

    const [tableData, setTableData] = useState(data ?? [])

    const [openConfirm, setOpenConfirm] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [payment, setPayment] = useState(null)
    const [updateLoader, setUpdateLoader] = useState(false)
    const [account, setAccount] = useState<any>('')

    const [filterName, setFilterName] = useState('')

    const [filterRole, setFilterRole] = useState('all')

    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        setTableData(data)
    }, [data])

    // const { enqueueSnackbar } = useSnackbar()

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
    })

    const isFiltered =
        filterName !== '' || filterRole !== 'all' || filterStatus !== 'all'

    const dataInPage = dataFiltered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    const denseHeight = dense ? 52 : 72

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterRole) ||
        (!dataFiltered.length && !!filterStatus)

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const handleFilterStatus = (event: any, newValue: any) => {
        setPage(0)
        setFilterStatus(newValue)
    }

    const handleFilterName = (event: any) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    const handleResetFilter = () => {
        setFilterName('')
        setFilterRole('all')
        setFilterStatus('all')
    }

    const handlePaymentUpdate = async () => {
        try {
            setUpdateLoader(true)
            // update logic
            const { accountId, id }: any = payment

            if (account < 1) {
                enqueueSnackbar('Select valid account', {
                    variant: 'error',
                })
                return
            }

            if (account === accountId) {
                enqueueSnackbar('Select diffrent account', {
                    variant: 'error',
                })
            }

            const response = await axios.put(`/account/update-payment`, {
                paymentId: id,
                accountId: account,
            })
            if (response.status === 200) {
                enqueueSnackbar('Payment updated successfully', {
                    variant: 'success',
                })
                setUpdateModal(false)
                mutate()
            } else {
                // const { data } = response
                throw new Error(response.data)
            }
        } catch (err: any) {
            // catch error
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, {
                variant: 'error',
            })
        } finally {
            // setUpdateModal to false
            setUpdateLoader(false)
        }
    }

    const handleAccountChange = (e: any) => {
        try {
            const accountId = Number(e.target.value) || 0

            if (accountId > 0) {
                setAccount(accountId)
            }
            // update logic
        } catch (err: any) {
            // catch error
        } finally {
            // setUpdateModal to false
        }
    }

    return (
        <Card>
            <GeneralTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                onFilterName={handleFilterName}
                onResetFilter={handleResetFilter}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table
                        size={dense ? 'small' : 'medium'}
                        sx={{ minWidth: 800 }}
                    >
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={tableData.length}
                            numSelected={selected.length}
                            onSort={onSort}
                            onSelectAllRows={(checked: any) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row: any) => row.id)
                                )
                            }
                        />

                        <TableBody>
                            {dataFiltered
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row: any) => (
                                    <PaymentTableRow
                                        key={row.id}
                                        row={row}
                                        handlePaymentUpdate={(p: any) => {
                                            setPayment(p)
                                            setUpdateModal(true)
                                        }}
                                    />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(
                                    page,
                                    rowsPerPage,
                                    tableData.length
                                )}
                            />

                            <TableNoData isNotFound={isNotFound} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />

            <Dialog
                fullWidth
                maxWidth="sm"
                open={updateModal}
                onClose={() => {
                    setUpdateModal(false)
                }}
            >
                <DialogTitle>Add Service</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText /> */}

                    <FormControl fullWidth>
                        <InputLabel id="account-selection-label">
                            Account
                        </InputLabel>
                        <Select
                            labelId="account-selection-label"
                            id="account-selection"
                            value={account}
                            label="Account"
                            onChange={handleAccountChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {accounts?.map((ac: any) => {
                                return (
                                    <MenuItem key={ac.id} value={ac.id}>
                                        {ac.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="warning"
                        variant="outlined"
                        onClick={() => {
                            setAccount('')
                            setUpdateModal(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        variant="outlined"
                        loading={updateLoader}
                        onClick={handlePaymentUpdate}
                    >
                        Update
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterRole,
}: any) {
    const stabilizedThis = inputData.map((el: any, index: number) => [
        el,
        index,
    ])

    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })

    inputData = stabilizedThis.map((el: any) => el[0])

    if (filterName) {
        inputData = inputData.filter(
            (payment: any) =>
                payment.reference
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1 ||
                payment?.account?.name
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1
        )
    }

    // if (filterStatus !== 'all') {
    //     inputData = inputData.filter(
    //         (payment: any) => user.status === filterStatus
    //     )
    // }

    // if (filterRole !== 'all') {
    //     inputData = inputData.filter((user: any) => user.role === filterRole)
    // }

    return inputData
}

export default PaymentsTable
