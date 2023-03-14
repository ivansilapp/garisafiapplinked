import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useUsers() {
    const url = `${apiUrl}/users`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        users: data ? data.users : [],
        mutate,
    }
}
