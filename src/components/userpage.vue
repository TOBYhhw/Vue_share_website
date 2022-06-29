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
          <BreadcrumbItem>用户管理</BreadcrumbItem>
          <Button to="/index" icon="ios-home" @click="LOGOUT"
            >返回主页并退出登录</Button
          >
        </Breadcrumb>

        <Card>
          <div style="min-height: 200px" class="bgc">
            <Row>
              <Col span="11">
                <Card>
                  <p slot="title">所有用户信息</p>
                  <Table
                    :columns="columns1"
                    :data="data1"
                    :loading="loading()"
                  ></Table>
                  <Page
                    :total="total"
                    :current="current"
                    :page-size="PageSize"
                    @on-change="currentchange"
                  />
                </Card>
              </Col>
              <Col span="11" offset="2">
                <Card>
                  <p slot="title">搜索用户注册信息</p>
                  <Input
                    search
                    enter-button
                    placeholder="输入用户名来搜索"
                    @on-search="search"
                  />

                  <h2 v-if="show">用户ID:{{ data2.userId }}</h2>
                  <h2 v-if="show">用户名:{{ data2.username }}</h2>
                  <h2 v-if="show">密码:{{ data2.password }}</h2>
                  <h3 v-if="!show">无用户信息</h3>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import { apiGetUser, apiSearchUser } from "@/request/api/admin";
export default {
  name: "UserPage",
  data() {
    return {
      columns1: [
        { title: "ID", key: "userId" },
        { title: "用户名", key: "username" },
        { title: "密码", key: "password" },
      ],
      show: false,
      data1: [],
      data2: [],
      total: 1,
      current: 1,
      PageSize: 5,
    };
  },
  created() {
    const data = {
      pageNo: this.current,
      pageSize: this.PageSize,
    };
    apiGetUser(data)
      .then((res) => {
        console.log(res);
        this.data1 = res.data[0];
        this.total = parseInt(res.data[1].slice(3)) * this.PageSize;
      })
      .catch((res) => {
        console.log(res);
      });
  },
  methods: {
    loading() {
      if (this.data1.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    currentchange(val) {
      this.current = val;
      const data = {
        pageNo: this.current,
        pageSize: this.PageSize,
      };
      apiGetUser(data)
        .then((res) => {
          console.log(res);
          this.data1 = res.data[0];
          this.total = parseInt(res.data[1].slice(3)) * this.PageSize;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    select(name) {
      if (name === "1") {
        this.$router.push({
          name: "MyAdmin",
        });
      }
      if (name === "2") {
        this.$router.push({
          name: "RecoursePage",
        });
      }
    },
    LOGOUT() {
      this.$store.commit("LOGOUT");
      this.$Message.success("注销成功！");
    },
    search(val) {
      const data = {
        name: val,
      };
      apiSearchUser(data)
        .then((res) => {
          if (res.data == "") {
            this.show = false;
          } else {
            this.show = true;
            this.data2 = res.data;
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
  },
};
</script>

<style>
</style>