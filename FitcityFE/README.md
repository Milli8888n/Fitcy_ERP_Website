# 🏆 FITCITY PREMIUM - TECHNICAL RECONSTRUCTION GUIDE

Chào mừng team phát triển đến với dự án tái cấu trúc hệ thống **Fitcity**. Đây là tài liệu hướng dẫn kỹ thuật chi tiết dựa trên dữ liệu đã được trích xuất (Reverse Engineering) từ hệ thống gốc.

---

## 📊 TỔNG QUAN TÀI NGUYÊN (RESOURCES)

Dự án đã được chuẩn bị sẵn sàng 100% về mặt tài liệu và tài nguyên:

- **Kiến trúc Giao diện**: 74 Vue Components (đã phân loại thành Blocks, Fragments, Primitives).
- **Tài nguyên Media**: 348 file (Video, Image, Font, 3D Model) đã được tải xuống và chuẩn hóa tên file.
- **Dữ liệu Nội dung**: Hệ thống `_payload.json` chứa toàn bộ text, metadata và mapping của trang chủ cũng như các trang con.
- **Logic Chuyển động**: Full GSAP timeline và BüroGL Three.js Engine.

---

## 📁 CẤU TRÚC THƯ MỤC BÀN GIAO

```text
f:/FitcityFE/
├── assets/downloaded/           # 📦 TOÀN BỘ ASSETS (Dùng cái này để code)
│   ├── images/                  # Ảnh High-res đã xử lý tên file
│   ├── videos/                  # Video Hero và Video Class demo
│   ├── models_fonts/            # GLB Models và Variable Fonts
│   └── api_data/                # Mock data từ API gốc
├── resources/source_code/       # 📄 MÃ NGUỒN GỐC (Dùng để tham khảo logic)
│   └── phive.pt/
│       ├── components/          # Cấu trúc Vue components gốc
│       ├── buroGL/              # Nòng cốt engine 3D
│       └── pages/               # Logic routing dynamic
├── docs/                        # 📝 TÀI LIỆU PHÂN TÍCH
│   ├── master_asset_list.txt    # Danh sách URL gốc
│   └── component_tree.json      # Bản đồ cấu trúc component
└── reverse-engineering/         # 🛠️ CÔNG CỤ (Các script trích xuất đã dùng)
```

---

## 🛠️ HƯỚNG DẪN TRIỂN KHAI (IMPLEMENTATION STEPS)

### 1. Khởi tạo Tech-Stack (Giai đoạn 1)
Khuyến nghị sử dụng **Nuxt 3** để kế thừa tốt nhất cấu trúc của dự án gốc.
```bash
# Các thư viện bắt buộc
npm install gsap @gsap/vue lenis three pinia
```

### 2. Thiết lập Design System (Giai đoạn 2)
Sử dụng công thức `clamp()` đã trích xuất để làm hệ thống responsive tự động:
- **Font-size tiêu chuẩn**: `clamp(24px, 22.791px + 100vw * .0031, 28px)`
- **Color Palette**: Tham chiếu tại `resources/source_code/phive.pt/_nuxt/entry.DAmVvGQ9.css`.

### 3. Tái tạo 3D Scene (Giai đoạn 3)
Tham chiếu thư mục `buroGL/core/runner.js`. Đây là nơi quản lý:
- Tương tác Camera qua ScrollTrigger.
- ShaderMaterials cho vật liệu model `phive-v7.glb`.

### 4. Lắp ghép Pages (Giai đoạn 4)
Sử dụng dữ liệu trong `_payload.json` để map vào các props của component:
- **Homepage**: `/en/_payload.json`
- **Clubs Detail**: `/en/clubs/[slug]/_payload.json`

---

## ⚠️ CÁC LƯU Ý QUAN TRỌNG

1. **Naming Convention**: Toàn bộ file trong `assets/downloaded` đã được đổi khoảng trắng thành dấu gạch dưới (`_`). Hãy dùng tên file này trong code.
2. **GSAP Easing**: Tuyệt đối sử dụng `expo.out` hoặc `cubic-bezier(.19, 1, .22, 1)` cho các hiệu ứng trượt rèm và menu để giữ cảm giác Premium.
3. **Variable Fonts**: Sử dụng `font-variation-settings` để thay đổi `wght` (weight) và `wdth` (width) khi hover vào các label.

---

**🚩 Mọi thứ đã sẵn sàng cho team phát triển. Chúc may mắn!**
