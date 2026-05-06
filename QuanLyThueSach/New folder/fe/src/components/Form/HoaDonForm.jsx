
const HoaDonForm = ({ data }) => {
    return (
        <div id="print-area">
            <h2>HOÁ ĐƠN</h2>
            <p>Mã: {data.maThanhToan}</p>
            <p>Khách: {data.tenBanDoc}</p>
            <p>SĐT: {data.soDienThoai}</p>
            <p>Ngày: {data.ngayThanhToan}</p>
            <p>Tổng tiền: {data.soTien} VND</p>
            <p>Hình thức: {data.hinhThucThanhToan}</p>
        </div>
    );
};