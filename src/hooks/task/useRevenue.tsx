import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useRevenue({ queryString }: { queryString: string }) {
    const url = `${apiUrl}/report/revenue-report?${queryString}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    // console.log(data)

    return {
        loading: !error && !data,
        error,
        revenue: data ? data.revenue : null,
        mutate,
    }
}
