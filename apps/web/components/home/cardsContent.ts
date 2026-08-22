const cardsContent = [
  {
    id: 'forRecyclers',
    description: [
      {
        id: 'findAds',
        href: '/ads',
      },
      {
        id: 'addCollectionPoints',
        href: '/my/collection-points/create',
      },
      {
        id: 'subscribe',
        href: '/my/subscriptions',
      },
    ],
  },
  {
    id: 'forSellers',
    description: [
      {
        id: 'findCollectionPoints',
        href: '/collection-points',
      },
      {
        id: 'createAd',
        href: '/my/ads/create',
      },
      {
        id: 'subscribe',
        href: '/my/subscriptions',
      },
    ],
  },
] as const

export default cardsContent
