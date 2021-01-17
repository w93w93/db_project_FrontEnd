<template>
  <div class="profile">
    <div class="row">
      <div class="col">
        <b-icon
          icon="person-circle"
          font-scale="12"
          variant="secondary"
          class=""
        ></b-icon>
        <h2>{{ username }}</h2>
      </div>
    </div>
    <b-card>
      <h4 v-if="items.length == 0">no images</h4>
      <vue-masonry-wall :items="items" :options="ImageOptions" v-else>
        <template v-slot:default="{ item }">
          <div class="Item" @click="showImageInfo(item.id, item.image)">
            <img :src="item.image" />
          </div>
        </template>
      </vue-masonry-wall>
    </b-card>
    <b-modal
      id="imageInfo"
      ref="imageInfo"
      size="lg"
      title=""
      v-model="modalShow"
      hide-header
      hide-footer
      hide-header-close
      centered
    >
      <div class="row">
        <div class="col imgInfo">
          <img :src="img_url" />
          <div class="info">
            <span>上傳者: {{ uploader }}</span>
            <div class="icons">
              <span @click="clickLiked"
                ><b-icon icon="hand-thumbs-up" :class="likeClass"></b-icon>
                {{ like_count }}</span
              >
              <span @click="clickHeart"
                ><b-icon :icon="heartIcon"></b-icon> {{ favoriteText }}</span
              >
            </div>
          </div>
          <span>評分: {{ rating }}</span>
        </div>
        <div class="col imgComment">
          <h4>評論</h4>
          <h5 v-if="commentItems.length == 0">無評論</h5>
          <div v-else class="comment">
            <b-list-group>
              <b-list-group-item v-for="(v, i) in commentItems" :key="i">
                <h6 class="commentUser">{{ v.user }}</h6>
                <p>{{ v.content }}</p>
              </b-list-group-item>
            </b-list-group>
          </div>
          <div class="postComment">
            <div>
              <b-form-group>
                <b-form-tags
                  id="tags-with-dropdown"
                  v-model="HashTag"
                  no-outer-focus
                  class="mb-2"
                >
                  <template v-slot="{ tags, disabled, addTag, removeTag }">
                    <ul
                      v-if="tags.length > 0"
                      class="list-inline d-inline-block mb-2"
                    >
                      <li
                        v-for="tag in tags"
                        :key="tag"
                        class="list-inline-item"
                      >
                        <b-form-tag
                          @remove="RemoveTag({ tag, removeTag })"
                          :title="tag"
                          :disabled="disabled"
                          variant="info"
                          >{{ tag }}</b-form-tag
                        >
                      </li>
                    </ul>

                    <b-dropdown
                      size="sm"
                      variant="outline-secondary"
                      block
                      menu-class="w-100"
                    >
                      <template #button-content>
                        <b-icon icon="tag-fill"></b-icon> Choose tags
                      </template>
                      <b-dropdown-form @submit.stop.prevent="() => {}">
                        <b-form-group
                          label="new tag"
                          label-for="tag-search-input"
                          label-cols-md="auto"
                          class="mb-0"
                          label-size="sm"
                          :disabled="disabled"
                        >
                          <b-input-group>
                            <b-form-input
                              v-model="newTag"
                              id="tag-search-input"
                              type="text"
                              size="sm"
                              autocomplete="off"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                class="tagButton"
                                @click="addNewTag"
                                >新增</b-button
                              >
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-dropdown-form>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item-button
                        v-for="option in availableOptions"
                        :key="option.value"
                        @click="onOptionClick({ option, addTag })"
                      >
                        {{ option.text }}
                      </b-dropdown-item-button>
                      <b-dropdown-text v-if="availableOptions.length === 0">
                        There are no tags available to select
                      </b-dropdown-text>
                    </b-dropdown>
                  </template>
                </b-form-tags>
              </b-form-group>
            </div>
            <b-form-rating
              v-model="rateValue"
              variant="warning"
              class="mb-2"
            ></b-form-rating>
            <b-form-textarea
              id="textarea-default"
              v-model="commentText"
              placeholder="寫下你的感想吧"
              rows="2"
              max-rows="3"
            ></b-form-textarea>
            <b-button variant="outline-primary" size="sm" @click="submit"
              >送出</b-button
            >
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import VueMasonryWall from "vue-masonry-wall";
import {
  getUserFavorite,
  imgInfo,
  changeFavorite,
  changeLike,
  rate,
  comment,
  getTags,
  getTagByImageId,
  addNewTags,
  addImageTag,
  removeImageTag,
} from "@/apis.js";
export default {
  name: "profile",
  components: { VueMasonryWall },
  data() {
    return {
      username: null,
      RemoveT: null,
      HashTag: [],
      title: null,
      category: null,
      imageFile: null,
      imageModalShow: false,
      options: [],
      newTag: "",
      is_liked: false,
      likeClass: "unlike",
      is_favorite: false,
      imgId: null,
      favoriteText: "收藏",
      rateValue: 0,
      commentText: null,
      rating: 0,
      heartIcon: "heart",
      like_count: null,
      uploader: null,
      img_url: null,
      modalShow: false,
      ImageOptions: {
        width: 300,
        padding: {
          2: 8,
          default: 12,
        },
      },
      commentItems: [],
      items: [],
    };
  },
  computed: {
    availableOptions() {
      // Filter out already selected options
      const options = this.options.filter(
        (opt) => this.HashTag.indexOf(opt.text) === -1
      );

      // Show all options available
      return options;
    },
    getRemoveTagId() {
      const removeTagId = this.options.filter(
        (opt) => this.RemoveT.indexOf(opt.text) > -1
      );
      return removeTagId[0].value;
    },
  },
  watch: {
    is_favorite(val) {
      if (val) {
        this.heartIcon = "heart-fill";
        this.favoriteText = "已收藏";
      } else {
        this.heartIcon = "heart";
        this.favoriteText = "收藏";
      }
    },
    is_liked(val) {
      if (val) {
        this.likeClass = "like";
      } else {
        this.likeClass = "unlike";
      }
    },
  },
  methods: {
    getImage(id) {
      this.items = [];
      getUserFavorite({
        userId: id,
      })
        .then((response) => {
          for (let i of response.data) {
            this.items.push({
              id: i.id,
              image: `http://localhost:3001${i.url}`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTag() {
      getTags()
        .then((response) => {
          this.options = [];
          for (let i of response.data) {
            this.options.push({
              value: i.id,
              text: i.tag,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showImageInfo(img_id, url) {
      this.imgId = img_id;
      imgInfo({
        imgId: img_id,
        userId: this.$store.state.userId,
      })
        .then((response) => {
          this.commentItems = [];
          this.rateValue = 0;
          this.uploader = response.data.img.uploader.username;
          this.like_count = response.data.like_count;
          this.rating =
            response.data.rating != null ? response.data.rating.toFixed(1) : 0;
          this.is_favorite = response.data.is_favorite;
          this.is_liked = response.data.liked;
          for (let i of response.data.comment) {
            this.commentItems.push({
              content: i.content,
              user: i.username,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.HashTag = [];
      getTagByImageId({
        imageId: img_id,
      })
        .then((response) => {
          for (let i of response.data) {
            this.HashTag.push(i.tag);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.img_url = url;
      this.modalShow = true;
    },
    clickHeart() {
      let favorite = 0;
      if (this.is_favorite) {
        favorite = 0;
        this.is_favorite = false;
      } else {
        favorite = 1;
        this.is_favorite = true;
      }
      changeFavorite({
        userId: this.$store.state.userId,
        imgId: this.imgId,
        on: favorite,
      })
        .then(() => {
          if (!this.$route.params.name) {
            this.getImage(this.$store.state.userId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async clickLiked() {
      let liked = 0;
      if (this.is_liked) {
        liked = 0;
        this.is_liked = false;
      } else {
        liked = 1;
        this.is_liked = true;
      }

      await changeLike({
        userId: this.$store.state.userId,
        imgId: this.imgId,
        on: liked,
      })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

      imgInfo({
        imgId: this.imgId,
        userId: this.$store.state.userId,
      })
        .then((response) => {
          this.like_count = response.data.like_count;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onOptionClick({ option, addTag }) {
      addTag(option.text);
      addImageTag({
        imgId: this.imgId,
        userId: this.$store.state.userId,
        tagId: option.value,
      })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    },
    RemoveTag({ tag, removeTag }) {
      this.RemoveT = tag;
      removeImageTag({
        imgId: this.imgId,
        userId: this.$store.state.userId,
        tagId: this.getRemoveTagId,
      })
        .then(() => {
          removeTag(tag);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async addNewTag() {
      await addNewTags({
        tagName: this.newTag,
      })
        .then(() => {
          this.newTag = "";
        })
        .catch((error) => {
          console.log(error);
        });
      this.getTag();
    },
    async submit() {
      if (this.rateValue != 0) {
        await rate({
          userId: this.$store.state.userId,
          imgId: this.imgId,
          rate: this.rateValue,
        })
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

        imgInfo({
          imgId: this.imgId,
          userId: this.$store.state.userId,
        })
          .then((response) => {
            this.rateValue = 0;
            this.rating =
              response.data.rating != null
                ? response.data.rating.toFixed(1)
                : 0;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (this.commentText) {
        await comment({
          userId: this.$store.state.userId,
          imgId: this.imgId,
          content: this.commentText,
        })
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

        imgInfo({
          imgId: this.imgId,
          userId: this.$store.state.userId,
        })
          .then((response) => {
            this.commentItems = [];
            this.commentText = null;
            for (let i of response.data.comment) {
              this.commentItems.push({
                content: i.content,
                user: i.username,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    if (this.$route.params.id && this.$route.params.name) {
      this.getImage(this.$route.params.id);
      this.username = this.$route.params.name;
    } else {
      this.getImage(this.$store.state.userId);
      this.username = this.$store.state.username;
    }

    this.getTag();
  },
};
</script>