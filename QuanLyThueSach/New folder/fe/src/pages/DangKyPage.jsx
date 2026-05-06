import React, { useEffect, useState, useRef } from "react";
import { getTaiKhoans } from "../services/TaiKhoanService";
import DangKyForm from "../components/DangKy";

function DangKyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #f0f0f0',
      width: '600px',
      height: '300px',
      borderRadius: '8px',
      margin: 'auto',
      position: 'relative',
      top: '50%',
      transform: 'translateY(100%)',
      }}>
      <DangKyForm />
    </div>
  );
}
export default DangKyPage;