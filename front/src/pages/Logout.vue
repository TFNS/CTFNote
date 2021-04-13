<template>
    <div>Logout</div>
</template>

<script>
export default {
  created(){
    this.$ctfnote.logout()
    window.location.reload()
  }
}
</script>