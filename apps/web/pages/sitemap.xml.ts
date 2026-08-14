import {
  dbConnect,
  AdModel,
  CollectionPointModel,
} from '@recycl/shared/dist/server/db'
import mongoose from 'mongoose'

function generateSiteMapUrls({ route, data }) {
  return `
     ${data
       .map(({ _id }) => {
         return `
       <url>
           <loc>${`${process.env.HOST}${route}/${_id}`}</loc>
       </url>
     `
       })
       .join('')}
 `
}

function generateSiteMap(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
   </urlset>
 `
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

  const allUrls: string[] = []
  allUrls.push(adUrls)
  allUrls.push(collectionPointUrls)

  const sitemap = generateSiteMap(allUrls)

  res.setHeader('Content-Type', 'text/xml')
  // send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
