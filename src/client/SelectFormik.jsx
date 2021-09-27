import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextFieldFormik from './TextFieldFormik.jsx'
import Button from '@material-ui/core/Button'
import { Field } from 'formik'

export default function SelectFormik(props) {
  const { error, loading, data, name, label, helperText, disabled } = props

  return (
    <Field
      component={TextFieldFormik}
      fullWidth
      select
      type="text"
      name={name}
      color="secondary"
      variant="outlined"
      label={label}
      helperText={helperText}
      disabled={disabled}
      SelectProps={{
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        },
      }}
    >
      {error && (
        <MenuItem value="">
          <em>Произошла ошибка при загрузке списка элементов</em>
        </MenuItem>
      )}
      {loading && (
        <MenuItem value="">
          <em>Загрузка списка элементов...</em>
        </MenuItem>
      )}
      {data && (
        <MenuItem value="">
          <em>Не выбрано</em>
        </MenuItem>
      )}
      {data &&
        data.getWasteTypes.map((item) => {
          return (
            <MenuItem key={item['_id']} value={item['_id']}>
              {item.name}
            </MenuItem>
          )
        })}
    </Field>
  )
}
