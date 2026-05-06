import React from "react";
import { Form, Select, DatePicker } from "antd";
import dayjs from "dayjs";

/**
 * PhieuMuonOffForm — FIX mượn tại quầy:
 * - Thêm ngayTao (bắt buộc, mặc định hôm nay) để khớp với TaoPhieuMuonOfflineRequest.NgayTao
 * - ngayMuon mặc định hôm nay
 * - Lọc bản sao chỉ hiện trạng thái "Có sẵn" / "Sẵn sàng"
 * - Thêm tìm kiếm nhanh cho cả 2 dropdown
 */
const PhieuMuonOffForm = ({ form, banDocList, banSaoList }) => {
  // Chỉ hiển thị bản sao còn sẵn (tránh chọn bản đang được mượn)
  // ✅ MỚI - đúng với DB
  const banSaoCoSan = banSaoList?.filter((bs) => {
    const tt = (bs.trangThai || "").toLowerCase();
    return tt === "trong kho";
  });

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="maBanDoc"
        label="Bạn đọc"
        rules={[{ required: true, message: "Vui lòng chọn bạn đọc" }]}
      >
        <Select
          showSearch
          placeholder="Tìm tên hoặc mã bạn đọc..."
          filterOption={(input, opt) =>
            opt?.label?.toLowerCase().includes(input.toLowerCase())
          }
          options={banDocList?.map((bd) => ({
            value: bd.maBanDoc,
            label: `${bd.hoTen} (${bd.maBanDoc})`,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="maBanSao"
        label="Bản sao sách"
        rules={[{ required: true, message: "Vui lòng chọn bản sao" }]}
        extra={
          banSaoCoSan?.length === 0
            ? "Không có bản sao nào đang sẵn sàng"
            : `${banSaoCoSan?.length ?? 0} bản sao sẵn sàng`
        }
      >
        <Select
          showSearch
          placeholder="Tìm tên sách hoặc mã bản sao..."
          filterOption={(input, opt) =>
            opt?.label?.toLowerCase().includes(input.toLowerCase())
          }
          options={banSaoCoSan?.map((bs) => ({
            value: bs.maBanSao,
            label: `${bs.tieuDe || bs.maSach} — ${bs.maBanSao}`,
          }))}
        />
      </Form.Item>

      {/* NgayTao: ẩn với người dùng, tự động = hôm nay, nhưng vẫn submit */}
      <Form.Item
        name="ngayTao"
        initialValue={dayjs()}
        hidden
      >
        <DatePicker />
      </Form.Item>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Form.Item
          name="ngayMuon"
          label="Ngày mượn"
          initialValue={dayjs()}
          rules={[{ required: true, message: "Chọn ngày mượn" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="hanTra"
          label="Hạn trả"
          rules={[
            { required: true, message: "Chọn hạn trả" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue("ngayMuon")) return Promise.resolve();
                if (value.isAfter(getFieldValue("ngayMuon"))) {
                  return Promise.resolve();
                }
                return Promise.reject("Hạn trả phải sau ngày mượn");
              },
            }),
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
      </div>
    </Form>
  );
};

export default PhieuMuonOffForm;
