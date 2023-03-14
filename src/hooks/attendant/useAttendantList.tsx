import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useAttendantList() {
    const url = `${apiUrl}/attendant`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        attendants: data ? data.attendants : [],
        mutate,
    }
}
