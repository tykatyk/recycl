import { Box, Typography, Button, Checkbox } from '@mui/material'
import { RefObject } from 'react'

type ActionsBarProps = {
  actionsBarRef: RefObject<HTMLDivElement | null>
  isSticky: boolean
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteMany: () => Promise<void>
  selectedCount: number
  total: number
}

export default function ActionsBar(props: ActionsBarProps) {
  const {
    actionsBarRef,
    isSticky,
    handleSelectAll,
    handleDeleteMany,
    selectedCount,
    total,
  } = props
  const selectAllRowsLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать все' },
    },
  }

  return (
    <Box>
      <Box
        ref={actionsBarRef}
        sx={{
          position: isSticky ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isSticky ? '#1a2b34' : 'background.default',
          boxShadow: isSticky ? '0 2px 4px #3c4b53' : 'none',
          transition: isSticky ? 'background 0.3s' : 'none',
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            margin: 'auto',
            pl: isSticky ? 5 : 2,
            pr: isSticky ? 5 : 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ p: 2, pl: 0 }}>
                <Checkbox
                  checked={selectedCount > 0}
                  color="secondary"
                  {...selectAllRowsLabel}
                  onChange={(e) => {
                    handleSelectAll(e)
                  }}
                />
              </Box>

              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  {`Выбрано ${selectedCount} из ${total}`}
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  disabled={selectedCount === 0}
                  color="secondary"
                  onClick={handleDeleteMany}
                >
                  Удалить выбранные
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
