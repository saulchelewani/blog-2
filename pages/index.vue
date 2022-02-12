<template>
  <div>
    <Banner large>
      <h2 class='text-cyan-400 font-mono pb-8'>we spread solutions like</h2>
      <h1 class='text-rose-500 text-3xl md:text-6xl font-mono'>[<span class='text-cyan-400'>...solutions</span>]</h1>
    </Banner>
    <div class='max-w-6xl mx-auto px-10 md:grid md:grid-cols-2 gap-x-10 mt-10'>
      <NuxtLink to='/solutions'
                class='block dark:bg-zinc-800 bg-white overflow-hidden mb-8 rounded-lg lg:min-h-60 lg:flex'>
        <img src='/solutions.jpeg' alt='solutions' class='lg:w-40 object-cover'>
        <div class='p-8'>
          <div class='flex gap-x-4 border-b border-amber-500 pb-3 dark:text-gray-200'>
            <svg class='w-6 h-6 text-amber-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                 xmlns='http://www.w3.org/2000/svg'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'></path>
            </svg>
            Solutions
          </div>
          <p class='pt-3 text-gray-400'>
            We write down the solutions to the architectural or programming problems we face, so you don't have to solve
            again
          </p>
        </div>
      </NuxtLink>
      <NuxtLink to='/story' class='block dark:bg-zinc-800 bg-white mb-8 overflow-hidden rounded-lg lg:min-h-60 lg:flex'>
        <img src='/stories-about-tech.jpeg' alt='solutions' class='lg:w-40 object-cover'>
        <div class='p-8'>
          <div class='flex gap-x-4 border-b border-indigo-500 pb-3 dark:text-gray-200'>
            <svg class='w-6 h-6 text-indigo-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                 xmlns='http://www.w3.org/2000/svg'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'></path>
            </svg>
            The Story
          </div>
          <p class='pt-3 text-gray-400'>
            Detailed account of the adventures faced along the quest for solutions. The code we git is a journey
          </p>
        </div>
      </NuxtLink>
      <NuxtLink to='/about' class='block lg:flex-1 dark:bg-zinc-800 bg-white p-8 mb-8 rounded-lg hidden'>
        <div class='flex gap-x-4 border-b border-cyan-500 pb-3 dark:text-gray-200'>
          <svg class='w-6 h-6 text-cyan-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'
               xmlns='http://www.w3.org/2000/svg'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
          </svg>
          About
        </div>
        <p class='pt-3 text-gray-400'>
          There isn't much to see here, don't hold your breath
        </p>
      </NuxtLink>
    </div>
    <h1 class='uppercase font-sans text-gray-400 text-center py-1'>Latest Articles</h1>

    <div class='max-w-6xl mx-auto px-10 md:grid md:grid-cols-2 gap-x-10 mt-10 -pl-4'>
      <NuxtLink
        :to='`/${getSection(article.type)}/${article.slug}`'
        v-for='(article, index) in articles' :key='index'
        class='block bg-white p-8 mb-8 rounded hover:shadow-lg dark:bg-zinc-800 flex flex-col'
      >
        <div class='flex-1'>
          <div class='flex gap-x-4 pb-2 dark:text-gray-200'>
            <div class='text-rose-500'>[<span class='text-cyan-600'>...</span>]</div>
            {{ article.title }}
          </div>
          <p class='pt-3 text-gray-400'>{{ article.description }}</p>
        </div>
        <div class='flex items-center gap-x-2 text-gray-400 mt-3'>
          <ArticleLabel :type='article.type'/>
          <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'
               xmlns='http://www.w3.org/2000/svg'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
          </svg>
          <span class='text-xs font-sans'>{{ $moment(article.createdAt).fromNow() }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import Banner from '../components/Banner'
import ArticleLabel from '../components/ArticleLabel'

export default {
  components: {ArticleLabel, Banner},
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
      // .where({ type: 'solution' })
      .sortBy('createdAt', 'desc')
      .limit(6)
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
