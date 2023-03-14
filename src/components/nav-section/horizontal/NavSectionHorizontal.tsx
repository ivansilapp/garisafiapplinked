/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import { memo } from 'react'
// @mui
import { Stack } from '@mui/material'
// utils
import { hideScrollbarY } from '../../../utils/cssStyles'
//
import NavList from './NavList'

// ----------------------------------------------------------------------

// NavSectionHorizontal.propTypes = {
//     sx: PropTypes.object,
//     data: PropTypes.array,
// }

function NavSectionHorizontal({ data, sx, ...other }: any) {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                mx: 'auto',
                ...hideScrollbarY,
                ...sx,
            }}
            {...other}
        >
            {data.map((group: any) => (
                <Items key={group.subheader} items={group.items} />
            ))}
        </Stack>
    )
}

export default memo(NavSectionHorizontal)

// ----------------------------------------------------------------------

function Items({ items }: any) {
    return (
        <>
            {items.map((list: any) => (
                <NavList
                    key={list.title + list.path}
                    data={list}
                    depth={1}
                    hasChild={!!list.children}
                />
            ))}
        </>
    )
}
