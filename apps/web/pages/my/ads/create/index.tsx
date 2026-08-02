import Layout from '../../../../components/layouts/Layout'
import RemovalForm from '../../../../components/ads/RemovalForm'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'

const title = 'Добавить объявление о наличии вторсырья'
export default function CreateUpdate() {
  return (
    <RedirectUnathenticatedUser>
      <Layout title={`${title} | Recycl`}>
        <RemovalForm h1={title} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
