import React from 'react'
import { TextField } from '@material-ui/core'
import { fieldToTextField } from 'formik-material-ui'

export default function TextFieldFormik(props) {
  return <TextField {...fieldToTextField(props)} />
}
