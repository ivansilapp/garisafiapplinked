import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useServiceList() {
    const url = `${apiUrl}/service`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        services: data ? data.services : [],
        mutate,
    }
}
