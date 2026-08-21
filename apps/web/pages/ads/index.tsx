import AdsOnMap from '../../components/ads/AdsOnMap'

export default function Index() {
  return <AdsOnMap />
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}
