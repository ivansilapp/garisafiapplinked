import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useAttendant({ id }: { id: string }) {
    const url = `${apiUrl}/attendant/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        attendant: data ? data.attendant : [],
        mutate,
    }
}
