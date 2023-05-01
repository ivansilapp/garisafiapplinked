import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useGroupedSalesReport({ query }: { query: string }) {
    const url = `${apiUrl}/report/grouped-sales?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    // console.log('data', data)

    return {
        loading: !error && !data,
        error,
        sales: data ? data?.sales ?? [] : [],
        mutate,
    }
}
