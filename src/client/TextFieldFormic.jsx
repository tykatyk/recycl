import React from 'react'
import TextField from '@material-ui/core/TextField'
import { fieldToTextField } from 'formik-material-ui'

export default function TextFieldFormic(props) {
  return <TextField {...fieldToTextField(props)} />
}
