<template>
  <div>
    <div class="h-[10rem] md:h-[20rem] bg-zinc-900">
      <div class="container mx-auto h-full">
        <div class="flex flex-col justify-center items-center h-full">
          <h1 class="text-rose-500 text-3xl md:text-6xl font-mono">[<span class="text-cyan-400">...solutions</span>]</h1>
        </div>
      </div>
    </div>
    <section class='max-w-4xl mx-auto px-10 py-6 mb-4 lg:mt-8 lg:rounded-lg' v-if='articles.length'>
      <NuxtLink :to='`/${getSection(article.type)}/${article.slug}`'
                class='block bg-white p-8 mb-8 rounded-lg md:w-1/2 hover:shadow-lg'
                v-for='(article, index) in articles' :key='index'>
        <div class='flex gap-x-4 pb-2'>
          <svg class='w-6 h-6 text-amber-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'
               xmlns='http://www.w3.org/2000/svg'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'></path>
          </svg>
          {{ article.title }}
        </div>
        <p class='pt-3 text-gray-400'>{{ article.description }}</p>
        <span class='text-xs text-gray-400 font-sans'>{{ $moment(article.createdAt).fromNow() }}</span>
      </NuxtLink>
    </section>
  </div>

</template>

<script>
export default {
  name: "index",
  methods: {
    getSection(type) {
      let map = []
      map['solution'] = 'solutions'
      map['about'] = 'about'
      map['story'] = 'story'
      return map[type]
    }
  },
  async asyncData({$content}) {
    const articles = await $content()
      .only(['slug', 'description', 'title', 'createdAt', 'type'])
      .where({type: 'solution'})
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
