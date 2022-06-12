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
              公告和留言管理
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
          <BreadcrumbItem>公告留言上传管理</BreadcrumbItem>
          <Button to="/index" icon="ios-home" @click="LOGOUT"
            >返回主页并退出登录</Button
          >
        </Breadcrumb>

        <Card>
          <div style="min-height: 200px" class="bgc">
            <p slot="title">更新公告</p>
            <Input
              v-model="value"
              type="textarea"
              :rows="10"
              placeholder="有什么想说的捏..."
            />
            <Button @click="sent">更新公告</Button>

            <p slot="title">删除留言</p>
            <Table
              border
              :columns="columns12"
              :data="data6"
              :loading="loading()"
            >
              <template slot-scope="{ row }" slot="id">
                <strong>{{ row.id }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="small" @click="remove(row, index)"
                  >Delete</Button
                >
              </template>
            </Table>
            <Page
              :total="total"
              :current="current"
              :page-size="PageSize"
              @on-change="currentchange"
            />
          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MyAdmin",
  data() {
    return {
      value: "",
      total: 1,
      current: 1,
      PageSize: 5,
      imgpassageid: "",
      resourcepassageid: "",
      file: null,
      columns12: [
        {
          title: "ID",
          slot: "id",
        },
        {
          title: "Time",
          key: "time",
        },
        {
          title: "Content",
          key: "content",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data6: [],
    };
  },
  methods: {
    loading() {
      if (this.data6.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    getdata() {
      axios({
        method: "post",
        url: `/api/hallComment/queryAllHallComment?pageNo=${this.current}&pageSize=${this.PageSize}`,
      })
        .then((res) => {
          console.log(res);
          this.data6 = res.data[0];
          this.total = parseInt(res.data[2].slice(4)) * this.PageSize;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    currentchange(val) {
      this.current = val;
      this.getdata();
    },
    remove(row, index) {
      console.log(row, index);
      axios({
        method: "post",
        url: `/api/admin/deleteHallComment?ID=${row.id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.token,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.$Message.success("删除成功!");
            this.getdata();
          }
        })
        .catch((res) => {
          console.log(res);
          this.$Message.error("删除失败!");
        });
    },
    sent() {
      if (this.value == "") {
        this.$Message.error("请输入内容！！");
      } else {
        axios({
          method: "post",
          url: `/api/admin/updateNotice?content=${this.value}`,
          headers: {
            "Content-Type": "multipart/form-data",
            token: this.$store.state.token,
          },
        })
          .then((res) => {
            this.$Message.success("发布成功！！！");
            this.value = "";
            console.log(res);
          })
          .catch((res) => {
            this.$Message.error("发布失败！！");
            console.log(res);
          });
      }
    },
    select(name) {
      if (name === "2") {
        this.$router.push({
          name: "RecoursePage",
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
    this.getdata();
  },
};
</script>

<style>
</style>