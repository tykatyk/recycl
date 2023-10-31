import Error from './Error'

export default function DataGridErrorOverlay() {
  return (
    <StyledGridOverlay
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Error />
    </StyledGridOverlay>
  )
}
