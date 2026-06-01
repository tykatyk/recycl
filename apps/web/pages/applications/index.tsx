import IndexPage from '../../components/applications/Index'
import AppliicationsOnMap from '../../components/applications/ApplicationsOnMap'

export default function Index(props:{city:any, wasteType: string}) {
  const { city, wasteType } = props

  if (city && wasteType) {
    return <IndexPage city={city} wasteType={wasteType} />
  }

  return <AppliicationsOnMap />
}

export async function getServerSideProps(context) {
  const { city, wasteType } = context.query

  return {
    props: {
      city: city || null,
      wasteType: wasteType || null,
    },
  }
}
