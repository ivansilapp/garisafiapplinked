import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useGroupedCommissions({ query }: { query: string }) {
    const url = `${apiUrl}/commission/grouped-report?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        commissions: data ? data.commissions : [],
        mutate,
    }
}
