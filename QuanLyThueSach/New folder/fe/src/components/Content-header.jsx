import React from "react";
import "../assets/css/Content-header.css";
import "../assets/css/All.css";
const ContentHeader = () => {
    return (
        <div className="content-header">
            <div className="container-con">
                <div className="con-left">
                    <div>
                        <h4>Đọc mọi cuốn sách bạn yêu thích.</h4>
                    </div>
                    <div style = {{color: "#ff6b35"}}>
                        <h4>Chỉ từ 1.500đ/ngày</h4>
                    </div>
                    <div className = "con-left-text">
                        <b>Netflix cho sách giấy tại Việt Nam. </b>
                        <p style={{opacity: "0.8"}}>Chọn sách online. Không đặt cọc, nhận nơi tại nơi thuê, miễn phí 2 chiều.</p>
                    </div>
                    <div className="con-bot">
                        <p><span style={{color: "green"}}>✓</span> Hơn 150.000 đầu sách</p>
                    </div>
                </div>
                <div className="con-right">
                    <div className="img">
                        <img src="https://openboox.vn/themes/openboox/img/figure/hero_book.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ContentHeader;