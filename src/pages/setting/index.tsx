
import React, { useEffect, useState } from 'react';
import { Switch, Card, message } from 'antd';
import { isEnabled, enable, disable } from '@tauri-apps/plugin-autostart';

const SettingPage: React.FC = () => {
  const [autoStart, setAutoStart] = useState<boolean>(false);

  useEffect(() => {
    // 检查开机自启动状态
    const checkAutoStart = async () => {
      const enabled = await isEnabled();
      setAutoStart(enabled);
    };
    void checkAutoStart();
  }, []);

  const handleAutoStartChange = async (checked: boolean) => {
    try {
      if (checked) {
        await enable();
        message.success('开机自启动已启用');
      } else {
        await disable();
        message.success('开机自启动已禁用');
      }
      setAutoStart(checked);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="设置" className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <span>开机自启动</span>
          <Switch checked={autoStart} onChange={handleAutoStartChange} />
        </div>
      </Card>
    </div>
  );
};

export default SettingPage;

