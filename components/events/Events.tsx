import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Badge,
  makeStyles,
  TablePagination,
  TableContainer,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'
import Link from '../uiParts/Link.jsx'
import Tabs from '../uiParts/Tabs.tsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },
  noBorder: {
    borderBottom: 'none',
  },
  row: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

export default function Events({ rows }) {
  const classes = useStyles()

  return (
    <div style={{ width: '100%' }}>
      <TableContainer>
        <Table>
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <>
                  <TableRow>
                    <TableCell rowSpan={2}>
                      <Checkbox
                        color="primary"
                        checked={false}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    <TableCell className={classes.noBorder}>
                      {row.date}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.locations}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.time}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.wasteTypes}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Link href="#">Редактировать</Link>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Link href="#">Деативировать</Link>
                    </TableCell>
                  </TableRow>
                </>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
