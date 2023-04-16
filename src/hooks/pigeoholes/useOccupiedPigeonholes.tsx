import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useOccupiedPigeoholes() {
    const url = `${apiUrl}/tasks/pigeonhole`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        pigeonholes: data ? data.pigeonholes : [],
        mutate,
    }
}
