import React, { useState } from "react";
import { Modal, Input, Select, Button, message } from "antd";
import { createPhat } from "../../services/PhatService";

const { Option } = Select;

function PhatForm({ open, onClose, onSuccess }) {
  const [maPhieuMuon, setMaPhieuMuon] = useState("");
  const [lyDo, setLyDo] = useState("");

  const handleSubmit = async () => {
    if (!maPhieuMuon || !lyDo) {
      message.error("Nhập đầy đủ thông tin");
      return;
    }

    try {
      await createPhat({
        maPhieuMuon,
        lyDoPhat: lyDo,
      });

      message.success("Thêm phạt thành công");
      onSuccess();
      onClose();
    } catch {
      message.error("Lỗi thêm phạt");
    }
  };

  return (
    <Modal open={open} title="Thêm phạt" onCancel={onClose} footer={null}>
      <p>Mã phiếu mượn</p>
      <Input onChange={(e) => setMaPhieuMuon(e.target.value)} />

      <p style={{ marginTop: 10 }}>Lý do</p>
      <Select style={{ width: "100%" }} onChange={setLyDo}>
        <Option value="hỏng">Hỏng sách</Option>
        <Option value="mất">Mất sách</Option>
      </Select>

      <Button
        type="primary"
        block
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Xác nhận
      </Button>
    </Modal>
  );
}

export default PhatForm;