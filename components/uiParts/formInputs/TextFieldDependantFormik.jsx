import React from 'react'
import { TextField } from '@material-ui/core'
import { fieldToTextField } from 'formik-material-ui'

export default function TextFieldDependantFormik(props) {
  const masterField = props['data-master']
  const {
    form: { values, setFieldValue, touched, setFieldTouched },
    field: { name },
  } = props

  React.useEffect(() => {
    if (!values[masterField] && touched[masterField]) {
      setFieldValue(name, '', false)
      setFieldTouched(name, false, false)
    }
  }, [masterField, setFieldValue, name, touched, setFieldTouched, values])

  return <TextField {...fieldToTextField(props)} />
}
