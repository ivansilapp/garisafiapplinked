import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useSettings() {
    const url = `${apiUrl}/settings`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        settings: data ? data.settings : null,
        mutate,
    }
}
