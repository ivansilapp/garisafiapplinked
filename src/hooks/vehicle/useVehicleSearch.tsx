import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useVehicleList({ query }: { query: string }) {
    const url = `${apiUrl}/vehicle/search/${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        vehicles: data ? data.vehicles : [],
        mutate,
    }
}
