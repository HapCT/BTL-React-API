import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import banner1 from "../../assets/images/banner_1.png";
import banner2 from "../../assets/images/banner_2.png";
import banner3 from "../../assets/images/banner_3.png";
import "./BannerSlider.css";

const slides = [
    {
        id: 1,
        image: banner1,
        tag: "Xu hướng đọc sách 2025",
        title: "Đọc mọi cuốn sách\nbạn yêu thích.",
        highlight: "Chỉ từ 1.500đ/ngày",
        desc: "Netflix cho sách giấy tại Việt Nam. Chọn sách online. Nhận tại nơi thuê, miễn phí 2 chiều.",
        btnText: "Khám phá ngay",
        btnLink: "/books",
        accent: "#ff6b35",
        bg: "linear-gradient(135deg, #fff8f3 0%, #fff1e6 100%)",
    },
    {
        id: 2,
        image: banner2,
        tag: "Hơn 150.000 đầu sách",
        title: "Kho sách khổng lồ,\ngiá cả phải chăng.",
        highlight: "Miễn phí giao & nhận",
        desc: "Không đặt cọc. Hàng nghìn thể loại từ văn học, khoa học đến kỹ năng sống.",
        btnText: "Xem danh mục",
        btnLink: "/danhmuc",
        accent: "#1677ff",
        bg: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
    },
    {
        id: 3,
        image: banner3,
        tag: "Ưu đãi thành viên",
        title: "Đăng ký thành viên,\nnhận ngay ưu đãi.",
        highlight: "Giảm tới 50% tháng đầu",
        desc: "Tham gia cộng đồng đọc sách lớn nhất. Ưu đãi độc quyền dành riêng cho thành viên mới.",
        btnText: "Đăng ký ngay",
        btnLink: "/login",
        accent: "#52c41a",
        bg: "linear-gradient(135deg, #f6fff0 0%, #edffd6 100%)",
    },
];

const BannerSlider = () => {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const navigate = useNavigate();

    const goTo = useCallback((index) => {
        if (animating) return;
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 600);
    }, [animating]);

    const prev = () => goTo((current - 1 + slides.length) % slides.length);
    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

    // Auto slide mỗi 5 giây
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    return (
        <div className="banner-slider" style={{ background: slide.bg }}>
            {/* Nội dung bên trái */}
            <div className="banner-content" key={current}>
                <span className="banner-tag">{slide.tag}</span>
                <h1 className="banner-title">
                    {slide.title.split("\n").map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </h1>
                <p className="banner-highlight" style={{ color: slide.accent }}>
                    {slide.highlight}
                </p>
                <p className="banner-desc">{slide.desc}</p>
                <button
                    className="banner-btn"
                    style={{ background: slide.accent }}
                    onClick={() => navigate(slide.btnLink)}
                >
                    {slide.btnText}
                </button>
            </div>

            {/* Ảnh bên phải */}
            <div className="banner-img-wrap" key={"img-" + current}>
                <img src={slide.image} alt="banner" className="banner-img" />
            </div>

            {/* Nút điều hướng trái / phải */}
            <button className="banner-nav banner-nav--prev" onClick={prev} aria-label="Previous">
                ‹
            </button>
            <button className="banner-nav banner-nav--next" onClick={next} aria-label="Next">
                ›
            </button>

            {/* Dots */}
            <div className="banner-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`banner-dot ${i === current ? "active" : ""}`}
                        style={i === current ? { background: slide.accent } : {}}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
