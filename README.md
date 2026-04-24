# Brick Breaker - Glassmorphism Edition

Một phiên bản tái hiện lại trò chơi Brick Breaker kinh điển với phong cách thiết kế Glassmorphism cực kỳ hiện đại, bắt mắt. Game được viết hoàn toàn bằng HTML5, CSS3 và Vanilla JS.

## Công nghệ sử dụng
- **HTML5 Canvas**: Vẽ đồ họa 2D mượt mà.
- **CSS3**: Variables, Flexbox, Keyframes Animation, Backdrop-filter (Glassmorphism).
- **Vanilla JavaScript**: Logic game, RequestAnimationFrame, Event Listeners.

## Cách chạy dự án (Local)

Để trải nghiệm game với đúng các hiệu ứng đồ họa, tốt nhất nên chạy trên một local server để tránh lỗi cross-origin (mặc dù game có thể chạy trực tiếp bằng cách mở file `index.html` trong một số trình duyệt).

Bạn có thể sử dụng `npx serve`:
```bash
# Di chuyển vào thư mục game
cd brick-breaker-glassmorphism

# Chạy lệnh
npx serve .
```

Sau đó mở trình duyệt ở địa chỉ localhost do lệnh trả về (thường là `http://localhost:3000`).

## Cách chơi
1. Mở game, ấn nút **START GAME**.
2. Sử dụng **Phím mũi tên Trái / Phải** hoặc **Di chuột** để di chuyển thanh đỡ (paddle).
3. Đỡ bóng, không để bóng rơi xuống đáy màn hình. Phá vỡ tất cả các viên gạch để giành chiến thắng.
4. Mỗi người chơi có 3 mạng (LIVES).
