import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useServiceReport({ query }: { query: string }) {
    const url = `${apiUrl}/report/date-grouped-tasks?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    // console.log('data', data)

    return {
        loading: !error && !data,
        error,
        services: data ? data.services : [],
        mutate,
    }
}
