import { useParams } from 'react-router'
import useUser from '../../../hooks/user/useUser'

function UserDetail() {
    const { id } = useParams()
    const { user } = useUser({ id: Number(id) })
    console.log(user)
    return (
        <div>
            <p> User details</p>
            {user?.name}
        </div>
    )
}

export default UserDetail
