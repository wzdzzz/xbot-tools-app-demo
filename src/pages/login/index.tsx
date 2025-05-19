import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  QRCode,
  Spin,
  message,
} from 'antd';
import { QrcodeOutlined, LoginOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth-context';
import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const [qrLogin, setQrLogin] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const navigate = useNavigate()
  const { login } = useAuth();

  useEffect(() => {
    const win = getCurrentWebviewWindow();
    void win.setSize(new LogicalSize(400, 500));
  }, []);

  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    if (values.username === 'aaa' && values.password === '123') {
      message.success('登录成功');
      navigate('/', { replace: true })
      login('token')
      const win = getCurrentWebviewWindow();

      await win.setSize(new LogicalSize(1000, 700));
      await win.setMinSize(new LogicalSize(800, 600));
    } else {
      message.error('用户名或密码错误');
    }
  };

  useEffect(() => {
    if (qrLogin) {
      setScanned(false);
      const interval = window.setInterval(() => {
        console.log('轮询中...');
        const isAuthed = Math.random() > 0.05;
        if (isAuthed) {
          clearInterval(interval);
          setScanned(true);
          void message.success('扫码登录成功');
        }
      }, 1500);

      setPollingInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (pollingInterval) clearInterval(pollingInterval);
    }
  }, [qrLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {qrLogin ? '扫码登录' : '账号密码登录'}
          </h2>
          <Button
            type="link"
            icon={qrLogin ? <LoginOutlined /> : <QrcodeOutlined />}
            onClick={() => setQrLogin(!qrLogin)}
          >
            {qrLogin ? '账号登录' : '扫码登录'}
          </Button>
        </div>

        {qrLogin ? (
          <div className="flex flex-col items-center">
            <QRCode value="模拟二维码内容" size={200} />
            <div className="mt-4">
              {scanned ? (
                <span className="text-green-600 font-medium">扫码成功，正在跳转...</span>
              ) : (
                <Spin tip="等待扫码授权..." />
              )}
            </div>
          </div>
        ) : (
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                block
                onClick={() => navigate('/register')}
              >
                没有账号？注册一个
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
