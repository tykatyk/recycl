import React from 'react'
import { Grid, Typography, Modal, CircularProgress } from '@material-ui/core'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplicationForm/RemovalForm.jsx'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_REMOVAL_APPLICATION,
  UPDATE_REMOVAL_APPLICATION,
} from '../server/graphqlQueries'
import { useRouter } from 'next/router'
import {
  getInitialValues,
  getNormalizedValues,
} from './removalApplicationForm/removalFormConfig'

export default function UpdateRemovalApplication(props) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const router = useRouter()
  const { id } = router.query
  const [getRemovalApplication, { called, data, loading, error }] =
    useLazyQuery(GET_REMOVAL_APPLICATION)

  if (id && !called) getRemovalApplication({ variables: { id } })

  const initialValues = data ? data.getRemovalApplication : getInitialValues()

  const [
    executeMutation,
    { data: updateData, loading: loadingUpdateData, error: updateError },
  ] = useMutation(UPDATE_REMOVAL_APPLICATION)

  const submitHandler = (values) => {
    const normalizedValues = getNormalizedValues(values)
    executeMutation({ variables: { id: id, newValues: normalizedValues } })
  }

  if (error)
    return <Typography>Возникла ошибка при получении данных</Typography>

  if (updateError)
    return <Typography>Возникла ошибка при сохранении данных</Typography>
  if (loadingUpdateData) return <Typography>Идет сохранение данных</Typography>

  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        {!data && !error && (
          <Modal
            open={!data}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress color="secondary" />
            </div>
          </Modal>
        )}
        {data && (
          <RemovalForm
            initialValues={initialValues}
            submitHandler={submitHandler}
          />
        )}
      </Grid>
    </Layout>
  )
}
