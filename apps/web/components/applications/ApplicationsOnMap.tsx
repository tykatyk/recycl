import React, { useEffect, useState } from 'react'
import MapLayout from '../layouts/MapLayout'
import Map from '../uiParts/Map'
import Marker from '../uiParts/Marker'
import Snackbars from '../uiParts/Snackbars'
import WasteTypesList from '../uiParts/WasteTypesList'
import MapSidebar from '../uiParts/MapSidebar'
import UserLocation from '../uiParts/UserLocation'
import MapInfoWindow from '../uiParts/MapInfoWindow'
import getUserLocation from '../../lib/helpers/getUserLocation'
import { GET_REMOVAL_APPLICATIONS_FOR_MAP } from '../../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ProposeWasteType from '../ProposeWasteType'
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import type { Position } from '../../lib/types/placeAutocomplete'

const createAddButtonText = 'Добавить объявление о наличии вторсырья'

const ContactAdmin = () => {
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

const AddWasteTypeModal = ({ open, setOpen, handleClose }) => {
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

const NoWasteTypeRequest = ({ handleOpen }) => {
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

const SupportProject = () => {
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

const mainCss = {
  display: 'flex',
  flex: '1 1 auto',
}

type Lng = number
type Lat = number

type PositionArray = number[][]

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState<Position | null>(null)
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(false)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [selectedValue, setSelectedValue] = useState('')
  const [visibleRect, setVisibleRect] = useState<number[][][]>([])
  const [getApplications, { loading, error, data }] = useLazyQuery(
    GET_REMOVAL_APPLICATIONS_FOR_MAP,
  )
  const [markers, setMarkers] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (!getApplications || visibleRect.length == 0) return

    getApplications({
      variables: {
        visibleRect: visibleRect,
        wasteTypes: selectedValue,
      },
    })
  }, [visibleRect, selectedValue, getApplications])

  useEffect(() => {
    if (
      data &&
      data.getRemovalApplicationsForMap &&
      data.getRemovalApplicationsForMap.length > 0
    ) {
      const markersToShow = data.getRemovalApplicationsForMap.map(
        (element, index: number) => {
          const coords = {
            lat: element.wasteLocation[1],
            lng: element.wasteLocation[0],
          }

          return (
            <Marker key={index} position={coords}>
              <MapInfoWindow
                cityId={element._id}
                wasteTypeId={element.wasteTypeId}
                totalProposals={element.totalProposals}
                totalWeight={element.totalWeight}
              />
            </Marker>
          )
        },
      )
      setMarkers(markersToShow)
    } else {
      setMarkers([])
    }
  }, [data])

  const handleChange = (value) => () => {
    setSelectedValue(value)
  }

  const handleWasteTypeToggle = () => {
    setWasteTypeOpen(!wasteTypeOpen)
  }

  const onIdle = (m: google.maps.Map) => {
    const zoom = m.getZoom()
    const centerObj = m.getCenter()
    const bounds = m.getBounds()

    if (!zoom || !centerObj || !bounds) throw new Error('Cannot get map params')

    const center = centerObj.toJSON()

    setZoom(zoom)
    setCenter(center)

    const boundsNeLatLng = bounds.getNorthEast()
    const boundsSwLatLng = bounds.getSouthWest()
    const boundsNwLatLng = new google.maps.LatLng(
      boundsNeLatLng.lat(),
      boundsSwLatLng.lng(),
    )
    const boundsSeLatLng = new google.maps.LatLng(
      boundsSwLatLng.lat(),
      boundsNeLatLng.lng(),
    )

    const visibleRect = [
      [
        [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
        [boundsSeLatLng.lng(), boundsSeLatLng.lat()],
        [boundsSwLatLng.lng(), boundsSwLatLng.lat()],
        [boundsNwLatLng.lng(), boundsNwLatLng.lat()],
        [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
      ],
    ]
    setVisibleRect(visibleRect)
  }

  useEffect(() => {
    getUserLocation().then((coordinates) => {
      if (!coordinates) {
        setLocationError(true)
        return
      }
      setCenter(coordinates)
    })
  }, [])

  const render = (status: Status) => {
    if (status === Status.LOADING) return <PageLoadingCircle />

    if (status === Status.FAILURE) {
      return (
        <Snackbars
          severity="error"
          open={true}
          message="Не могу загрузить карту"
        />
      )
    }
    return <React.Fragment />
  }

  let content

  if (locationError) {
    content = (
      <Box component="main" sx={mainCss}>
        <UserLocation
          setCenter={setCenter}
          setLocationError={setLocationError}
        />
      </Box>
    )
  } else {
    content = (
      <>
        <MapSidebar>
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
          <NoWasteTypeRequest handleOpen={handleOpen} />
          <ContactAdmin />
          <SupportProject />
        </MapSidebar>
        {!!error && (
          <Snackbars
            message="Ошибка при загрузке данных"
            severity="error"
            open={true}
          />
        )}
        <Box component="main" sx={mainCss}>
          <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || ''}
            render={render}
            libraries={['places', 'geocoding']}
            language="uk"
          >
            <Map center={center} zoom={zoom} onIdle={onIdle}>
              {markers}
            </Map>
          </Wrapper>
        </Box>
        <AddWasteTypeModal
          open={open}
          setOpen={setOpen}
          handleClose={handleClose}
        />
      </>
    )
  }

  return (
    <MapLayout
      title={`Объявления о наличии вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
    >
      {content}
    </MapLayout>
  )
}
