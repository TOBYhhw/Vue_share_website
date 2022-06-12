<template>
  <Layout>
    <Content :style="{ padding: '0 50px' }">
      <Breadcrumb :style="{ margin: '20px 0' }">
        <BreadcrumbItem>register</BreadcrumbItem>
        <Button to="/index" icon="ios-home">返回主页</Button>
      </Breadcrumb>
      <Card>
        <div style="min-height: 200px" class="register">
          <h3 class="title">请注册您的账户</h3>
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="user">
              <Input
                type="text"
                v-model="formInline.user"
                placeholder="请输入用户名"
              >
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="formInline.password"
                placeholder="请输入密码"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')"
                >注册</Button
              >
            </FormItem>
            <Button type="success" @click="gotologin">已有账号?点击登录</Button>
          </Form>
        </div>
      </Card>
    </Content>
    <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
  </Layout>
</template>

<script>
import axios from "axios";
export default {
  name: "RegisteredDoing",
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password: [
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
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios
            .post(
              `/api/user/register?password=${this.formInline.password}&username=${this.formInline.user}`
            )
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                this.$Message.success("注册成功!");
                this.$router.push({
                  name: "LoginDoing",
                });
              } else {
                this.$message.error("用户名已存在！");
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
    gotologin() {
      this.$router.push({
        name: "LoginDoing",
      });
    },
  },
};
</script>

<style scoped>
.title {
  width: 50%;
  margin: 0 auto;
}
.ivu-btn-primary {
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
  width: 100%;
}
.ivu-btn-success {
  color: #fff;
  background-color: #19be6b;
  border-color: #19be6b;
  width: 100%;
}
.register {
  width: 22%;
  margin: 0 auto;
}
</style>