import React, { useEffect, useState } from "react";
import { Input, Select, Button, message } from "antd";
import { getPhats, searchPhat, huyPhat } from "../services/PhatService";
import PhatTable from "../components/Tables/PhatTable";
import PhatForm from "../components/Form/PhatForm";

const { Option } = Select;

function PhatPage() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    const res = await getPhats();
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    const res = await searchPhat(keyword, trangThai);
    setData(res.data.data);
  };

  const handleHuy = async (maPhat) => {
    await huyPhat(maPhat);
    message.success("Đã huỷ phạt");
    fetchData();
  };

  return (
    <div>
      <h2>Quản lý phạt</h2>

      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm phạt
      </Button>

      <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
        <Input
          placeholder="Tìm kiếm..."
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Select
          placeholder="Trạng thái"
          style={{ width: 200 }}
          onChange={(value) => setTrangThai(value)}
          allowClear
        >
          <Option value="Chưa thanh toán">Chưa thanh toán</Option>
          <Option value="Đã thanh toán">Đã thanh toán</Option>
          <Option value="Đã huỷ">Đã huỷ</Option>
        </Select>

        <Button type="primary" onClick={handleSearch}>
          Tìm
        </Button>

        <Button onClick={fetchData}>Reset</Button>
      </div>

      <PhatTable data={data} onHuy={handleHuy} />

      <PhatForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default PhatPage;