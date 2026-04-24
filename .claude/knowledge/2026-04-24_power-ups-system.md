# KI: Mở rộng Game Loop và State cho Power-ups

## 🔴 Problem
Khi thêm tính năng Power-ups vào một vòng lặp game vẽ bằng Canvas (`requestAnimationFrame`), cấu trúc tĩnh của State không đủ để xử lý nhiều vật thể động sinh ra ngẫu nhiên và biến mất theo thời gian.

## 🔍 Root Cause
Vòng lặp game ban đầu chỉ quản lý một trái bóng và mảng gạch tĩnh. Các hiệu ứng giới hạn thời gian (như Expand, Speed Up) cần cơ chế đếm ngược (timer), nếu dùng `setTimeout` sẽ dễ bị lỗi khi game tạm dừng hoặc reset.

## ✅ Solution
Thay vì `setTimeout`, quản lý các hiệu ứng thời gian bằng mảng `activeEffects` lưu trữ timestamp hết hạn (`endTime`). Trong mỗi khung hình, gọi hàm `updateEffects()` để kiểm tra `Date.now() > effect.endTime` và gỡ hiệu ứng.
```javascript
function updateEffects() {
    const now = Date.now();
    for (let i = gameState.activeEffects.length - 1; i >= 0; i--) {
        let effect = gameState.activeEffects[i];
        if (now > effect.endTime) {
            // Revert effect...
            gameState.activeEffects.splice(i, 1);
        }
    }
}
```

## 🛡️ Prevention
- Luôn duyệt mảng ngược (`for (let i = arr.length - 1; i >= 0; i--)`) khi có thao tác `splice` xóa phần tử trong quá trình cập nhật frame để tránh lỗi bỏ sót index.
- Khi reset game (hàm `startNewGame`), phải luôn xóa trắng các mảng động (`powerUps`, `activeEffects`, `floatingTexts`) và khôi phục các biến base về cấu hình gốc (như `paddle.width`).
