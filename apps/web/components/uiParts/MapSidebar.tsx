import { useState } from 'react'
import {
  Drawer,
  Toolbar,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
} from '@mui/material'
import MapActionButton from './MapActionButton'
import WasteTypesList from './WasteTypesList'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CreateIcon from '@mui/icons-material/Create'
import ProposeWasteType from '../ProposeWasteType'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import AddIcon from '@mui/icons-material/Add'

const createAddButtonText = 'Добавить объявление о наличии вторсырья'
const drawerWidth = 240

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
          <CreateIcon />
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
          <TroubleshootIcon />
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
          <AttachMoneyIcon />
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

export default function MapSidebar(props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)

  const handleWasteTypeToggle = () => {
    setWasteTypeOpen(!wasteTypeOpen)
  }

  const { selectedValue, handleChange } = props

  return (
    <Box sx={{ width: drawerOpen ? drawerWidth : 0 }}>
      <MapActionButton onClick={handleDrawerToggle} open={drawerOpen} />
      <Drawer
        open={drawerOpen}
        variant="permanent"
        sx={(theme) => ({
          maxWidth: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',

          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 0,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: drawerOpen
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          },
        })}
      >
        <Toolbar />
        <List>
          <ListItem disableGutters dense divider>
            <ListItemButton
              component="a"
              href="/applications/create"
              key={createAddButtonText}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary={createAddButtonText}
                primaryTypographyProps={{
                  sx: { fontWeight: 'bold' },
                }}
                sx={{ whiteSpace: 'normal' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters dense>
            <WasteTypesList
              open={wasteTypeOpen}
              onClick={handleWasteTypeToggle}
              handleChange={handleChange}
              selectedValue={selectedValue}
            />
          </ListItem>
          <NoWasteTypeRequest handleOpen={() => setModalOpen(true)} />
          <ContactAdmin />
          <SupportProject />
          <AddWasteTypeModal
            open={modalOpen}
            setOpen={setModalOpen}
            handleClose={() => setModalOpen(false)}
          />
        </List>
      </Drawer>
    </Box>
  )
}
