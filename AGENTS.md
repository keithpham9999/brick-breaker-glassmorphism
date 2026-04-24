# AGENTS & SKILLS DIRECTORY

## Project Context
Dự án **Brick Breaker (Glassmorphism)**. Đây là một trò chơi phát triển trên nền tảng Web sử dụng Tech Stack: HTML5, CSS3, Vanilla JS, với giao diện cao cấp mang phong cách Glassmorphism.

## Active Skills & Role Capability
Danh sách 16 kỹ năng đang kích hoạt và vai trò của từng kỹ năng:

1. **clean-code**: Đảm bảo toàn bộ mã nguồn tuân thủ nguyên tắc mã sạch (Clean Code), dễ đọc, dễ bảo trì.
2. **systematic-debugging**: Phân tích và khắc phục lỗi mã nguồn một cách có hệ thống, từng bước và hiệu quả.
3. **concise-planning**: Lên kế hoạch triển khai công việc một cách ngắn gọn, rõ ràng trước khi thực thi.
4. **git-pushing**: Quản lý quy trình commit và push code lên Git một cách bài bản, đúng quy chuẩn.
5. **lint-and-validate**: Rà soát, kiểm tra chất lượng mã nguồn trước khi tích hợp để tránh lỗi cú pháp và logic.
6. **gitnexus**: Hỗ trợ đồng bộ và quản lý quy trình phân phối, định tuyến công việc trên repository.
7. **gitnexus-claude-plugin**: Cung cấp plugin để AI Claude tương tác sâu với nền tảng GitNexus.
8. **gitnexus-cursor-integration**: Cung cấp khả năng tích hợp và đồng bộ quy trình làm việc trên Cursor IDE.
9. **gitnexus-shared**: Chia sẻ các module, hàm tiện ích dùng chung trong hệ sinh thái GitNexus.
10. **gitnexus-test-setup**: Thiết lập môi trường và kịch bản kiểm thử cho các thành phần liên quan đến GitNexus.
11. **gitnexus-web**: Xử lý các giao diện và logic web của hệ sinh thái GitNexus.
12. **javascript-mastery**: Cung cấp kiến thức chuyên sâu và các best-practices khi lập trình Javascript.
13. **frontend-design**: Định hướng thiết kế giao diện, layout và trải nghiệm người dùng ở phía Frontend.
14. **frontend-developer**: Xử lý các vấn đề logic và tích hợp ở tầng Frontend (HTML, CSS, JS).
15. **high-end-visual-design**: Chuyên gia thiết kế giao diện trực quan cao cấp, tạo cảm giác sang trọng.
16. **antigravity-design-expert**: Tối ưu hóa trải nghiệm đồ họa, animation và các yếu tố thẩm mỹ mang tính đột phá (wow factor).

## Coordination Guide
- **Lập kế hoạch & Thiết kế**: Luôn bắt đầu với `concise-planning` kết hợp `high-end-visual-design` và `antigravity-design-expert` để chốt giao diện Glassmorphism.
- **Phát triển Web**: Sử dụng `javascript-mastery`, `frontend-developer` và `clean-code` khi viết logic game.
- **Xử lý lỗi**: Kích hoạt `systematic-debugging` kết hợp với `lint-and-validate`.
- **Đồng bộ mã nguồn**: Dùng các nhóm `gitnexus-*` và `git-pushing` để lưu trữ và quản lý phiên bản một cách chuẩn mực.

### MCP Tools Menu
- **dev-tools (Puppeteer)**
  - **Có gì trong tay:** Hệ thống duyệt web ảo có khả năng click, tương tác và chụp ảnh màn hình thông qua trình duyệt.
  - **Khi nào cần dùng:** Bắt buộc dùng để mở đường dẫn localhost, tương tác giả lập và tự chụp ảnh màn hình kiểm định (self-review) lỗi sau mỗi lần thay đổi giao diện hoặc logic game.
- **leankg (LeanKG)**
  - **Có gì trong tay:** Hệ thống quét phân tích Blast Radius và quản lý tri thức cục bộ (Knowledge Graph) của dự án.
  - **Khi nào cần dùng:** Dùng trước khi thực hiện các thay đổi mã nguồn lớn để dự báo những vùng code khác có thể bị ảnh hưởng (Blast Radius).

## System-level Sub-agents
Dự án được quản lý bởi 4 Agent chuyên biệt hoạt động độc lập để đảm bảo chất lượng từng khía cạnh:

- **@A-Manager**: Người điều phối tổng quyền (Orchestrator). Tiếp nhận yêu cầu lớn, phân rã công việc và giao phó cho các Sub-agent (Người dùng có thể trực tiếp gọi @A-Manager).
- **@A-Core**: Agent chuyên trách về logic cốt lõi, hiệu suất và kiến trúc hệ thống. Chuyên xử lý Javascript, state, và thuật toán.
- **@A-UX**: Agent chuyên trách về UI/UX, thẩm mỹ và giao diện. Chuyên thiết kế Glassmorphism, animation và trải nghiệm người dùng.
- **@A-Test**: Agent chuyên trách rà soát lỗi, kiểm thử và đảm bảo chất lượng. Chuyên sử dụng Puppeteer và LeanKG để review code và giao diện.

## Session Protocol
**Mandatory First Step — Không thể bỏ qua:**
Khi bắt đầu bất kỳ phiên làm việc mới nào, AI PHẢI:
1. Đọc `.claude/knowledge/knowledge-index.md` để lấy danh sách KI.
2. Nếu task hiện tại liên quan đến bất kỳ tag nào trong index (vd: "gsap", "storage", "api"), đọc nội dung KI đó TRƯỚC khi viết code.
3. Nêu rõ trong câu trả lời đầu tiên: "Đã kiểm tra KI — [tên KI liên quan hoặc 'Không có KI liên quan']".
