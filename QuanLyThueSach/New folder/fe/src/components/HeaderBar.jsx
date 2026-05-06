import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button,  Flex } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed, bg }) => {
  const [size] = useState("large"); 
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <Header style={{ background: bg }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      <Flex gap="small" align="flex-end" vertical style={{ marginTop: "-50px" }}>
        <Flex gap="small" wrap>
          <Button type="primary" size={size} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Flex>
      </Flex>
    </Header>
  );
};

export default HeaderBar;