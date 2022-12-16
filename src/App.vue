<template>
  <nav class="nav">
    <router-link to="/" active-class="active">KotiSivu</router-link>
    <router-link to="/receipt" active-class="active">Reseptit</router-link>
  </nav>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import './styles/constants.scss';
.nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  .active {
    color: $orange;
  }
}
</style>
