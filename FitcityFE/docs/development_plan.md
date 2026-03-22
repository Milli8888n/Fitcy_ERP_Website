# 🎯 KẾ HOẠCH PHÁT TRIỂN CHI TIẾT: FITCITY PREMIUM RECONSTRUCTION

**Nguyên tắc cốt lõi**: "Develop & Verify" - Code đến đâu, đóng gói và kiểm thử (Unit Test + Visual Test) đến đó. Đảm bảo 100% độ trung thực so với bản gốc.

---

## 🏗️ GIAI ĐOẠN 1: NỀN TẢNG SIÊU CẤP (FOUNDATION & SETUP)
*Mục tiêu: Thiết lập môi trường phát triển không lỗi và hệ thống Design System chuẩn.*

### 1.1. Khởi tạo Nuxt 3 & Công cụ
- [ ] **Task 1.1.1**: Khởi tạo project Nuxt 3 (SSR Mode).
- [ ] **Task 1.1.2**: Cài đặt Test Suite: Vitest (Logic) + Playwright (Visual Regression).
- [ ] **Task 1.1.3**: Tích hợp công cụ: GSAP, Three.js, Lenis, Pinia.
- **🔍 Verification**: Chạy `npm run dev` và `npx vitest` xem project có rỗng nhưng sẵn sàng không.

### 1.2. Design System Blueprint
- [ ] **Task 1.2.1**: Cấu hình Global SCSS. Viết function `rs($px)` chuyển đổi pixel sang `clamp()`.
- [ ] **Task 1.2.2**: Cấu hình Typography: Ánh xạ Variable Fonts (`AcidGrotesk`, `PPFormula`).
- [ ] **Task 1.2.3**: Khai báo CSS Variable cho toàn hệ thống màu (DarkBrown, Yellow, v.v.).
- **🔍 Verification**: Tạo 1 trang mẫu để check font chữ có co giãn đúng tỉ lệ khi kéo browser không.

---

## 🧩 GIAI ĐOẠN 2: THÀNH PHẦN NGUYÊN TỬ (ATOMIC UI COMPONENTS)
*Mục tiêu: Xây dựng các component nhỏ nhất với độ hoàn thiện Premium.*

### 2.1. Primitives (Atomic)
- [ ] **Task 2.1.1**: `ContentButton` - Hiệu ứng hover đổi màu nền + text.
- [ ] **Task 2.1.2**: `VariableLabel` - Hiệu ứng co giãn font-weight/width khi mouse-over.
- [ ] **Task 2.1.3**: `InputWrapper` - Hệ thống input tinh tế có underline animation.
- **🔍 Verification**: Chạy Playwright so sánh ảnh (Snapshots) với bản gốc của Phive.pt.

### 2.2. Fragments (Molecular)
- [ ] **Task 2.2.1**: `MenuGrid` - Xây dựng thanh Bar điều hướng dưới cùng.
- [ ] **Task 2.2.2**: `Curtain` - Hiệu ứng rèm che chuyển trang (GSAP scaleY).
- [ ] **Task 2.2.3**: `ClubCard` - Thẻ đại diện câu lạc bộ với hiệu ứng hover mượt.
- **🔍 Verification**: Test tương tác hover có mượt 60fps không.

---

## 🌊 GIAI ĐOẠN 3: LINH HỒN 3D & CHUYỂN ĐỘNG (BUROGL & 3D ENGINE)
*Mục tiêu: Đưa yếu tố 3D vào làm "linh hồn" của website.*

### 3.1. Phục chế Engine BuroGL
- [ ] **Task 3.1.1**: Cài đặt `ThreeScene.vue` (Canvas bọc toàn trang).
- [ ] **Task 3.1.2**: Porting bộ nạp model (`phive-v7.glb`) và Shaders (Materials).
- [ ] **Task 3.1.3**: Tích hợp `ScrollTrigger` để điều khiển Camera 3D theo vị trí cuộn.
- **🔍 Verification**: Check FPS trên thiết bị yếu. Đảm bảo model 3D không bị "giật" khi cuộn trang.

---

## 📑 GIAI ĐOẠN 4: TRANG CHỦ & TRANG ĐÍCH (PAGE ASSEMBLY)
*Mục tiêu: Ráp dữ liệu từ JSON vào giao diện thực.*

### 4.1. Homepage Reconstruction
- [ ] **Task 4.1.1**: Assemble `HomeHeader`, `ClubsShowcase`, `Footer`.
- [ ] **Task 4.1.2**: Mapping nội dung từ `en/_payload.json` vào props các component.
- [ ] **Task 4.1.3**: Hiệu ứng xuất hiện (Page Load Animation).
- **🔍 Verification**: So sánh visual 1-1 giữa trang gốc và trang tái tạo.

### 4.2. Club & Class Pages
- [ ] **Task 4.2.1**: Xây dựng template dynamic `[...slug].vue`.
- [ ] **Task 4.2.2**: Xây dựng bộ lọc dữ liệu (Content Provider) cho từng CLB.
- **🔍 Verification**: Click vào các CLB trên Menu xem trang có chuyển dữ liệu đúng không.

---

## 📝 GIAI ĐOẠN 5: CHUYỂN ĐỔI & BIỂU MẪU (FORMS & CONVERSION)
*Mục tiêu: Đảm bảo tính năng đăng ký hoạt động hoàn hảo.*

### 5.1. Hệ thống Trial Form
- [ ] **Task 5.1.1**: Multi-step Form chọn CLB và Môn học.
- [ ] **Task 5.1.2**: Tích hợp `intl-tel-input` cho phần nhập số điện thoại.
- [ ] **Task 5.1.3**: Hiệu ứng thành công (Success State).
- **🔍 Verification**: Test flow từ đầu đến cuối, kiểm tra validate dữ liệu đầu vào.

---

## ⚡ GIAI ĐOẠN 6: TỐI ƯU HÓA & PHÁT HÀNH (OPTIMIZE & DEPLOY)
*Mục tiêu: Website đạt điểm 100 Lighthouse.*

### 6.1. Performance Tuning
- [ ] **Task 6.1.1**: Tối ưu Video (Lazy load, nén dung lượng).
- [ ] **Task 6.1.2**: Tối ưu SEO (Meta tags, JSON-LD).
- [ ] **Task 6.1.3**: Setup Deployment Action lên Vercel/VPS.
- **🔍 Verification**: Chạy Lighthouse Audit (Yêu cầu > 90 điểm cho mọi tiêu chí).

---

**📅 Lịch trình dự kiến:**
- **Tuần 1**: GĐ 1 & 2 (Móng & Gạch).
- **Tuần 2**: GĐ 3 & 4 (Nội thất 3D & Hoàn thiện thô).
- **Tuần 3**: GĐ 5 & 6 (Tiện ích & Bàn giao).
