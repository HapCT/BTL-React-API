import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Input, Select, Space, message } from "antd";
import { getDatChos, huyDatCho, tuDongMuon } from "../services/DatChoService";
import { getSachs } from "../services/SachService";
import { getBanDocs } from "../services/BanDocService";

const { Option } = Select;

function DatChoPage() {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [sachList, setSachList] = useState([]);
  const [banDocList, setBanDocList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 🔥 load data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sachRes, bdRes, dcRes] = await Promise.all([
        getSachs(),
        getBanDocs(),
        getDatChos()
      ]);

      const sachData = sachRes.data?.data || sachRes.data || [];
      const bdData = bdRes.data?.data || bdRes.data || [];
      const dcData = dcRes.data?.data || dcRes.data || [];

      setSachList(sachData);
      setBanDocList(bdData);
      setRawData(dcData);

      mapData(dcData, sachData, bdData);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const mapData = (dcData, sachData, bdData) => {
    const sachMap = Object.fromEntries(sachData.map(s => [s.maSach, s]));
    const bdMap = Object.fromEntries(bdData.map(b => [b.maBanDoc, b]));

    const mapped = dcData.map(item => ({
      ...item,
      tenSach: sachMap[item.maSach]?.tieuDe || "Không rõ",
      tenBanDoc: bdMap[item.maBanDoc]?.hoTen || "Không rõ"
    }));

    setData(mapped);
  };


  useEffect(() => {
    let filtered = [...rawData];

    // map lại trước khi filter
    const sachMap = Object.fromEntries(sachList.map(s => [s.maSach, s]));
    const bdMap = Object.fromEntries(banDocList.map(b => [b.maBanDoc, b]));

    filtered = filtered.map(item => ({
      ...item,
      tenSach: sachMap[item.maSach]?.tieuDe || "",
      tenBanDoc: bdMap[item.maBanDoc]?.hoTen || ""
    }));

    if (searchText) {
      filtered = filtered.filter(item =>
        item.tenSach.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tenBanDoc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.trangThai === filterStatus);
    }

    setData(filtered);

  }, [searchText, filterStatus, rawData, sachList, banDocList]);


  const handleHuy = async (id) => {
    await huyDatCho(id);
    message.success("Đã hủy");
    fetchAll();
  };


  const handleDuyet = async (maSach) => {
    await tuDongMuon(maSach);
    message.success("Đã duyệt");
    fetchAll();
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "maDatCho"
    },
    {
      title: "Sách",
      dataIndex: "tenSach"
    },
    {
      title: "Bạn đọc",
      dataIndex: "tenBanDoc"
    },
    {
      title: "Thứ tự",
      dataIndex: "thuTu",
      render: (val) =>
        val === 1 ? <Tag color="green">Ưu tiên</Tag> : val
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text) => {
        let color = "blue";
        if (text === "Đang chờ") color = "orange";
        if (text === "Đã xử lý") color = "green";
        if (text === "Huỷ") color = "red";

        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.trangThai === "Đang chờ" && (
          <Space>
            <Button
              type="primary"
              disabled={record.thuTu !== 1}
              onClick={() => handleDuyet(record.maSach)}
            >
              Duyệt
            </Button>

            <Button danger onClick={() => handleHuy(record.maDatCho)}>
              Hủy
            </Button>
          </Space>
        )
    }
  ];

  return (
    <div>
      <h2>Quản lý đặt chỗ</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm sách / bạn đọc"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select
          placeholder="Lọc trạng thái"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="Đang chờ">Đang chờ</Option>
          <Option value="Đã xử lý">Đã xử lý</Option>
          <Option value="Huỷ">Huỷ</Option>
        </Select>
      </Space>

      <Table
        rowKey="maDatCho"
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
}

export default DatChoPage;