import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useHttp } from "../../hooks/useHttp";
const { Title } = Typography;

const LoginForm = () => {
  const { setHash } = useAuth();
  const { request } = useHttp();
  const onFinish = async (values) => {
    try {
      console.log("Received values of form: ", values);
      const { data } = await request.post("/login", {
        username: values.username,
        password: values.password,
      });
      if (data.hash) {
        message.success("Login Successfully");
        setHash(data.hash);
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error("Invalid Credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 400, padding: "10px 20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={2}>exProxy</Title>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{}}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              style={{ height: 40 }}
              prefix={<UserOutlined className="site-form-   item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              style={{ height: 40 }}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ height: 40 }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
