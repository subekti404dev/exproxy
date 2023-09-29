import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useConfig } from "../../hooks/useConfig";
import { useHttp } from "../../hooks/useHttp";
import { useState } from "react";
import { validateUrl } from "../../utils/validator";

export const MaskingPage = () => {
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState();
  const { config, getConfig } = useConfig();
  const { request } = useHttp();
  const [formEdit] = Form.useForm();
  const [formNew] = Form.useForm();

  const domains = config.domains || [];

  const confirmDelete = async (mask_id) => {
    try {
      await request.delete(`/masking/${mask_id}`);
      await getConfig();
      message.success("Domain deleted");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete domain"
      );
    }
  };

  const onUpdateDomain = async (domain) => {
    try {
      await request.put(`/masking/${domain.mask_id}`, domain);
      await getConfig();
      message.success("Domain updated");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update domain"
      );
    }
  };

  const onAddDomain = async (domain) => {
    try {
      await request.post(`/masking`, domain);
      await getConfig();
      message.success("Domain added");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add domain"
      );
    }
  };

  return (
    <Card style={{ margin: "10px 20px" }}>
      <Modal
        afterOpenChange={(open) => {
          if (open) {
            formEdit.setFieldsValue(selectedDomain);
          }
        }}
        title="Edit Domain"
        open={isShowEditModal}
        onOk={async () => {
          try {
            const { errorFields } = await formEdit.validateFields();
            if (!errorFields) {
              const value = formEdit.getFieldsValue();
              await onUpdateDomain(value);
              setIsShowEditModal(false);
              setSelectedDomain();
            }
          } catch (error) {}
        }}
        onCancel={() => {
          setIsShowEditModal(false);
          setSelectedDomain();
        }}
      >
        <Form initialValues={selectedDomain} form={formEdit}>
          <Form.Item name={"mask_id"} label="Mask ID">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name={"domain"}
            label="Domain"
            rules={[{ required: true }, { validator: validateUrl }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Space
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <Modal
          title="New Domain"
          open={isShowAddModal}
          onOk={async () => {
            try {
              const { errorFields } = await formNew.validateFields();
              if (!errorFields) {
                const value = formNew.getFieldValue();
                await onAddDomain(value);

                setIsShowAddModal(false);
                formNew.resetFields();
              }
            } catch (error) {}
          }}
          onCancel={() => {
            setIsShowAddModal(false);
            formNew.resetFields();
          }}
        >
          <Form form={formNew}>
            <Form.Item
              name={"mask_id"}
              label="Mask ID"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"domain"}
              label="Domain"
              rules={[{ required: true }, { validator: validateUrl }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Button onClick={() => setIsShowAddModal(true)}>Add New</Button>
      </Space>
      <Table
        dataSource={domains}
        columns={[
          {
            title: "Mask ID",
            dataIndex: "mask_id",
            key: "mask_id",
          },
          {
            title: "Domain",
            dataIndex: "domain",
            key: "domain",
          },
          {
            title: "Action",
            key: "action",
            render: (value, record) => {
              return (
                <Space>
                  <Button
                    onClick={() => {
                      setSelectedDomain(record);
                      setIsShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete the domain"
                    description="Are you sure to delete this domain?"
                    onConfirm={() => confirmDelete(record.mask_id)}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
};
