const type = 'website'
const url = 'https://chelewani.co'
const title = 'Chelewani'
const description = 'We spread the solutions like [...]. Coding and application architectural solutions.'
const mainImage = 'https://chelewani.co/saul.jpg'

export default (meta) => {
  return [
    {
      hid: 'description',
      name: 'description',
      content: (meta && meta.description) || description
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: (meta && meta.type) || type
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: (meta && meta.url) || url
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: (meta && meta.title) || title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: (meta && meta.description) || description
    },
    {
      hid: 'og:image',
      property: 'og:image',
      itemprop: 'image',
      content: (meta && meta.mainImage) || mainImage
    },
    {
      hid: 'twitter:card',
      property: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: (meta && meta.url) || url
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: (meta && meta.title) || title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: (meta && meta.description) || description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: (meta && meta.mainImage) || mainImage
    }
  ]
};
