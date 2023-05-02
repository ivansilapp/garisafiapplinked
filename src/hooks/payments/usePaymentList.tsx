import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function usePaymentList({ query }: { query: string }) {
    const url = `${apiUrl}/payment?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        payments: data ? data.payments : [],
        mutate,
    }
}
