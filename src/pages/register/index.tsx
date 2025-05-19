import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Progress, Modal, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import type { RuleObject } from 'antd/es/form';
import { useNavigate } from "react-router-dom";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
  phone?: string;
  agree: boolean;
}

const passwordStrength = (pwd: string) => {
  let score = 0;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[a-z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd))    score += 1;
  if (/[\W_]/.test(pwd)) score += 1;
  if (pwd.length >= 12)  score += 1;
  return (score / 5) * 100;
};

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<RegisterFormValues>();
  const [pwdStrength, setPwdStrength] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const checkUsername = async (_: RuleObject, value: string) => {
    if (!value) return Promise.reject('请输入用户名');
    // 模拟异步检测
    await new Promise((r) => setTimeout(r, 500));
    if (['admin','user'].includes(value)) {
      return Promise.reject('用户名已被占用');
    }
    return Promise.resolve();
  };

  const onFieldsChange = () => {
    const pwd = form.getFieldValue('password') || '';
    setPwdStrength(passwordStrength(pwd));
  };

  const onFinish = async (values: RegisterFormValues) => {
    // 模拟注册 API 调用
    try {
      setLoading(true)
      console.log(values)
      await new Promise((r) => setTimeout(r, 1000));
      message.success('注册成功，跳转到登录…');
      navigate('/login')
    } catch {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">注册新账号</h2>
        <Form
          form={form}
          layout="vertical"
          onFieldsChange={onFieldsChange}
          onFinish={onFinish}
          initialValues={{ agree: false }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ validator: checkUsername }]}
          >
            <Input placeholder="2–20 位字母数字或下划线" allowClear />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
              {
                validator: async (_, value) => {
                  await new Promise((r) => setTimeout(r, 500));
                  if (value === 'test@example.com') {
                    return Promise.reject('邮箱已注册');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="example@domain.com" allowClear />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '至少 8 位字符' },
              {
                validator: (_, value) =>
                  value && passwordStrength(value) < 40
                    ? Promise.reject('密码强度太低')
                    : Promise.resolve(),
              },
            ]}
          >
            <Input.Password
              placeholder="至少 8 位，含大写/小写/数字/特殊字符"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {pwdStrength > 0 && (
            <Progress
              percent={Math.round(pwdStrength)}
              size="small"
              showInfo={false}
              className="mb-4"
            />
          )}

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致');
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认密码" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号（选填）"
            rules={[
              {
                pattern: /^\+?\d{7,15}$/,
                message: '请输入有效的国际手机号',
              },
            ]}
          >
            <Input placeholder="+8613712345678" allowClear />
          </Form.Item>

          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject('需要同意协议后才能注册'),
              },
            ]}
          >
            <Checkbox>
              阅读并同意{' '}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setModalVisible(true)}
              >
                用户协议<InfoCircleOutlined />
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="用户协议"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <p>这里是用户协议的详细内容……</p>
        </Modal>
      </div>
    </div>
  );
};

export default RegisterPage;
