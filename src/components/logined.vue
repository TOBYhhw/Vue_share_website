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
          <div style="min-height: 200px" class="bgc">
            <Carousel autoplay v-model="value2" loop>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/2.jpg" alt="" height="400px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/3.jpg" alt="" height="400px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/4.jpg" alt="" height="400px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/1.jpg" height="400px" width="100%" />
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </Card>
        <div style="background: #eee; padding: 20px">
          <Row>
            <Col span="7">
              <Card>
                <p slot="title">评论一下叭</p>
                <Input
                  v-model="value"
                  type="textarea"
                  :rows="12"
                  placeholder="有什么想说的捏..."
                />
                <Button @click="sent">发表留言</Button>
              </Card>
            </Col>
            <Col span="7" offset="1">
              <Card dis-hover>
                <p slot="title">留言板</p>
                <Table :columns="columns1" :data="data1"></Table>
                <Page
                  :total="total1"
                  :current="current1"
                  :page-size="PageSize1"
                  @on-change="currentchange1"
                />
              </Card>
            </Col>
            <Col span="8" offset="1">
              <Card dis-hover>
                <p slot="title">公告</p>
                <Table :columns="columns2" :data="data2"></Table>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import { apiGetComment, apiAddComment } from "@/request/api/hall";
import { apiGetNotice } from "@/request/api/notice";
export default {
  name: "LoginDone",
  data() {
    return {
      value2: 0,
      value: "",
      columns1: [
        { title: "时间", key: "time" },
        {
          title: "留言",
          key: "content",
        },
      ],
      columns2: [{ title: "内容", key: "content" }],
      data1: [],
      data2: [],
      total1: 1,
      current1: 1,
      PageSize1: 5,
    };
  },
  methods: {
    getdata() {
      const data = {
        pageNo: this.current1,
        pageSize: this.PageSize1,
      };
      apiGetComment(data)
        .then((res) => {
          this.data1 = res.data[0];
          this.total1 = parseInt(res.data[2].slice(4)) * this.PageSize1;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    currentchange1(val) {
      this.current1 = val;
      this.getdata();
    },
    select(name) {
      console.log(name);
      if (name === "1-2") {
        this.$router.push({
          name: "RecourseIndex",
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
    sent() {
      if (this.value == "") {
        this.$Message.error("请输入内容！！");
      } else {
        const data = { content: this.value };
        apiAddComment(data)
          .then((res) => {
            if (res.data === "insertSuccessfully!") {
              this.$Message.success("发布成功！！！");
              this.value = "";
              this.getdata();
            }
          })
          .catch((error) => {
            console.log(error, "请求失败");
          });
      }
    },
  },
  mounted() {
    this.getdata();
    apiGetNotice()
      .then((res) => {
        this.data2 = res.data;
      })
      .catch((res) => {
        console.log(res);
      });
  },
};
</script>

<style>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
</style>