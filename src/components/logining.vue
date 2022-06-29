<template>
  <Layout>
    <Content :style="{ padding: '0 50px' }">
      <Breadcrumb :style="{ margin: '20px 0' }">
        <BreadcrumbItem>Login</BreadcrumbItem>
        <Button to="/index" icon="ios-home">返回主页</Button>
      </Breadcrumb>
      <Card>
        <div style="min-height: 200px" class="bgc">
          <div class="login">
            <Tabs>
              <TabPane icon="md-contacts" label="用户登录" name="name1"
                ><Form
                  ref="formInline1"
                  :model="formInline1"
                  :rules="ruleInline1"
                >
                  <FormItem prop="user1">
                    <Input
                      type="text"
                      v-model="formInline1.user1"
                      placeholder="Username"
                    >
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                  <FormItem prop="password1">
                    <Input
                      type="password"
                      v-model="formInline1.password1"
                      placeholder="Password"
                    >
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                  <FormItem>
                    <Button
                      type="primary"
                      class="btn1"
                      @click="handleSubmit1('formInline1')"
                      >登录</Button
                    >
                  </FormItem>
                  <Button type="success" class="btn2" @click="gotoregister"
                    >未有账号?点击注册</Button
                  >
                </Form></TabPane
              >
              <TabPane icon="md-contact" label="管理员登录" name="name2">
                <Form
                  ref="formInline2"
                  :model="formInline2"
                  :rules="ruleInline2"
                >
                  <FormItem prop="user2">
                    <Input
                      type="text"
                      v-model="formInline2.user2"
                      placeholder="Username"
                    >
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                  <FormItem prop="password2">
                    <Input
                      type="password"
                      v-model="formInline2.password2"
                      placeholder="Password"
                    >
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="handleSubmit2('formInline2')"
                      >登录</Button
                    >
                  </FormItem>
                  <Button type="success" @click="gotoregister"
                    >未有账号?点击注册</Button
                  >
                </Form></TabPane
              >
            </Tabs>
          </div>
        </div>
      </Card>
    </Content>
    <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
  </Layout>
</template>

<script>
import { apiLogin } from "@/request/api/user";
export default {
  name: "LoginDoing",
  data() {
    return {
      formInline1: {
        user1: "",
        password1: "",
      },
      formInline2: {
        user2: "",
        password2: "",
      },
      ruleInline1: {
        user1: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password1: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur",
          },
        ],
      },
      ruleInline2: {
        user2: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password2: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 5,
            message: "The password length cannot be less than 5 bits",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit1(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const data = {
            password: this.formInline1.password1,
            username: this.formInline1.user1,
          };
          apiLogin(data)
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                this.$store.commit("SET_TOKEN", res.data.data.token);
                this.$store.commit("GET_USER", this.formInline1.user1);
                this.$Message.success("登陆成功!");
                this.$router.push({
                  name: "LoginDone",
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleSubmit2(name) {
      this.$refs[name].validate((valid) => {
        console.log(2);
        if (valid) {
          const data = {
            password: this.formInline2.password2,
            username: this.formInline2.user2,
          };
          apiLogin(data)
            .then((res) => {
              console.log(res);
              if (
                this.formInline2.user2 == "admin" &&
                this.formInline2.password2 == "admin"
              ) {
                if (res.status === 200) {
                  this.$store.commit("SET_TOKEN", res.data.data.token);
                  this.$store.commit("GET_USER", this.formInline2.user2);
                  this.$Message.success("登录成功!");
                  this.$router.replace({
                    name: "MyAdmin",
                  });
                }
              } else {
                alert("你没有权限访问！");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    gotoregister() {
      this.$router.push({
        name: "RegisteredDoing",
      });
    },
  },
};
</script>

<style scoped>
.login {
  width: 22%;
  margin: 0 auto;
}
.ivu-btn-primary {
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
  width: 100%;
}

.ivu-card-body {
  padding: 16px;
  background-color: #dcdee2;
}
.layout-footer-center {
  text-align: center;
}
.ivu-btn-success {
  color: #fff;
  background-color: #19be6b;
  border-color: #19be6b;
  width: 100%;
}
</style>