/* eslint-disable react/require-default-props */
import { m } from 'framer-motion'
// @mui
import { Container, Typography } from '@mui/material'
// components
import { ReactNode } from 'react'
import { MotionContainer, varBounce } from '../components/animate'
// assets
import { ForbiddenIllustration } from '../assets/illustrations'
//
import { useAuthContext } from './useAuthContext'

// ----------------------------------------------------------------------

// RoleBasedGuard.propTypes = {
//     children: PropTypes.node,
//     hasContent: PropTypes.bool,
//     roles: PropTypes.arrayOf(PropTypes.string),
// }

export default function RoleBasedGuard({
    hasContent,
    roles,
    module,
    children,
}: {
    hasContent: boolean
    roles: string[]
    children: ReactNode
    module: string
}) {
    // Logic here to get current user role
    const { user, rights, modules }: any = useAuthContext()
    //  const userAccess: string[] = rights?.map((r: any) => r.module.name) ?? []
    console.log(module, roles)
    // const currentRole = 'user';
    const currentRole = user?.role // admin;
    // console.log(user)

    // console.log(roles, currentRole)
    // Role base guard
    // if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    //     return hasContent ? (
    //         <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
    //             <m.div variants={varBounce({}).in}>
    //                 <Typography variant="h3" paragraph>
    //                     Permission Denied
    //                 </Typography>
    //             </m.div>

    //             <m.div variants={varBounce({}).in}>
    //                 <Typography sx={{ color: 'text.secondary' }}>
    //                     You do not have permission to access this page
    //                 </Typography>
    //             </m.div>

    //             <m.div variants={varBounce({}).in}>
    //                 <ForbiddenIllustration
    //                     sx={{ height: 260, my: { xs: 5, sm: 10 } }}
    //                 />
    //             </m.div>
    //         </Container>
    //     ) : null
    // }

    // Rights base guard
    // if (typeof module !== 'undefined' && !rights.includes(module)) {
    //     return hasContent ? (
    //         <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
    //             <m.div variants={varBounce({}).in}>
    //                 <Typography variant="h3" paragraph>
    //                     Permission Denied
    //                 </Typography>
    //             </m.div>

    //             <m.div variants={varBounce({}).in}>
    //                 <Typography sx={{ color: 'text.secondary' }}>
    //                     You do not have permission to access this page
    //                 </Typography>
    //             </m.div>

    //             <m.div variants={varBounce({}).in}>
    //                 <ForbiddenIllustration
    //                     sx={{ height: 260, my: { xs: 5, sm: 10 } }}
    //                 />
    //             </m.div>
    //         </Container>
    //     ) : null
    // }

    return <> {children} </>
}
