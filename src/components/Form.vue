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
                  <v-btn onclick="document.getElementById('file-input').click();" block>Dodaj sliku</v-btn>
                  <input
                    @change="onFileSelected"
                    id="file-input"
                    type="file"
                    name="name"
                    style="display: none;"
                  >
                  <v-img :src="upload_img"></v-img>
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
            <v-btn color="success" flat :disabled="!saveBtn" @click="saveItem">Save</v-btn>
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
    this.hostIp = this.$store.getters.getHostIp;
  },
  methods: {
    buildReqURL(route) {
      return `${this.$store.getters.getHostIp}/${route}`;
    },
    onFileSelected(event) {
      let formData = new FormData();
      let image = event.target.files[0];
      let url = this.buildReqURL("file");
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
    },
    clearItems() {
      this.upload_img = "";
      this.ticket.name = "";
      this.ticket.price = "";
      this.ticket.description = "";
      this.ticket.image = "";
      this.saveBtn = true;
    },
    saveItem(event) {
      let url = this.buildReqURL("ticket");
      let postObj = {
        name: this.ticket.name,
        price: this.ticket.price,
        description: this.ticket.description,
        image: this.ticket.image
      };
      let postHeaders = {
        headers: {
          Authorization: "Bearer " + this.$store.getters.getJwt
        }
      };
      axios
        .post(url, postObj, postHeaders)
        .then(response => {
          this.$emit("itemsUpd");
          this.clearItems();
          this.$emit("update:dialog", false);
        })
        .catch(err => {
          console.log(err.response);
        });
      this.saveBtn = false;
    }
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    headline: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      saveBtn: true,
      upload_img: "",
      ticket: {
        name: "",
        price: "",
        description: "",
        image: ""
      }
    };
  }
};
</script>