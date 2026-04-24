import React from 'react'
import { TextField } from '@mui/material'
import { fieldToTextField } from 'formik-mui'

export default function TextFieldFormik(props) {
  return <TextField {...fieldToTextField(props)} />
}
