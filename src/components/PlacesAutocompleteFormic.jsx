import React from 'react'
import PlacesAutocomplete from './PlacesAutocomplete.jsx'
import { fieldToAutocomplete } from 'formik-material-ui-lab'

export default function PlacesAutocompleteFormic(props) {
  return <PlacesAutocomplete {...fieldToAutocomplete(props)} {...props} />
}
