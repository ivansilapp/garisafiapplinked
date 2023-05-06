import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useCommissionsQuery({ query }: { query: string }) {
    const url = `${apiUrl}/commission/report?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        commissions: data ? data.commissions : [],
        mutate,
    }
}
