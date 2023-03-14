import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useClientList() {
    const url = `${apiUrl}/client`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        clients: data ? data.clients : [],
        mutate,
    }
}
