<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          active-name="1"
          @on-select="select"
        >
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="md-contact" />
              公告留言上传管理
            </MenuItem>
            <MenuItem name="2">
              <Icon type="md-contact" />
              文章管理
            </MenuItem>
            <MenuItem name="3">
              <Icon type="md-contact" />
              用户管理
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 50px' }">
        <Breadcrumb :style="{ margin: '20px 0' }">
          <BreadcrumbItem>文章管理</BreadcrumbItem>
          <Button to="/index" icon="ios-home" @click="LOGOUT"
            >返回主页并退出登录</Button
          >
          <Button type="success" @click="modal1 = true">点击创建文章</Button>
          <Button @click="lookfile">点击查看文件总数</Button>
          <Modal
            v-model="modal1"
            title="点击创建文章"
            @on-ok="ok"
            @on-cancel="cancel"
            width="760"
          >
            <h3>文章标题</h3>
            <Input
              v-model="value16"
              type="textarea"
              placeholder="Enter something..."
            />
            <h3>文章内容</h3>
            <Input
              v-model="value17"
              type="textarea"
              :rows="4"
              placeholder="Enter something..."
            />
          </Modal>
        </Breadcrumb>

        <Card>
          <div>
            <Table
              border
              :columns="columns"
              :data="passageData"
              :loading="loading()"
            >
              <template slot-scope="{ row }" slot="name">
                <strong>{{ row }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="getPassageResource(row.id), (modal2 = true)"
                  >详情</Button
                >
                <Button type="error" size="small" @click="removePassage(row.id)"
                  >Delete</Button
                >
              </template>
            </Table>
            <Page
              :total="listTotal * 10"
              size="small"
              show-elevator
              @on-change="change"
              class="page"
            />

            <Modal
              v-model="modal2"
              @on-ok="ok1"
              class="dialog"
              :styles="{ top: '0px' }"
              fullscreen
            >
              <Divider orientation="center">标题</Divider>

              <h2>{{ passageResource[0].title }}</h2>
              <Divider orientation="center">内容</Divider>
              <p>{{ passageResource[0].content }}</p>
              <Divider orientation="center">图片</Divider>
              <div class="hezi">
                <div v-for="item in passageResource[2]" :key="item">
                  <img :src="'data:image/png;base64,' + item" class="picture" />
                </div>
              </div>
              <Divider orientation="center">评论</Divider>
              <List>
                <p v-if="passageResource[3].length === 0" class="noComment">
                  暂无评论
                </p>
                <ListItem
                  v-for="(user, index) in passageResource[3]"
                  :key="index"
                  class="comment"
                  >{{ user.content }}
                  <Button type="error" @click="removeComment(user)"
                    >Delete</Button
                  ></ListItem
                >
                <div style="min-height: 100px" class="send">
                  <Input
                    v-model="inputValue"
                    type="textarea"
                    :autosize="{ minRows: 3 }"
                    class="textarea"
                  />
                  <i-button
                    type="error"
                    @click="addComment(passageResource[0].id)"
                    >发表评论</i-button
                  >
                </div>

                <Divider orientation="left">下载</Divider>
                <p
                  v-if="
                    (passageResource[1].length === 1 &&
                      passageResource[1][0].address == '暂无') ||
                    passageResource[1].length === 0
                  "
                  class="noComment"
                >
                  暂无下载链接捏
                </p>
                <div v-if="passageResource[1][0].address != '暂无'">
                  <ListItem
                    v-for="(user, index) in passageResource[1]"
                    :key="index"
                    >{{ user.address
                    }}<Button type="error" @click="removeResoruce(user)"
                      >Delete</Button
                    >
                  </ListItem>
                </div>
              </List>
              <Divider />
              <Upload action="123" :before-upload="handleUpload" class="upload">
                <Button icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
              <Upload action="123" :before-upload="UploadImg" class="upload">
                <Button icon="ios-cloud-upload-outline">上传图片</Button>
              </Upload>
              <Divider />

              <p class="time">发布时间：{{ passageResource[0].time }}</p>
            </Modal>
          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import {
  apiUploadResource,
  apiUploadImg,
  apiRemoveComment,
  apiRemoveResource,
  apiGetPassage,
  apiGetPassageResource,
  apiCreateAdminComment,
  apiRemovePassage,
  apiGetFileCount,
  apiCreatePassage,
} from "@/request/api/passage.js";
export default {
  name: "RecoursePage",
  data() {
    return {
      columns: [
        {
          title: "标题",
          key: "title",
          ellipsis: true,
        },
        {
          title: "内容",
          key: "content",
          ellipsis: true,
        },
        {
          title: "发布时间",
          key: "time",
          width: 300,
          sortable: true,
        },
        {
          title: "Action",
          slot: "action",
          width: 200,
          align: "center",
        },
      ],
      passageData: [],
      pageNo: 1,
      pageSize: 10,
      listTotal: 0,
      modal1: false,
      modal2: false,
      passageResource: [
        { content: "", title: "", time: "", id: 0 },
        [{ address: "" }],
        {},
        [],
      ],
      inputValue: "",
      value16: "",
      value17: "",
    };
  },
  methods: {
    loading() {
      if (this.passageData.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    handleUpload(file) {
      let data = new FormData();
      let c = this;
      data.append("file", file);
      data.append("passageID", this.passageResource[0].id);
      apiUploadResource(data)
        .then((response) => {
          c.$Message.success("上传成功啦~");
          c.getPassageResource(c.passageResource[0].id);
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
      return false;
    },
    UploadImg(file) {
      let data = new FormData();
      let c = this;
      data.append("file", file);
      data.append("passageID", this.passageResource[0].id);
      apiUploadImg(data)
        .then((response) => {
          c.$Message.success("上传成功啦~");
          c.getPassageResource(c.passageResource[0].id);
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
      return false;
    },
    getPassage() {
      let c = this;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      apiGetPassage(data)
        .then((response) => {
          c.listTotal = response.data.总页数;
          for (let i = 0; i < response.data.passageItem.length; i++) {
            c.passageData.push(response.data.passageItem[i]);
          }
        })
        .catch((error) => {
          console.log("请求失败", error);
          c.getPassage();
        });
    },
    getPassageResource(id) {
      let c = this;
      const data = {
        passageID: id,
      };
      apiGetPassageResource(data)
        .then((response) => {
          c.passageResource = response.data;
          c.passageResource[2] = Object.values(c.passageResource[2]);
          if (c.passageResource[1][0] == undefined) {
            c.passageResource[1] = [{ address: "暂无" }];
          }
          c.value17 = c.passageResource[0].title;
          c.value16 = c.passageResource[0].content;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.getPassageResource(id);
        });
    },

    change(page) {
      this.pageNo = page;
      this.passageData.length = 0;
      this.getPassage();
    },
    addComment(id) {
      let c = this;
      const data = {
        content: this.inputValue,
        passageID: id,
      };
      apiCreateAdminComment(data)
        .then((response) => {
          if (response.data.code == 401) {
            c.$Message.error("发送内容不能为空");
          } else {
            c.$Message.success("发送成功");
          }
          c.inputValue = "";
          c.getPassageResource(id);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    removeComment(user) {
      let c = this;
      let data = new URLSearchParams();
      data.append("commentID", user.commentID);
      apiRemoveComment(data)
        .then((response) => {
          c.$Message.success("删除成功");
          c.getPassageResource(user.passageID);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    removePassage(id) {
      let c = this;
      const data = {
        passageID: id,
      };
      apiRemovePassage(data)
        .then((response) => {
          c.$Message.success("删除成功");
          c.passageData.length = 0;
          c.getPassage();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          c.removeComment(id);
        });
    },
    removeResoruce(user) {
      let c = this;
      let data = new URLSearchParams();
      data.append("resourcesID", user.id);
      apiRemoveResource(data)
        .then((response) => {
          console.log(response);
          c.$Message.success("删除成功");
          c.getPassageResource(user.passageID);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          c.removeComment(id);
        });
    },
    lookfile() {
      apiGetFileCount()
        .then((res) => {
          console.log("123123", res);
          this.$Message.success("当前文件总数为:" + res.data);
        })
        .catch((res) => {
          console.log(res);
        });
    },
    ok() {
      if (this.value16 == "" && this.value17 == "") {
        this.$Message.error("请输入内容！！");
      } else {
        const data = {
          content: this.value17,
          title: this.value16,
        };
        apiCreatePassage(data)
          .then((res) => {
            this.$Message.success("发布成功啊哈哈哈！！！");
            this.value17 = "";
            this.value16 = "";
            this.getPassage();
            console.log(res);
          })
          .catch((res) => {
            this.$Message.error("发布失败呜呜呜！！");
            console.log(res);
          });
      }
      this.passageData.length = 0;
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    ok1() {},

    select(name) {
      if (name === "1") {
        this.$router.push({
          name: "MyAdmin",
        });
      }
      if (name === "3") {
        this.$router.push({
          name: "UserPage",
        });
      }
    },
    LOGOUT() {
      this.$store.commit("LOGOUT");
      this.$Message.success("注销成功！");
    },
  },
  created() {
    this.getPassage();
  },
};
</script>

<style scoped>
.noComment {
  margin-bottom: 10px;
}
.time {
  float: right;
}
.dialog /deep/ .ivu-modal-footer {
  margin-top: 10px;
}
.dialog .ivu-list-item {
  display: block;
}
.dialog button {
  float: right;
}
.comment button {
  margin-bottom: 5px;
}
.page {
  text-align: center;
}
.title /deep/ .ivu-input {
  font-size: 20px;
  font-weight: 700;
  height: 40px;
  width: 50%;
}
.send .textarea {
  margin-bottom: 15px;
}
.upload {
  margin-top: 5px;
  float: right;
}
.create {
  margin-top: 20px;
}
h2 {
  text-align: center;
}
.hezi {
  width: 50%;
  margin: 0 auto;
}
.picture {
  width: 200px;
  height: 200px;
  margin: 0 100px;
}
</style>