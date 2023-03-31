import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function usePaymentList() {
    const url = `${apiUrl}/payment`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        payments: data ? data.payments : [],
        mutate,
    }
}
