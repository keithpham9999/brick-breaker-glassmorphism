# ARCHITECTURE.md: Brick Breaker (Glassmorphism)

## Overview
Dự án được xây dựng với mục tiêu cung cấp một trải nghiệm game arcade cổ điển (Brick Breaker) nhưng được khoác lên mình một phong cách thiết kế hiện đại (Glassmorphism). Game chạy hoàn toàn ở phía client (trình duyệt) thông qua HTML5 Canvas, CSS3 cho styling và Vanilla JS cho logic.

## Cấu trúc thư mục (Directory Structure)
```
/brick-breaker-glassmorphism
│
├── index.html        # Khung chứa game, canvas, UI overlays (Start, Game Over, Victory).
├── style.css         # Hệ thống thiết kế (Design System) bao gồm Glassmorphism, animations.
├── script.js         # Logic game, xử lý vật lý, vẽ hình, lắng nghe sự kiện người dùng.
├── README.md         # Hướng dẫn chạy và chơi game.
└── ARCHITECTURE.md   # Mô tả cấu trúc và logic kỹ thuật của dự án.
```

## Giải thích chi tiết

### 1. index.html
Sử dụng các thẻ semantic cơ bản và một thẻ `<canvas>` làm nơi vẽ đồ họa 2D. Các `div` overlay được đặt đè lên trên canvas bằng CSS position absolute nhằm hiển thị UI cho người dùng (Start, Game Over).

### 2. style.css
Phần cốt lõi tạo nên Wow Factor cho dự án.
- **Biến CSS (Variables)**: Định nghĩa các mã màu Gradient, Box-shadow, kích thước blur để tái sử dụng.
- **Animations**: Sử dụng `@keyframes` để làm các blob hình nền (background-blobs) trôi nổi tự nhiên.
- **Glassmorphism**: Sự kết hợp giữa `backdrop-filter: blur(16px)`, `background: rgba(255, 255, 255, 0.05)`, và `box-shadow` để tạo hiệu ứng kính mờ cho các bảng thông báo và khung game.

### 3. script.js
File logic duy nhất xử lý toàn bộ vòng lặp của game.
- **Khởi tạo Game (Game Init)**: Tạo ma trận mảng 2 chiều đại diện cho các viên gạch (`initBricks`).
- **Game Loop (`draw` function)**: Sử dụng `requestAnimationFrame` để gọi đệ quy hàm `draw()`. Mỗi lần gọi sẽ xóa canvas (`clearRect`) và vẽ lại toàn bộ các đối tượng với vị trí mới.
- **Vật lý & Va chạm (`collisionDetection`)**: 
  - Tính toán va chạm giữa quả bóng (tọa độ tâm, bán kính) với các thành phần: tường (trái/phải/trên), thanh đỡ (paddle), gạch (bricks) và mặt phẳng dưới (đáy).
  - Khi bóng chạm paddle, tính toán vị trí va chạm để làm thay đổi góc nảy của bóng nhằm tạo cảm giác tương tác thực.
- **Xử lý sự kiện (Event Handling)**: Lắng nghe `keydown`, `keyup` và `mousemove` để điều khiển paddle. Mouse giúp trải nghiệm game mượt mà hơn trên desktop.
