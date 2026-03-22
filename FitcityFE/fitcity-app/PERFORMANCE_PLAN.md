# Kế hoạch chi tiết tối ưu hiệu suất Fitcity Nuxt App

Dưới đây là lộ trình chi tiết để tối ưu hóa tốc độ tải trang (Load Speed) và độ mượt mà (Smoothness) cho dự án Fitcity.

## giai đoạn 1: Tối ưu hóa Tài nguyên (Ưu tiên Cao nhất)
*Mục tiêu: Giảm dung lượng tải xuống ban đầu và ngăn chặn việc tải tài nguyên thừa.*

### 1.1 Tối ưu hóa ImageAsset.vue
- **Hành động**: Kích hoạt lại `@nuxt/image`.
- **Chi tiết**:
    - Mở `components/core/ImageAsset/ImageAsset.vue`.
    - Thay thế thẻ `<img>` hiện tại bằng `<nuxt-img>`.
    - Cấu hình `sizes` và `format="webp"` để phục vụ ảnh theo kích thước màn hình.
    - Sử dụng `loading="lazy"` cho các ảnh ở dưới màn hình đầu tiên (below the fold).

### 1.2 Tối ưu hóa VideoAsset.vue
- **Hành động**: Triển khai Lazy Loading cho video.
- **Chi tiết**:
    - Sử dụng `Intersection Observer` (hoặc composable `useIntersectionObserver` từ VueUse nếu có) để chỉ thiết lập `src` cho thẻ `<video>` khi người dùng cuộn đến gần.
    - Nén các video trong `public/videos` (Sử dụng Handbrake hoặc FFmpeg để đưa video về mức bitrate ~2-3Mbps cho Desktop và <1Mbps cho Mobile).

---

## Giai đoạn 2: Cải thiện Luồng Tải (Loading Flow)
*Mục tiêu: Giảm thời gian chờ của Preloader và cải thiện cảm nhận tốc độ (Perceived Speed).*

### 2.1 Giải phóng Preloader khỏi WebGL
- **Hành động**: Chỉnh sửa logic khởi tạo trong `ThreeScene.vue`.
- **Chi tiết**:
    - Không sử dụng `context.$page.loader.deferLoad(webglLoad())` để chặn màn hình Preloader.
    - Cho phép Preloader kết thúc ngay sau khi dữ liệu cơ bản (DOM, Fonts, Images chính) đã sẵn sàng.
    - Hiển thị một ảnh nền (Backup Image) mờ tại vị trí WebGL trong khi Scene đang load ngầm.

### 2.2 Tối ưu hóa Font và CSS
- **Hành động**: Đảm bảo font không gây Layout Shift.
- **Chi tiết**:
    - Kiểm tra `app.vue` để đảm bảo các font `.woff2` quan trọng được `preload` chính xác.
    - Sử dụng thuộc tính `font-display: swap` trong CSS.

---

## Giai đoạn 3: Tối ưu hóa Runtime & Animation
*Mục tiêu: Đạt 60 FPS ổn định, giảm hiện tượng giật (jank) khi cuộn.*

### 3.1 Tối ưu hóa Three.js (Scene.js)
- **Hành động**: Giảm tải tính toán cho CPU.
- **Chi tiết**:
    - Xem xét chuyển từ `three/webgpu` về `three` (WebGL2) nếu không dùng các tính năng đặc thù của WebGPU để giảm kích thước bundle và tăng tính tương thích.
    - Trong vòng lặp `useFrame`, hạn chế việc gọi `updateMatrix()` hoặc các phép toán logic nặng. Chỉ tính toán khi có sự thay đổi (scroll hoặc tương tác).
    - Sử dụng `requestIdleCallback` cho các tác vụ không quan trọng.

### 3.2 Tối ưu hóa Rive và Lottie (nếu có)
- **Hành động**: Quản lý tài nguyên Animation.
- **Chi tiết**:
    - Đảm bảo các instance của Rive được `pause()` khi component không nằm trong viewport.
    - Chỉ `mount` các component animation nặng khi cần thiết.

---

## Giai đoạn 4: Cấu hình Nuxt & Build Optimization
*Mục tiêu: Giảm kích thước file Javascript tổng thể.*

### 4.1 Phân tích Bundle
- **Hành động**: Sử dụng `rollup-plugin-visualizer`.
- **Chi tiết**: Chạy lệnh build với analyzer để tìm xem thư viện nào đang chiếm dung lượng lớn nhất và tìm cách thay thế hoặc import chọn lọc (ví dụ: chỉ import các module cần thiết của `gsap` hoặc `three`).

### 4.2 Cấu hình Vite
- **Hành động**: Split Chunks.
- **Chi tiết**: Cấu hình `manualChunks` trong `nuxt.config.ts` để tách các thư viện lớn như `three`, `gsap` ra khỏi `entry chunk`.

---

## Giai đoạn 5: Kiểm tra và Duy trì
- **Công cụ**: Sử dụng **Lighthouse** và **Chrome DevTools (Performance tab)** sau mỗi thay đổi.
- **KPI**:
    - **LCP (Largest Contentful Paint)**: < 2.5s.
    - **FID (First Input Delay)**: < 100ms.
    - **CLS (Cumulative Layout Shift)**: < 0.1.
