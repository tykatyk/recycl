import React from 'react'
import TextField from '@material-ui/core/TextField'
import { fieldToTextField } from 'formik-material-ui'

export default function TextFieldDependantFormic(props) {
  const masterField = props['data-master']
  const {
    form: { values, setFieldValue, touched, setFieldTouched },
    field: { name },
  } = props
  //
  React.useEffect(() => {
    if (!values[masterField] && touched[masterField]) {
      setFieldValue(name, '', false)
      setFieldTouched(name, false, false)
      console.log(name)
    }
  }, [values[masterField], setFieldValue, name, touched[masterField]])

  return <TextField {...fieldToTextField(props)} />
}
