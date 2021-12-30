<template>
  <div>
    <Banner>
      <h1 class="text-rose-500 text-3xl md:text-6xl font-mono"><span class="text-cyan-400">about()</span>:self</h1>
    </Banner>
    <ArticleList :articles='articles' />
  </div>
</template>

<script>
import Banner from '../../components/Banner'
import ArticleList from '../../components/ArticleList'
export default {
  name: "index",
  components: { ArticleList, Banner },
  async asyncData({$content}) {
    const articles = await $content()
      .only(['slug', 'description', 'title', 'createdAt', 'type'])
      .where({type: 'about'})
      .fetch()
    return {articles}
  },
  data() {
    return {
      articles: []
    }
  }
}
</script>

<style scoped>

</style>
