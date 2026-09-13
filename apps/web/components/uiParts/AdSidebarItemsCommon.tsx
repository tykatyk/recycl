import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CreateIcon from '@mui/icons-material/Create'
import ProposeWasteType from '../ProposeWasteType'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import { useState } from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
} from '@mui/material'
import Link from './Link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

export default function AdSidebarItemsCommon() {
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const { locale } = router
  const t = useTranslations('AdSidebarItemsCommon')

  return (
    <>
      <ListItem disableGutters dense divider>
        <ListItemButton onClick={() => setModalOpen(true)}>
          <ListItemIcon>
            <TroubleshootIcon color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary={t('noWasteType')}
            primaryTypographyProps={{ variant: 'body2' }}
            sx={{ whiteSpace: 'normal' }}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disableGutters dense divider>
        <ListItemButton
          component={Link}
          href="/contact-us"
          locale={locale}
          target="_blank"
          rel="noopener"
        >
          <ListItemIcon>
            <CreateIcon color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary={t('writeToAdmin')}
            primaryTypographyProps={{ variant: 'body2' }}
            sx={{ whiteSpace: 'normal' }}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disableGutters dense divider>
        <ListItemButton
          component={Link}
          href="/support-us"
          locale={locale}
          target="_blank"
          rel="noopener"
        >
          <ListItemIcon>
            <AttachMoneyIcon color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary={t('supportUs')}
            primaryTypographyProps={{ variant: 'body2' }}
            sx={{ whiteSpace: 'normal' }}
          />
        </ListItemButton>
      </ListItem>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: 600,
            maxHeight: 'calc(100vh - 32px)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <ProposeWasteType setOpen={setModalOpen} />
        </Box>
      </Modal>
    </>
  )
}
