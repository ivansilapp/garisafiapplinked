import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useVehicleTypeTasks({
    date,
    type,
}: {
    date: string
    type: string
}) {
    if (!type) {
        throw new Error('Please provide vehicle type')
    }
    const url = `${apiUrl}/report/vehicle-type-tasks-ungrouped/${type}?${date}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
