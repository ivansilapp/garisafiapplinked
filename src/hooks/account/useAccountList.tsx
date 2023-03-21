import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useAccountList() {
    const url = `${apiUrl}/account`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        accounts: data ? data.accounts : [],
        mutate,
    }
}
