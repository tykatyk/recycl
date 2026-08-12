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

function ContactAdmin() {
  return (
    <ListItem disableGutters dense divider>
      <ListItemButton
        key={'Написать администратору'}
        component="a"
        href="/contact-us"
        target="_blank"
        rel="noopener"
      >
        <ListItemIcon>
          <CreateIcon color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary={'Написать администратору'}
          primaryTypographyProps={{ variant: 'body2' }}
          sx={{ whiteSpace: 'normal' }}
        />
      </ListItemButton>
    </ListItem>
  )
}

function AddWasteTypeModal({ open, setOpen, handleClose }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '100vh',
    overflowY: 'auto',
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <ProposeWasteType setOpen={setOpen} />
      </Box>
    </Modal>
  )
}

function NoWasteTypeRequest({ handleOpen }) {
  return (
    <ListItem disableGutters dense divider>
      <ListItemButton
        onClick={handleOpen}
        key={'Нет нужного типа вторсырья в списке'}
      >
        <ListItemIcon>
          <TroubleshootIcon color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary={'Нет нужного типа вторсырья в списке'}
          primaryTypographyProps={{ variant: 'body2' }}
          sx={{ whiteSpace: 'normal' }}
        />
      </ListItemButton>
    </ListItem>
  )
}

function SupportProject() {
  return (
    <ListItem disableGutters dense divider>
      <ListItemButton
        key={'Поддержать проект'}
        component="a"
        href="/support-us"
        target="_blank"
        rel="noopener"
      >
        <ListItemIcon>
          <AttachMoneyIcon color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary={'Поддержать проект'}
          primaryTypographyProps={{ variant: 'body2' }}
          sx={{ whiteSpace: 'normal' }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default function AdSidebarItemsCommon() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <NoWasteTypeRequest handleOpen={() => setModalOpen(true)} />
      <ContactAdmin />
      <SupportProject />
      <AddWasteTypeModal
        open={modalOpen}
        setOpen={setModalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </>
  )
}
