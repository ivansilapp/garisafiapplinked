import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useClient({ id }: { id: string }) {
    const url = `${apiUrl}/client/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        client: data ? data.client : [],
        mutate,
    }
}
