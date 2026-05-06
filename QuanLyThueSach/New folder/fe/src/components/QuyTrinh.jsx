import React from "react";
import "../assets/css/All.css"
import "../assets/css/QuyTrinh.css"
import { FormOutlined, BookOutlined, CarOutlined } from "@ant-design/icons";
const QuyTrinh = () => {
    return(
        <div className="quytrinh">
            <div className="step">
                <h2>Quy Trình Siêu Đơn Giản</h2>
                <p>Đọc sách nhàn tênh, đưa tri thức tới mọi nơi.</p>

                <div className="step-list">
                    <div className="set">
                        <div className="icon"><FormOutlined /></div>
                        <div className="number">01</div>

                        <h3>Đăng ký</h3>
                        <p>Đăng ký tài khoản và xem sách muốn mượn.</p>
                    </div>

                    <div className="set">
                        <div className="icon"><BookOutlined /></div>
                        <div className="number">02</div>

                        <h3>Chọn sách</h3>
                        <p>Lựa chọn sách bạn muốn đọc từ thư viện đa dạng.</p>
                    </div>

                    <div className="set">
                        <div className="icon"><CarOutlined /></div>
                        <div className="number">03</div>

                        <h3>Đến nhận & Đọc</h3>
                        <p>Nhận sách tận nơi và bắt đầu hành trình tri thức.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuyTrinh;