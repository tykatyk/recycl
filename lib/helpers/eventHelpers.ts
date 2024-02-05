import { ReactNode } from 'react'
import dayjs from 'dayjs'
import type { Event, EventActions } from '../types/event'

export function getInitialValues(event?: Event, userPhone: string = ''): Event {
  return {
    user: event?.user || '',
    location: event?.location || null,
    waste: event?.waste || '',
    date: event ? dayjs(event.date) : null,
    phone: event?.phone || userPhone,
    comment: event?.comment || '',
  }
}

//ToDo привести цю функцію у відповідність з аналогічною функцією в removalFormConfig
export function getNormalizedValues(values: Event): Event {
  if (!values.location) return values

  const normalizedLocation = {
    description: values.location.description,
    place_id: values.location?.place_id,
    structured_formatting: {
      main_text: values.location?.structured_formatting.main_text,
      secondary_text: values.location?.structured_formatting.secondary_text,
    },
  }
  const normalizedValues = { ...values, location: normalizedLocation }

  return normalizedValues
}

type ColumnHeader = {
  id: string
  headerName: ReactNode | string
  headerAlign?: 'left' | ' right' | 'center'
  width: number
}

export function getColumns(
  getHeader: () => ReactNode | 'Дата',
): ColumnHeader[] {
  return [
    {
      id: 'date',
      headerName: getHeader(),
      width: 150,
    },
    {
      id: 'time',
      headerName: 'Время',
      width: 150,
      headerAlign: 'center',
    },
    {
      id: 'location',
      headerName: 'Место',
      width: 170,
    },
    {
      id: 'waste',
      headerName: 'Тип отходов',
      width: 200,
      headerAlign: 'center',
    },
  ]
}

export const eventActions: EventActions = {
  activate: 'activate',
  deactivate: 'deactivate',
  remove: 'remove',
}

export const eventVariants = {
  active: 'active',
  inactive: 'inactive',
}

export const getEventTableStyles = (theme) => ({
  width: '100%',

  '& .noBorder>td, & .noBorder>th': {
    borderBottom: 'none',
    borderTop: 'none',
  },
  '& .dataRow td': {
    ...theme.typography.body1,
  },

  '& .actions': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&>*:not(:last-child)': {
      marginRight: '32px',
    },
  },

  '& th': {
    textTransform: 'uppercase',
  },

  '& tbody td:not(.spacer)': {
    background: '#1d303a',
  },

  '& .button': {
    fontWeight: theme.typography.fontWeightLight,
    textTransform: 'none',
  },
})

export type ConfigOptions = {
  rowRefs: Record<string, HTMLTableRowElement | null>
  overlayRefs: Record<string, HTMLDivElement | null>
  rowsToDisableButtons: Record<string, keyof EventActions>
}

export type Options = {
  rowRefs: React.MutableRefObject<ConfigOptions['rowRefs']>
  overlayRefs: React.MutableRefObject<ConfigOptions['overlayRefs']>
  rowsToDisableButtons: ConfigOptions['rowsToDisableButtons']
}

export const adjustOverlay = (options: Options) => {
  const { rowRefs, overlayRefs, rowsToDisableButtons } = options

  for (const _id in overlayRefs.current) {
    let source = rowRefs.current[_id]
    let target = overlayRefs.current[_id]

    //prevent memory leak of increasing rowRefs and overlayRefs size when the user changes variant, deletes or paginates through events
    //we basically remove refs for rows which are not visible
    if (!source) delete rowRefs.current[_id]
    if (!target) delete overlayRefs.current[_id]

    if (!target || !source) continue

    if (rowsToDisableButtons[_id]) {
      setOverlayStylesVisible(target, source)
    } else {
      setOverlayStylesHidden(target)
    }
  }
}

export const setOverlayStylesVisible = (
  target: HTMLDivElement,
  source: HTMLTableRowElement,
) => {
  let height = 0
  const _id = source.getAttribute('data-id')
  const elements = document.querySelectorAll<HTMLTableRowElement>(
    `[data-id="${_id}"]`,
  )

  elements.forEach((element) => {
    height += element.offsetHeight
  })

  target.style.left = `${source.offsetLeft}px`
  target.style.top = `${source.offsetTop}px`
  target.style.height = `${height}px`
  target.style.visibility = 'visible'
  target.style.opacity = '1'
}

export const setOverlayStylesHidden = (target: HTMLDivElement) => {
  target.style.opacity = '0'
  target.style.height = '0'
  target.style.visibility = 'hidden'
}

let timeout: ReturnType<typeof setTimeout>
export const overlayResizeHandler = (options: Options) => {
  //debounce recalculating overlay styles when window is resizing to prevent perfomance issues
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    adjustOverlay(options)
  }, 200)
}

export const makeNewRowsToDisableButtons = (
  setRowsToDisableButtons: React.Dispatch<
    React.SetStateAction<Record<string, keyof EventActions>>
  >,
  rowToRestore: string,
) => {
  if (!rowToRestore) return

  setRowsToDisableButtons((prevRows) => {
    const newRows = { ...prevRows }

    delete newRows[rowToRestore]
    return newRows
  })
}
