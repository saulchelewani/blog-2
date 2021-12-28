<template>
  <div>
    <div class='h-[16rem] md:h-[28rem] bg-zinc-900'>
      <div class='container mx-auto h-full'>
        <div class='flex flex-col justify-center items-center h-full'>
          <h2 class='text-gray-400 font-mono pb-8'>we spread solutions like</h2>
          <h1 class='text-rose-500 text-3xl md:text-6xl font-mono'>[<span class='text-cyan-400'>...solutions</span>]
          </h1>
        </div>
      </div>
    </div>
    <div class='max-w-6xl mx-auto px-10 lg:flex md:flex-wrap gap-x-10 mt-10'>
      <NuxtLink to='/solutions' class='block lg:flex-1 bg-white p-8 mb-8 rounded-lg'>
        <div class='flex gap-x-4 border-b border-amber-500 pb-3'>
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
      </NuxtLink>
      <NuxtLink to='/story' class='block lg:flex-1 bg-white p-8 mb-8 rounded-lg'>
        <div class='flex gap-x-4 border-b border-indigo-500 pb-3'>
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
      </NuxtLink>
      <NuxtLink to='/about' class='block lg:flex-1 bg-white p-8 mb-8 rounded-lg'>
        <div class='flex gap-x-4 border-b border-cyan-500 pb-3'>
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

    <div class='max-w-6xl mx-auto px-10 lg:flex md:flex-wrap gap-x-10 mt-10'>
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
        <span class='uppercase text-xs bg-cyan-100 text-cyan-600 p-1 rounded font-sans font-semibold'>{{ article.type }}</span>
        <span class='text-xs text-gray-400 font-sans'>{{ $moment(article.createdAt).fromNow() }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getSection(type) {
      let map = []
      map['solution'] = 'solutions'
      map['about'] = 'about'
      map['story'] = 'story'
      return map[type]
    }
  },
  async asyncData({ $content }) {
    const articles = await $content()
      .only(['slug', 'description', 'title', 'createdAt', 'type'])
      .where({ type: 'solution' })
      .sortBy('createdAt', 'desc')
      .limit(6)
      .fetch()
    return { articles }
  },
  data() {
    return {
      articles: []
    }
  }
}
</script>
