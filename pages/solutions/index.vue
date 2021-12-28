<template>
  <div>
    <div class="h-[10rem] md:h-[20rem] bg-zinc-900">
      <div class="container mx-auto h-full">
        <div class="flex flex-col justify-center items-center h-full">
          <h1 class="text-rose-500 text-3xl md:text-6xl font-mono">[<span class="text-cyan-400">...solutions</span>]</h1>
        </div>
      </div>
    </div>
    <section class='bg-white max-w-4xl mx-auto px-10 py-6 mt-8 rounded-lg' v-if='articles.length'>
      <nuxt-link class='group' :to='`/solutions/${article.slug}`' v-for='(article, index) in articles' :key='index'>
        <h1 class='text-lg text-cyan-600 group-hover:text-cyan-700'>{{article.title}}</h1>
        <p class='text-gray-600'>{{article.description}}</p>
        <p class='text-sm text-gray-500 py-1'>Created at {{article.createdAt}}</p>
      </nuxt-link>
    </section>
  </div>

</template>

<script>
export default {
  name: "index",
  async asyncData({$content}) {
    const articles = await $content('solutions')
      .only(['slug', 'description', 'title', 'createdAt'])
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
