<template>
  <BlogArticle :article='article' />
</template>

<script>


import getSiteMeta from '../../utils/getSiteMeta'
import BlogArticle from '../../components/BlogArticle'

export default {
  components: { BlogArticle},
  async asyncData({ $content, params }) {
    const article = await $content('/', params.slug).fetch()

    return {
      article
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        ...this.meta,
        {
          property: 'article:published_time',
          content: this.article.createdAt
        },
        {
          property: 'article:modified_time',
          content: this.article.updatedAt
        },
        {
          property: 'article:tag',
          content: this.article.tags ? this.article.tags.toString() : ''
        },
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: 'Saul Chelewani' },
        { name: 'twitter:label2', content: 'Filed under' },
        {
          name: 'twitter:data2',
          content: this.article.tags ? this.article.tags.toString() : ''
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://chelewani.co/story/${this.$route.params.slug}`
        }
      ]
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.article.title,
        description: this.article.description,
        url: `https://chelewani.co/story/${this.$route.params.slug}`,
        mainImage: `https://chelewani.co/${this.article.author_image}`
      }
      return getSiteMeta(metaData)
    }
  },
  data() {
    return {
      article: null
    }
  }
}
</script>
