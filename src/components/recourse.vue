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
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-people" />
                页面选择
              </template>
              <MenuItem name="1-1">主页</MenuItem>
              <MenuItem name="1-2">资源文章</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-people" />
                用户管理
              </template>
              <MenuItem name="2-1">注销</MenuItem>
            </Submenu>
            <MenuItem name="3">
              <Icon type="md-contact" />
              {{ $store.state.user }}
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 50px' }">
        <Breadcrumb :style="{ margin: '20px 0' }">
          <BreadcrumbItem>Home</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div>
            <Table
              border
              :columns="columns12"
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
                  @click="getPassageResource(row.id), (modal1 = true)"
                  >点击查看</Button
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
              v-model="modal1"
              class="dialog"
              :styles="{ top: '0px' }"
              fullscreen
            >
              <h2 class="title">{{ passageResource[0].title }}</h2>
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
                  >{{ user.name }} {{ user.content }}</ListItem
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

                <Divider orientation="center">下载</Divider>
                <p
                  v-if="
                    (passageResource[1].length === 1 &&
                      passageResource[1][0].address == '暂无') ||
                    passageResource[1].length === 0
                  "
                  class="noComment"
                >
                  暂无下载链接
                </p>
                <div v-if="passageResource[1][0].address != '暂无'">
                  <ListItem
                    v-for="(user, index) in passageResource[1]"
                    :key="index"
                    >{{ user.address }}
                    <Button @click="DownResource(user)">下载</Button>
                  </ListItem>
                </div>
              </List>

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
  apiDownResource,
  apiGetPassage,
  apiGetPassageResource,
  apiCreateComment,
} from "@/request/api/passage.js";
export default {
  name: "RecourseIndex",
  data() {
    return {
      columns12: [
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
          width: 150,
          align: "center",
        },
      ],
      passageData: [],
      pageNo: 1,
      pageSize: 10,
      listTotal: 0,
      modal1: false,
      passageResource: [
        { content: "", title: "", time: "", id: 0 },
        [{ address: "" }],
        {},
        [],
      ],
      inputValue: "",
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
          c.passageTitle = c.passageResource[0].title;
          c.passageContent = c.passageResource[0].content;
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
      if (this.inputValue == "") {
        c.$Message.error("发送内容不能为空噢~~");
        return;
      }
      const data = {
        content: this.inputValue,
        passageID: id,
        userID: 1,
      };
      apiCreateComment(data)
        .then((response) => {
          if (response.data.code == 401) {
            c.$Message.error("发送内容不能为空喔喔~~");
          } else {
            c.$Message.success("发送成功啦~~");
          }
          c.inputValue = "";
          c.getPassageResource(id);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    DownResource(user) {
      let data = new FormData();
      data.append("filePath", user.address);
      apiDownResource(data)
        .then((res) => {
          console.log(res);
          res = res.data;
          let blob = new Blob([res], { type: res.type });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = user.address;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    select(name) {
      if (name === "1-1") {
        this.$router.push({
          name: "LoginDone",
        });
      }
      if (name === "2-1") {
        this.$store.commit("LOGOUT");
        this.$Message.success("注销成功！");
        this.$router.push({
          name: "IndexMain",
        });
      }
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
.dialog button {
  float: right;
}
.time {
  float: right;
}
.dialog .ivu-list-item {
  display: block;
}
.dialog /deep/ .ivu-modal-footer {
  margin-top: 10px;
}
.page {
  text-align: center;
}
.send .textarea {
  margin-bottom: 15px;
}
p {
  display: inline;
}
.title {
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