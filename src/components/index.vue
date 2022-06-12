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
              <Icon type="ios-paper" />
              首页
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-people" />
              资源文章
            </MenuItem>
            <Submenu name="3">
              <template slot="title">
                <Icon type="md-contact" />
                用户
              </template>
              <MenuItem name="3-1" to="/logining">登录</MenuItem>
              <MenuItem name="3-2" to="/registered">注册</MenuItem>
            </Submenu>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 50px' }">
        <Breadcrumb :style="{ margin: '20px 0' }">
          <BreadcrumbItem>Home</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div style="min-height: 200px">
            <Carousel autoplay v-model="value2" loop>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/2.jpg" alt="" height="500px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/3.jpg" alt="" height="500px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/4.jpg" alt="" height="500px" width="100%" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="@/css/1.jpg" height="500px" width="100%" />
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
                  :rows="10"
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
                <Page
                  :total="total2"
                  :current="current2"
                  :page-size="PageSize2"
                  @on-change="currentchange2"
                />
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
import axios from "axios";
export default {
  name: "IndexMain",
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
      total2: 1,
      current2: 1,
      PageSize2: 5,
    };
  },
  methods: {
    getdata() {
      axios({
        method: "post",
        url: `/api/hallComment/queryAllHallComment?pageNo=${this.current1}&pageSize=${this.PageSize1}`,
      })
        .then((res) => {
          console.log(res);
          this.data1 = res.data[0];
          this.total1 = parseInt(res.data[2].slice(4)) * this.PageSize1;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    select(name) {
      if (name == "2") {
        if (this.$store.state.token == null) {
          alert("请先登录！！");
          this.$router.push({
            name: "LoginDoing",
          });
        }
      }
    },
    currentchange2(val) {
      this.current2 = val;
    },
    currentchange1(val) {
      this.current1 = val;
      this.getdata();
    },
    sent() {
      if (this.$store.state.token == null) {
        alert("请先登录！！");
        this.$router.push({
          name: "LoginDoing",
        });
      }
    },
  },
  mounted() {
    this.getdata();
    axios({
      method: "get",
      url: `/api/notice/queryNotice`,
    })
      .then((res) => {
        console.log("1111", res);
        this.data2 = res.data;
        this.total2 = res.data[0].length;
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
.ivu-card-body {
  padding: 16px;
  background-color: #dcdee2;
}
</style>