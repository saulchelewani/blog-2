<template>
  <section class='max-w-6xl mx-auto px-10 py-6 mb-4 lg:mt-8 lg:rounded-lg lg:grid lg:grid-cols-2 gap-x-8'
           v-if='articles.length'>
    <NuxtLink :to='`/${getSection(article.type)}/${article.slug}`'
              class='block bg-white p-8 mb-8 rounded-lg hover:shadow-lg dark:bg-zinc-800'
              v-for='(article, index) in articles' :key='index'>
      <div class='flex gap-x-4 pb-2 dark:text-gray-200'>
        <ArticleIcon :type='article.type' />
        {{ article.title }}
      </div>
      <p class='pt-3 text-gray-400'>{{ article.description }}</p>
      <span class='text-xs text-gray-400 font-sans'>{{ $moment(article.createdAt).fromNow() }}</span>
    </NuxtLink>
  </section>
</template>

<script>
import ArticleIcon from './ArticleIcon'

export default {
  name: 'ArticleList',
  components: { ArticleIcon },
  props: {
    articles: Array
  },
  methods: {
    getSection(type) {
      let map = []
      map['solution'] = 'solutions'
      map['about'] = 'about'
      map['story'] = 'story'
      return map[type]
    }
  }
}
</script>

<style scoped>

</style>
