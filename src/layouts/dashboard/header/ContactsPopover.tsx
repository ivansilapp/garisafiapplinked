import { useState } from 'react'
// @mui
import { alpha } from '@mui/material/styles'
import {
    Typography,
    ListItemText,
    ListItemAvatar,
    MenuItem,
} from '@mui/material'
// utils
import { fToNow } from '../../../utils/formatTime'

// components
import { CustomAvatar } from '../../../components/custom-avatar'
import Iconify from '../../../components/iconify'
import Scrollbar from '../../../components/scrollbar'
import MenuPopover from '../../../components/menu-popover'
// import BadgeStatus from '../../../components/badge-status'
import { IconButtonAnimate } from '../../../components/animate'

// ----------------------------------------------------------------------
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const _contacts: any = []

const ITEM_HEIGHT = 64

export default function ContactsPopover() {
    const [openPopover, setOpenPopover] = useState(null)

    const handleOpenPopover = (event: any) => {
        setOpenPopover(event.currentTarget)
    }

    const handleClosePopover = () => {
        setOpenPopover(null)
    }

    return (
        <>
            <IconButtonAnimate
                color={openPopover ? 'primary' : 'default'}
                onClick={handleOpenPopover}
                sx={{
                    width: 40,
                    height: 40,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    ...(openPopover && {
                        bgcolor: (theme: any) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.focusOpacity
                            ),
                    }),
                }}
            >
                <Iconify icon="eva:people-fill" />
            </IconButtonAnimate>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                sx={{ width: 320 }}
            >
                <Typography variant="h6" sx={{ p: 1.5 }}>
                    Contacts{' '}
                    <Typography component="span">
                        ({_contacts.length})
                    </Typography>
                </Typography>

                <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }}>
                    {_contacts.map((contact: any) => (
                        <MenuItem key={contact.id} sx={{ height: ITEM_HEIGHT }}>
                            <ListItemAvatar>
                                <CustomAvatar
                                    src={contact.avatar}
                                    BadgeProps={{
                                        badgeContent: (
                                            // <BadgeStatus
                                            //     status={contact.status}
                                            // />
                                            <div>a</div>
                                        ),
                                    }}
                                />
                            </ListItemAvatar>

                            <ListItemText
                                primary={contact.name}
                                secondary={
                                    contact.status === 'offline'
                                        ? fToNow(contact.lastActivity)
                                        : ''
                                }
                                primaryTypographyProps={{
                                    typography: 'subtitle2',
                                    sx: { mb: 0.25 },
                                }}
                                secondaryTypographyProps={{
                                    typography: 'caption',
                                }}
                            />
                        </MenuItem>
                    ))}
                </Scrollbar>
            </MenuPopover>
        </>
    )
}
