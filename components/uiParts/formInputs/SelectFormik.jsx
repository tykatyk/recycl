import React from 'react'
import { MenuItem } from '@mui/material'
import TextFieldFormik from './TextFieldFormik'
import { Field } from 'formik'
export default function SelectFormik(props) {
  const { error, loading, data, ...rest } = props

  return (
    <Field
      {...rest}
      component={TextFieldFormik}
      fullWidth
      select
      color="secondary"
      variant="outlined"
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
        data.map((item) => {
          return (
            <MenuItem key={item['_id']} value={item['_id']}>
              {item['name']}
            </MenuItem>
          )
        })}
    </Field>
  )
}
