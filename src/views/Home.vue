<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Username: {{$store.getters.getUsername}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Log out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="caption">Budget_tracker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat color="error" v-ripple="false">
          {{totalSpent[0]}}.
          <span
            style="padding-top:2px; text-transform: lowercase;"
            class="caption"
          >{{totalSpent[1]}} din.</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              <v-list>
                <div v-for="(item, index) in items" :key="index">
                  <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>

                  <v-list-tile :key="item.name" avatar>
                    <!-- <img :src="item.image"> -->
                    <img
                      style="borderRadius: 10%; maxWidth: 50px; margin: 5px"
                      :src="`${buildReqURL('file')}/${item.image}`"
                      alt
                    >

                    <v-list-tile-content>
                      <v-list-tile-title
                        v-html="item.name + ` <strong class='success--text'>${item.price} din.</strong>`"
                      ></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.description"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset strong></v-divider>
                  <v-layout row reverse>
                    <v-btn @click="deleteTicket(item.id)" small flat color="error" fab>
                      <v-icon large>delete</v-icon>
                    </v-btn>
                    <v-btn @click="editTicket(item.id)" small flat color="primary" fab>
                      <v-icon large>edit</v-icon>
                    </v-btn>
                  </v-layout>
                </div>
              </v-list>
            </v-card>
            <v-btn block @click="dialog = true; ">add</v-btn>
            <Forma @itemsUpd="updateItems" headline="Add ticket" :dialog.sync="dialog"/>
            <Edit
              v-if="editDia"
              @itemsUpd="updateItems"
              headline="Edit ticket"
              :ticketId.sync="ticketToEdit"
              :dialog.sync="editDia"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Forma from "@/components/Form.vue";
import Edit from "@/components/Edit.vue";
import axios from "axios";
export default {
  components: {
    Forma,
    Edit
  },
  computed: {
    totalSpent() {
      let suma = 0;
      this.items.forEach(element => {
        suma += element.price;
      });
      let showSum = suma
        .toFixed(2)
        .toString()
        .split(".");
      return showSum;
    }
  },
  mounted() {
    // check if localstorage persist, if not route to '/'
    if (!localStorage.username || localStorage.username === "") {
      this.$router.push("/login");
      return;
    }
    this.updateItems();
  },
  methods: {
    editTicket(id) {
      this.editDia = true;
      this.ticketToEdit = id;
    },
    buildReqURL(route) {
      return `${this.$store.getters.getHostIp}/${route}`;
    },
    refreshJWT() {
      let getUrl = this.buildReqURL("refreshjwt");
      let getObj = {
        headers: {
          Authorization: "Bearer " + this.$store.getters.getRefreshJwt
        }
      };
      axios.get(getUrl, getObj).then(response => {
        this.setJWTHeader(response.data.access_token);
      }).catch(err => {
        this.$router.push('/login');
      });
    },
    setJWTHeader(token) {
      this.$store.commit("set_jwt", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    },
    
    async updateItems() {
      // refreshes JWT every update
      await this.refreshJWT()
      let url = this.buildReqURL("ticket");
      axios
        .get(url)
        .then(response => {
          this.items = response.data.tickets;
        })
        .catch(error => {
          console.log('greska')
           console.log(error.response.status);
        });
    },
    logout() {
      this.$store.commit("clear_state");
      localStorage.clear();
      this.$router.push("/login");
    },
    deleteTicket(index) {
      let url = this.buildReqURL("ticket") + `/${index}`;
      axios
        .delete(url, {})
        .then(response => {
          this.updateItems();
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  },

  data: () => ({
    ticketToEdit: -1,
    dialog: false,
    editDia: false,
    drawer: null,
    items: []
  }),
  props: {
    source: String
  }
};
</script>
