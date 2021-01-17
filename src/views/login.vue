<template>
  <div class="login">
    <form class="login-form">
      <div class="flex-row">
        <label class="lf--label" for="username">
          <b-icon icon="person"></b-icon>
        </label>
        <input
          id="username"
          class="lf--input"
          placeholder="Username"
          type="text"
          v-model="username"
        />
      </div>
      <div class="flex-row">
        <label class="lf--label" for="password">
          <b-icon icon="key"></b-icon>
        </label>
        <input
          id="password"
          class="lf--input"
          placeholder="Password"
          type="password"
          v-model="password"
        />
      </div>
      <b-button class="lf--submit" @click="doLogin">LOGIN</b-button>
      <b-button variant="link" @click="toRegister">Register</b-button>
    </form>
  </div>
</template>
<script>
import { login } from "@/apis.js";
export default {
  name: "login",
  data() {
    return {
        username: null,
        password: null
    };
  },
  methods: {
    doLogin() {
      login({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          this.$store.commit('set', ['userId', response.data.user_id])
          this.$router.push({ path: '/imageWall' })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toRegister() {
        this.$router.push({ path: '/register' })
    }
  },
  mounted() {
    // this.doLogin();
    
  },
};
</script>