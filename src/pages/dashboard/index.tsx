import { useAuth } from "@/contexts/auth-context.tsx";
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";

const Dashboard: React.FC = ({ children }: {children: React.ReactNode}) => {
  const {logout} = useAuth()

  useEffect(() => {
    const window = getCurrentWebviewWindow()
     window.setSize(new LogicalSize(1000, 700));       // :contentReference[oaicite:4]{index=4}
     window.setMinSize(new LogicalSize(800, 600));
  }, [])
  const navigate = useNavigate()

  const handleLayout = async (path?: string) => {
    if (path) {
      navigate(path, { replace: true });
    } else {
      navigate('/login', { replace: true });
      logout();
    }
  }

  return (<div>
    dashboard
    <Button type="primary" onClick={() => handleLayout('/setting')}>设置</Button>
  </div>)
}

export default Dashboard