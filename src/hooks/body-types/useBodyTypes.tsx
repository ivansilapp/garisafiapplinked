import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useBodyTypes() {
    const url = `${apiUrl}/body-type`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        bodyTypes: data ? data.bodyTypes : [],
        mutate,
    }
}
