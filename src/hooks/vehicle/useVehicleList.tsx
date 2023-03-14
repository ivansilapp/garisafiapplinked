import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useVehicleList() {
    const url = `${apiUrl}/vehicle`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        vehicles: data ? data.vehicles : [],
        mutate,
    }
}
