<template>
  <div
    :class="large ? 'h-[16rem] md:h-[28rem]' : 'h-[10rem] md:h-[20rem]'"
    class=" bg-zinc-900 bg-gradient-to-r from-zinc-800 to-cyan-800">
    <div class='container mx-auto h-full'>
      <div class='flex flex-col justify-center items-center h-full'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    large: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
