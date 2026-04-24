import React from 'react'
import { TextField } from '@mui/material'
import { fieldToTextField } from 'formik-mui'

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

  return <TextField variant="standard" {...fieldToTextField(props)} />
}
