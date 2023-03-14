import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useVehicle({ id }: { id: string }) {
    const url = `${apiUrl}/vehicle/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        vehicle: data ? data.vehicle : [],
        mutate,
    }
}
