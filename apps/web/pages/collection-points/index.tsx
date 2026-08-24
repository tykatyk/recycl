import CollectionPointsOnMap from '../../components/collectionPoints/CollectionPointsOnMap'

export default function Index() {
  return <CollectionPointsOnMap />
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}
