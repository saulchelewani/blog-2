<template>
  <div class='h-[10rem] md:h-[20rem] bg-zinc-900 bg-gradient-to-r from-zinc-800 to-cyan-800'>
    <div class='container mx-auto h-full'>
      <div class='max-w-4xl mx-auto flex flex-col justify-center h-full px-10'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBanner'
}
</script>

<style scoped>

</style>
