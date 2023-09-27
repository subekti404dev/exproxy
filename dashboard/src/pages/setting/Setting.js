import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Switch,
  Typography,
  Form,
} from "antd";
import { useConfig } from "../../hooks/useConfig";
import { useEffect, useState } from "react";
import { validateHex } from "../../utils/validator";
const { Text } = Typography;

export const SettingPage = () => {
  const [form] = Form.useForm();
  const { config, updateConfig } = useConfig();
  const [errForm, setErrForm] = useState([]);

  useEffect(() => {
    console.log(config);
  }, [config]);

  const toggleEncrypt = async (value) => {
    await updateConfig({ enable_encrypt: value });
  };

  const togglePlayground = async (value) => {
    await updateConfig({ enable_playground: value });
  };
  const LeftCol = ({ children }) => (
    <Col xs={24} md={8} style={{ display: "flex", alignItems: "center" }}>
      {children}
    </Col>
  );

  const RightCol = ({ children }) => (
    <Col
      xs={24}
      md={16}
      style={{
        flex: 1,
      }}
    >
      {children}
    </Col>
  );

  const disabledUpdateKey = () => {
    return errForm.find((x) => x.name === "encrypt_key");
  };

  const validateFields = async () => {
    try {
      await form.validateFields();
      setErrForm([]);
    } catch (error) {
      const errors = (error?.errorFields || []).map((e) => ({
        name: e?.name?.[0],
        errors: e?.errors || [],
      }));
      setErrForm(errors);
    }
  };

  useEffect(() => {
    form.setFieldsValue(config);
  }, [form, config]);

  return (
    <Form form={form} initialValues={config} onChange={validateFields}>
      <Card style={{ margin: "10px 20px" }}>
        <Row>
          <LeftCol>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Enable Encrypt
            </Text>
          </LeftCol>
          <RightCol>
            <Switch
              defaultChecked={config?.enable_encrypt}
              onChange={toggleEncrypt}
            />
          </RightCol>
        </Row>
        <Divider />
        <Row>
          <LeftCol>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Encryption Key
            </Text>
          </LeftCol>
          <Col
            xs={24}
            md={16}
            style={{
              flex: 1,
            }}
          >
            <Row>
              <Col xs={20}>
                <Form.Item
                  name={"encrypt_key"}
                  rules={[
                    { required: true },
                    { len: 64 },
                    { validator: validateHex },
                  ]}
                >
                  <Input
                    name={"encrypt_key"}
                    style={{ textAlign: "right", height: 40 }}
                  />
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item>
                  <Button
                    disabled={disabledUpdateKey()}
                    onClick={() =>
                      updateConfig({
                        encrypt_key: form.getFieldValue("encrypt_key"),
                      })
                    }
                    style={{ height: 40, marginLeft: 6 }}
                  >
                    Update
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <LeftCol>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Static Token</Text>
          </LeftCol>
          <Col
            xs={24}
            md={16}
            style={{
              flex: 1,
            }}
          >
            <Row>
              <Col xs={20}>
                <Form.Item name={"static_token"}>
                  <Input style={{ textAlign: "right", height: 40 }} />
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item>
                  <Button
                    onClick={() =>
                      updateConfig({
                        static_token: form.getFieldValue("static_token"),
                      })
                    }
                    style={{ height: 40, marginLeft: 6 }}
                  >
                    Update
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <LeftCol>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Enable Playground
            </Text>
          </LeftCol>
          <RightCol>
            <Switch
              defaultChecked={config?.enable_playground}
              onChange={togglePlayground}
            />
          </RightCol>
        </Row>
      </Card>
    </Form>
  );
};
