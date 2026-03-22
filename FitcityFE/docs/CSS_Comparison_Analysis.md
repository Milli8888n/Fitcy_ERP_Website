# ⚖️ Phân Tích & So Sánh CSS: Current Implementation vs Source Code

## 🕵️ Tổng Quan

Sau khi đối chiếu mã nguồn của `HomeHeader` và các components con trong `fitcity-app` với source code gốc (`phive.pt`), tôi rút ra các kết luận sau:

### ✅ Điểm Tương Đồng (Identical logic)

1.  **Layout & Structure**:
    -   Hệ thống `grid-template` chồng layers (`grid-row: 1; grid-column: 1`) được giữ nguyên.
    -   Z-index layering (Background: 1, Content: 3, Ribbon: 4, Bullets: 5) trùng khớp.
    -   Class naming conventions (`.ribbon-inner`, `.full-container`, `.half-container`) đồng nhất.

2.  **Color System**:
    -   Loop `nth-child(5n + x)` để gán CSS Variables cho màu sắc (`--color-yellow`, `--color-stream`, v.v.) hoàn toàn giống nhau.

3.  **Animation Properties**:
    -   Các thuộc tính animation như `clip-path` polygon values, thời lượng animation, và easing functions đều khớp.

4.  **Responsive Logic**:
    -   Sử dụng biến `--computed-100vh` thay vì `100vh` (quan trọng cho mobile browser address bar).
    -   Breakpoint `$small` và media queries `@include max-screen` giống nhau.

### ⚠️ Điểm Khác Biệt & Vấn Đề (CRITICAL)

#### 1. Thiếu định nghĩa hàm `rs()`
-   **Source Code & Current Code**: Đều sử dụng hàm `rs(value)` rất nhiều.
    -   Ví dụ: `padding-bottom: rs(220)`, `gap: rs(110)`, `width: rs(80)`.
-   **Hiện trạng**: File `assets/scss/_mixins.scss` hiện tại **KHÔNG** chứa định nghĩa cho hàm `rs()`.
-   **Hệ quả**: Project sẽ bị lỗi build (SCSS Compilation Error) vì `Undefined function rs`.
-   **Giải pháp cần làm ngay**: Cần định nghĩa hàm `rs()` vào `_mixins.scss`.

#### 2. Import Mixins
-   **Nuxt Config**: Đã cấu hình import `_mixins.scss` global:
    ```typescript
    additionalData: '@use "sass:math"; @import "~/assets/scss/_mixins.scss";'
    ```
-   Điều này là đúng, nhưng bản thân file `_mixins.scss` chưa đủ.

---

## 🛠️ Đề xuất Fix `rs()` Function

Dựa trên ngữ cảnh (fitcity thường dùng scaling design), hàm `rs` (responsive size) thường có logic như sau:
-   Desktop large: convert sang `vw` dựa trên design width (ví dụ 1440px hoặc 1920px).
-   Desktop normal/Laptop: giữ px hoặc rem.
-   Mobile: convert tỷ lệ theo mobile design width.

Tuy nhiên, để an toàn và nhanh chóng, ta có thể define `rs` đơn giản là trả về px hoặc rem, hoặc copy logic từ một project tương tự.

**Dự kiến thêm vào `_mixins.scss`:**
```scss
@function rs($val) {
  @return #{$val}px; 
  // TODO: Implement logic responsive scaling thực tế (ví dụ: math.div($val, 1440) * 100vw)
  // Hiện tại trả về px để code chạy được.
}
```

---

## 📝 Chi tiết Style của từng Component

### Ribbon.vue
```scss
// Grid layout cho infinite scroll text
.ribbon-inner {
    display: grid;
    // ...
    white-space: nowrap; // Text không xuống dòng
}

// Clip-path cho split effect
.half-container:nth-child(2) {
    clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%); // Top half
}
```

### Background.vue
```scss
// Loop màu cho background placeholder (nếu image chưa load)
&:nth-child(5n + 1) { --ribbon-backgroundColor: var(--color-yellow); }
```

### Bullets.vue
```scss
.bullet {
    width: rs(80); // Cần fix hàm rs
    @include extend_hitbox(20); // Mixin này đã có trong _mixins.scss
}
```

---

## 🏁 Kết luận

Về cơ bản CSS đã được port sang đúng. Vấn đề duy nhất và nghiêm trọng nhất là thiếu hàm `rs()`. Cần bổ sung ngay lập tức để tránh lỗi runtime/build.
