<template>
  <div class="register">
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
      <b-button class="lf--submit" @click="doRegister">REGISTER</b-button>
    </form>
  </div>
</template>
<script>
import { register } from "@/apis.js";
export default {
  name: "register",
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    doRegister() {
      register({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          if (!response.data.error) {
            this.$router.push({ path: "/login" });
          } else {
            this.$swal.fire({
              title: "帳號重復!",
              icon: "error",
              confirmButtonColor: "#FF4C3F",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>