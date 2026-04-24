# HIẾN PHÁP & QUY TẮC DỰ ÁN (RULES)

## 1. Quy tắc sử dụng Skill
Khi AI sử dụng bất kỳ skill nào để tạo ra kết quả (tài liệu, hoặc câu trả lời cho người dùng...), trong kết quả đó trước tiên phải bắt đầu bằng thông báo rõ ràng về tên skill đang được sử dụng (Ví dụ: `[Sử dụng Skill: concise-planning]`).
Ở cuối kết quả, AI phải tự rà soát lại (Self-Review) xem nội dung đầu ra đã tuân thủ hoàn toàn các hướng dẫn trong skill đó chưa.

## 2. Tiêu chuẩn Mã nguồn (Clean Code)
Luôn tuân thủ nguyên tắc Clean Code. Toàn bộ tiêu chuẩn mã nguồn, quy ước đặt tên, cấu trúc file, và chú thích phải được định nghĩa và đối chuẩn thông qua kỹ năng hệ thống: `clean-code`.
Bất kỳ thay đổi code nào vi phạm nguyên tắc Clean Code đều phải được refactor lại ngay lập tức.

## 3. Mệnh Lệnh MCP (Iron Rules)
- **KHÔNG ĐƯỢC KẾT THÚC TASK UI** nếu chưa dùng `dev-tools` (Puppeteer) để mở trình duyệt, chụp ảnh màn hình và tự kiểm định chất lượng (Self-Review).
- **KHÔNG ĐƯỢC CHẠM VÀO LOGIC CỐT LÕI** nếu chưa dùng `leankg` quét Blast Radius để xác định các file liên đới.

## 4. Định danh Sub-agent & Cập nhật Kiến trúc
Khi một sub-agent được gọi (Core, UX, Test...), trong câu trả lời hoặc sản phẩm đầu ra của agent đó trước tiên luôn phải bắt đầu bằng tên định danh của mình (Ví dụ: [@A-Core], [@A-UX]...). Ngoài ra, nếu bất kỳ thay đổi nào tác động đến kiến trúc hệ thống, Agent bắt buộc phải cập nhật đồng thời file ARCHITECTURE.md và file README.md.

## 5. Quy tắc Kiểm soát (Orchestration & Rollback)
Mọi thay đổi do @A-Manager điều phối chỉ được phép áp dụng chính thức vào dự án nếu được @A-Test đánh giá là đạt (PASS). Trong trường hợp không đạt, AI phải thực hiện Rollback toàn bộ mã nguồn và tài liệu (README, ARCHITECTURE...) về trạng thái ổn định gần nhất trước đó.

## 6. Mệnh lệnh Sắt: QUY TẮC NHẬT KÝ PHỐI HỢP
Manager phải lưu trữ bằng chứng phối hợp thành file vật lý theo định dạng hội thoại để người dùng hậu kiểm quy trình phối hợp (Lưu tại thư mục logs của A-manager).

## 7. Quy tắc Git (Git Governance)
Mọi thay đổi code CHỈ được push lên GitHub sau khi @A-Test đóng dấu PASS. AI phải tự động thực hiện commit và push — người dùng không cần gõ lệnh Git.
Commit message bắt buộc theo chuẩn Conventional Commits. Không chấp nhận message dạng 'fix bug' hay 'update code'.
