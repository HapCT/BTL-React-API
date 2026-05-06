export const printHoaDon = (data) => {
  const win = window.open("", "", "width=480,height=700");

  const ngayIn = new Date().toLocaleString("vi-VN");
  const ngayTT = data.ngayThanhToan
    ? new Date(data.ngayThanhToan).toLocaleString("vi-VN")
    : "—";
  const soTien = Number(data.soTien || 0).toLocaleString("vi-VN");
  const trangThai = data.trangThai || "Đã thanh toán";
  const hinhThuc = data.hinhThucThanhToan || "—";
  const ghiChu = data.ghiChu || "Không có";
  const maBanDoc = data.maBanDoc || "—";

  win.document.write(`
    <html>
      <head>
        <title>Hóa đơn ${data.maThanhToan}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Courier New', monospace;
            width: 360px;
            margin: 0 auto;
            padding: 16px;
            font-size: 13px;
            color: #111;
          }

          .header {
            text-align: center;
            margin-bottom: 8px;
          }

          .header h2 {
            font-size: 18px;
            letter-spacing: 2px;
            margin-bottom: 2px;
          }

          .header .subtitle {
            font-size: 11px;
            color: #555;
          }

          .title-hd {
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 3px;
            margin: 10px 0 4px;
          }

          .ma-hd {
            text-align: center;
            font-size: 11px;
            color: #444;
            margin-bottom: 4px;
          }

          .line-dash {
            border: none;
            border-top: 1px dashed #888;
            margin: 8px 0;
          }

          .line-solid {
            border: none;
            border-top: 2px solid #111;
            margin: 8px 0;
          }

          .section-title {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #555;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            line-height: 1.5;
          }

          .row .label {
            color: #555;
            flex-shrink: 0;
            margin-right: 8px;
          }

          .row .value {
            text-align: right;
            font-weight: 500;
            word-break: break-word;
          }

          .badge {
            display: inline-block;
            padding: 1px 8px;
            border: 1px solid #111;
            border-radius: 3px;
            font-size: 11px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
            margin: 6px 0;
          }

          .total-row .amount {
            font-size: 17px;
          }

          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 11px;
            color: #555;
            line-height: 1.8;
          }

          .print-note {
            text-align: center;
            font-size: 10px;
            color: #aaa;
            margin-top: 6px;
          }

          @media print {
            body { width: 100%; }
            .print-note { display: none; }
          }
        </style>
      </head>
      <body>

        <div class="header">
          <h2> Nhà sách Huy Anh</h2>
          <div class="subtitle">ĐC: 123 Đường X, Hưng Yên</div>
          <div class="subtitle">ĐT: 0909 123 456</div>
        </div>

        <hr class="line-solid">

        <div class="title-hd">HÓA ĐƠN THANH TOÁN</div>
        <div class="ma-hd">Số HĐ: ${data.maThanhToan}</div>

        <hr class="line-dash">

        <div class="section-title">Thông tin khách hàng</div>

        <div class="row">
          <span class="label">Mã bạn đọc:</span>
          <span class="value">${maBanDoc}</span>
        </div>
        <div class="row">
          <span class="label">Họ tên:</span>
          <span class="value">${data.tenBanDoc || "—"}</span>
        </div>
        <div class="row">
          <span class="label">Số điện thoại:</span>
          <span class="value">${data.soDienThoai || "—"}</span>
        </div>

        <hr class="line-dash">

        <div class="section-title">Thông tin thanh toán</div>

        <div class="row">
          <span class="label">Ngày thanh toán:</span>
          <span class="value">${ngayTT}</span>
        </div>
        <div class="row">
          <span class="label">Hình thức TT:</span>
          <span class="value">${hinhThuc}</span>
        </div>
        <div class="row">
          <span class="label">Trạng thái:</span>
          <span class="value"><span class="badge">${trangThai}</span></span>
        </div>
        <div class="row">
          <span class="label">Ghi chú:</span>
          <span class="value">${ghiChu}</span>
        </div>

        <hr class="line-dash">

        <div class="section-title">Chi tiết tiền</div>

        <div class="row">
          <span class="label">Phí thuê sách + tiền phạt:</span>
          <span class="value">${soTien} đ</span>
        </div>

        <hr class="line-solid">

        <div class="total-row">
          <span>TỔNG CỘNG</span>
          <span class="amount">${soTien} VND</span>
        </div>

        <hr class="line-solid">

        <div class="footer">
          <div>Ngày in: ${ngayIn}</div>
          <div style="margin-top:8px;">⭐ Cảm ơn quý khách đã sử dụng dịch vụ! ⭐</div>
          <div>Hẹn gặp lại lần sau 📖</div>
        </div>

        <div class="print-note">--- Phiếu này có giá trị làm biên lai ---</div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `);

  win.document.close();
};