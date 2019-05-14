<template>
  <div>
    <v-layout row justify-center>
      <v-dialog dark v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{headline}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn
                    onclick="document.getElementById('file-input').click();"
                    block
                  >Promeni sliku</v-btn>
                  <input
                    @change="onFileSelected"
                    id="file-input"
                    type="file"
                    name="name"
                    style="display: none;"
                  >
                  <v-img
                    style="maxWidth: 350px; maxHeight: 350px; borderRadius: 10%"
                    :src="imageToShow()"
                  ></v-img>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="ticket.name" label="Name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="ticket.price" label="Price"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="ticket.description" label="Description" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" flat @click="$emit('update:dialog', false);">Close</v-btn>
            <v-btn color="success" @click="saveItem" flat>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    let url = this.buildReqURL(`ticket/${this.ticketId}`);
    axios.get(url).then(response => {
      console.log(response);
      let name = response.data.ticket.name;
      let image = response.data.ticket.image;
      let description = response.data.ticket.description;
      let price = response.data.ticket.price;
      this.setTicket(name, price, description, image);
    });
  },
  methods: {
    buildReqURL(route) {
      return `${this.$store.getters.getHostIp}/${route}`;
    },

    imageToShow() {
      let url = this.buildReqURL("file");
      if (this.upload_img !== "") {
        return this.upload_img;
      } else if (!this.ticket.image || this.ticket.image === "no_img") {
        return "";
      } else {
        return url + `/${this.ticket.image}`;
      }
    },
    saveItem() {
      let url = this.buildReqURL("ticket") + `/${this.ticketId}`;
      let putObj = {
        name: this.ticket.name,
        price: this.ticket.price,
        description: this.ticket.description,
        image: this.ticket.image
      };
      let putHeader = {
        headers: {
          Authorization: "Bearer " + this.$store.getters.getJwt
        }
      };
      axios
        .put(url, putObj, putHeader)
        .then(response => {
          this.$emit("itemsUpd");
          this.$emit("update:dialog", false);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    setTicket(name, price, description, image) {
      this.ticket.name = name;
      this.ticket.price = price;
      this.ticket.description = description;
      this.ticket.image = image;
    },
    onFileSelected(event) {
      let url = this.buildReqURL("file");
      let formData = new FormData();
      let image = event.target.files[0];
      let postHeaders = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.ticket.image = image.name;
      this.upload_img = URL.createObjectURL(image);
      formData.append("file", image);
      axios.post(url, formData, postHeaders).catch(err => {
        console.log(err.response);
      });
    }
  },
  data() {
    return {
      upload_img: "",
      ticket: {
        name: "",
        price: "",
        description: "",
        image: ""
      }
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    headline: {
      type: String,
      default: ""
    },
    ticketId: {
      type: Number,
      default: -1
    }
  }
};
</script>

<style lang="scss" scoped>
</style>