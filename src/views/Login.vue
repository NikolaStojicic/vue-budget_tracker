<template>
  <div>
    <v-content class="pt-5">
      <v-container fluid fill-height style="max-width: 500px">
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Username" v-model="username"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              @keyup.enter.native="login"
              label="Password"
              type="password"
              v-model="password"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn @click="login" color="success" block>Login</v-btn>
          </v-flex>
          <v-flex xs12>
            <v-btn @click="register" color="primary" block>Register</v-btn>
          </v-flex>
          <v-flex xs12>
            <span class="red--text">{{errorMessage}}</span>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Server addres" v-model="hostIp"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn flat @click="connect" block color="success">Connect</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.refreshUrl();
  },
  methods: {
    buildReqURL(route) {
      return `${this.$store.getters.getHostIp}/${route}`;
    },
    refreshUrl() {
      axios
        .get(
          "https://raw.githubusercontent.com/NikolaStojicic/flask_budget_tracker/master/ngrok_tunnel"
        )
        .then(response => {
          this.hostIp = url.data.url;
          this.connect();
        });
    },
    connect() {
      this.$store.commit("set_host_ip", this.hostIp);
      let url = this.buildReqURL("ping");
      axios
        .get(url)
        .then(response => {
          this.errorMessage = response.data.msg;
        })
        .catch(error => {
          if (error.response === undefined) {
            this.errorMessage =
              "Something went wrong! Server probably not present or ip adress inccorect!";
          } else this.errorMessage = error.response.data.msg;
        });
    },
    register() {
      let url = this.buildReqURL("register");
      let postObj = {
        username: this.username,
        password: this.password
      };
      axios
        .post(url, postObj)
        .then(response => {
          this.errorMessage = response.data.msg;
        })
        .catch(error => {
          this.errorMessage = error.response.data.msg;
        });
    },
    login() {
      let url = this.buildReqURL("login");
      let postObj = {
        username: this.username,
        password: this.password
      };
      axios
        .post(url, postObj)
        .then(response => {
          this.$store.commit("set_jwt", this.jwt);
          this.$store.commit("set_username", this.username);
          this.$store.commit("set_refresh_jwt", response.data.refresh_token);
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error.response);
          this.errorMessage = error.response.data.msg;
        });
    }
  },

  data() {
    return {
      hostIp: "",
      errorMessage: "",
      username: "",
      password: ""
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
