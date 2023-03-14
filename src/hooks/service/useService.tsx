import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useService({ id }: { id: string }) {
    const url = `${apiUrl}/service/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        service: data ? data.service : [],
        mutate,
    }
}
