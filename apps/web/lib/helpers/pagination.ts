import Cookies from 'js-cookie'
import { rowsPerPageOptions } from './eventHelpers'

type RowsPerPageOption = (typeof rowsPerPageOptions)[number]

export const getValidPageNumber = (page: string | string[] | undefined) => {
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : NaN

  return !Number.isNaN(parsedPage) ? parsedPage : 1
}

const isValidPageSize = (value: number) =>
  rowsPerPageOptions.includes(value as RowsPerPageOption)

export const defaultPageSize = parseInt(
  Cookies.get('pageSize') || String(rowsPerPageOptions[0]),
  10,
)

export const getValidPageSize = (pageSize: string | string[] | undefined) => {
  const parsedPageSize =
    typeof pageSize === 'string' ? parseInt(pageSize, 10) : NaN

  const validatedPageSize =
    !Number.isNaN(parsedPageSize) && isValidPageSize(parsedPageSize)
      ? parsedPageSize
      : defaultPageSize
  // console.log(parsedPageSize)
  return validatedPageSize
}
