import {
  Autocomplete,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import WasteTypesList from './WasteTypesList'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CreateIcon from '@mui/icons-material/Create'
import ProposeWasteType from '../ProposeWasteType'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'
import { useFormik } from 'formik'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'

const createAddButtonText = 'Добавить объявление'
const changeViewButtonText = 'Смотреть списком'

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

export default function AdSidebarItems(props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [isMapView, setIsMapView] = useState(true)
  const router = useRouter()
  const [wasteTypes, setWasteTypes] = useState([])

  const formik = useFormik({
    initialValues: {
      wasteType: '',
      wasteLocation: '',
    },
    onSubmit: (values) => console.log(values),
  })

  const { selectedValue, handleChange } = props
  const viewItemHref = router.asPath === '/ads/list' ? '/ads' : '/ads/list'
  const viewItemText =
    router.asPath === '/ads/list' ? 'Смотреть на карте' : 'Смотреть списком'

  useEffect(() => {
    if (router.asPath === '/ads/list') {
      setIsMapView(false)
    }
  }, [router.asPath])

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch('/api/waste-types')
        const data = await response.json()

        setWasteTypes(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetcher()
  }, [])

  return (
    <>
      <List>
        <ListItem disableGutters dense divider>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography
                component="h1"
                variant="body1"
                sx={{ fontWeight: 'bold' }}
                align="center"
                color="#91d608"
              >
                Объявления о наличии вторсырья
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ width: '100%' }}
            >
              <Box sx={{ width: '100%', p: 1 }}>
                <Box sx={{ pb: 1 }}>
                  <PlacesAutocompleteNew
                    name="wasteLocation"
                    label="Местоположение"
                    value={formik.values.wasteLocation}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('wasteLocation', newValue)
                    }}
                    onBlur={() => formik.setFieldTouched('wasteLocation', true)}
                    error={
                      formik.touched.wasteLocation &&
                      Boolean(formik.errors.wasteLocation)
                    }
                    helperText={
                      formik.touched.wasteLocation &&
                      formik.errors.wasteLocation
                    }
                    disabled={formik.isSubmitting}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Autocomplete
                    disablePortal
                    options={wasteTypes}
                    sx={{ width: '100%' }}
                    value={formik.values.wasteType}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('wasteType', newValue)
                    }}
                    getOptionLabel={(option) => {
                      if (option) {
                        return option.name
                      }
                      return ''
                    }}
                    // renderOption={}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // size="small"
                        id="wasteType"
                        name="wasteType"
                        label="Тип вторсырья"
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.wasteType &&
                          Boolean(formik.errors.wasteType)
                        }
                        helperText={
                          formik.touched.wasteType && formik.errors.wasteType
                        }
                      />
                    )}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={formik.isSubmitting}
                    size="small"
                  >
                    Поиск
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ListItem>

        <ListItem disableGutters dense divider>
          <ListItemButton
            component="a"
            href="/ads/create"
            key={createAddButtonText}
          >
            <ListItemIcon>
              <AddIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={createAddButtonText}
              sx={{ whiteSpace: 'normal' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters dense divider>
          <ListItemButton
            component="a"
            href={viewItemHref}
            key={changeViewButtonText}
          >
            <ListItemIcon>
              {isMapView ? (
                <ListIcon color="secondary" />
              ) : (
                <LocationPinIcon color="secondary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={isMapView ? 'Смотреть списком' : 'Смотреть на карте'}
            />
          </ListItemButton>
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
    </>
  )
}
