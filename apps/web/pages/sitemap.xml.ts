import {
  dbConnect,
  AdModel,
  CollectionPointModel,
} from '@recycl/shared/dist/server/db'
import mongoose from 'mongoose'

const locales = ['ru', 'uk']
const defaultLocale = 'uk'

function generateXHTML({ route, _id }) {
  return `
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${process.env.HOST}${route}/${_id}"
    />
    ${locales
      .map(
        (locale) =>
          `
        <xhtml:link
          rel="alternate"
          hreflang="${locale}"
          href="${locale === defaultLocale ? `${process.env.HOST}${route}/${_id}` : `${process.env.HOST}/${locale}${route}/${_id}`}"
        />
      `,
      )
      .join('')}
  `
}

function generateSiteMapUrls<T extends { _id: mongoose.Types.ObjectId }>({
  route,
  data,
}: {
  route: string
  data: T[]
}) {
  return data
    .map(
      ({ _id }) =>
        `
         ${locales
           .map(
             (locale) =>
               `<url>
                  ${locale === defaultLocale ? `<loc>${process.env.HOST}${route}/${_id}</loc>` : `<loc>${process.env.HOST}/${locale}${route}/${_id}</loc>`}
                  ${generateXHTML({ route, _id })}
                </url>
              `,
           )
           .join('')}
      `,
    )
    .join('')
}

function generateSiteMap(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urls.join('')}
    </urlset>`
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  await dbConnect()

  const ads = await AdModel.find({
    status: 'active',
  }).lean()
  const adUrls = generateSiteMapUrls({ route: '/ads', data: ads })

  const collectionPoints = await CollectionPointModel.find({
    status: 'active',
  }).lean()
  const collectionPointUrls = generateSiteMapUrls({
    route: '/collection-points',
    data: collectionPoints,
  })

  const sitemap = generateSiteMap([adUrls, collectionPointUrls])

  res.setHeader('Content-Type', 'text/xml')
  // send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
