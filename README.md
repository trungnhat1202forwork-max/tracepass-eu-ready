# TRACEPASS Ready

Tạo project tên TRACEPASS MVP 2.0. Đây là web SaaS B2B high-fidelity dùng để pitching nhưng phải trông như sản phẩm đang chạy thật, không được có bất kỳ câu chữ nào kiểu “môi trường bản mẫu”, “chế độ pitching”, “dùng file demo”, “AI chuẩn bị dữ liệu”, lời chào cá nhân hoặc giải thích rằng đây là demo.

NGÔN NGỮ & BRAND

- Toàn bộ UI user-facing bằng tiếng Việt, trừ tên luật/thuật ngữ chuyên ngành như Regulation (EU) No 1007/2011, REACH Annex XVII, ESPR, DPP, QR, SKU, AI.
- Tên thương hiệu trong text UI luôn viết TRACEPASS.
- Slogan luôn đúng: ToLocal, GoGlobal.
- Visual: premium B2B SaaS + EU compliance + sustainability + data technology. Nền sáng, navy/passport blue + emerald green + lime accent, border nhẹ, shadow rất nhẹ, typography lớn hơn dashboard thông thường (body 15–16px, table >=14px, heading 28–32px).
- Không cyberpunk, không neon, không glassmorphism quá mức, không gradient rối.

SOURCE LOGIC PHẢI BÁM

- Product là trung tâm: mọi document, assessment, DPP và alert đều gắn với một Product.
- Main flow: Dashboard → Tạo sản phẩm → Thiết lập sản phẩm → Checklist → Tải hồ sơ → AI Review → Đánh giá mức độ sẵn sàng → DPP Draft → QR/Public DPP → Theo dõi.
- 5 bước cố định trong Product Detail: Thiết lập → Hồ sơ → Xác nhận → Đánh giá → DPP.
- AI chỉ đọc/OCR/trích xuất/chuẩn hóa. Rule Engine kiểm tra Data + Evidence + Rule. Human xác nhận case cần review. Không thể hiện AI tự kết luận pháp lý.
- Overall status chỉ dùng 4 trạng thái user-facing tiếng Việt: Sẵn sàng (Ready), Cần hành động (Action Required), Cần xem lại (Needs Review), Vấn đề nghiêm trọng (Critical Issue). Không dùng Compliant/Non-Compliant hay “Tuân thủ/Không tuân thủ” làm overall status.
- DPP chỉ là DPP Draft/Prototype; phải có helper text nhỏ: “Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry”. Không claim EU approval/registry registration.
- Future textile requirements phải được phân biệt với nghĩa vụ hiện hành bằng badge: Hiện hành / Khung DPP / Yêu cầu tương lai / Mức độ chuẩn bị TRACEPASS.

SCREEN 0 — WELCOME / SPLASH

- Full-screen, tối giản, không header/sidebar.
- Hero logo area ở giữa; để sẵn asset path `/tracepass-logo.png` (tôi sẽ cung cấp file sau). Nếu asset chưa tồn tại, dùng placeholder card nhưng code phải tham chiếu đúng path này để thay asset dễ dàng.
- Motion: logo core scale 70% → 105% → 100% + fade in trong ~800ms. Sau khi settle, core đứng yên.
- Tạo outer orbit riêng bằng SVG/CSS quanh logo, không xoay toàn bộ raster image. Orbit xanh dương/xanh lá chạy clockwise chậm 10s/cycle, 5 data nodes nằm trên quỹ đạo pulse tuần tự. Không tạo oval leaf giả. Không thêm leaf overlay nếu không có asset tách riêng.
- Slogan dưới logo: ToLocal, GoGlobal; subtitle: “Chuẩn hóa dữ liệu. Sẵn sàng cho thị trường EU.”; CTA “Bắt đầu”. Intro ~1.5s; CTA dẫn Dashboard. Tôn trọng prefers-reduced-motion.

GLOBAL NAVIGATION
Sidebar đúng 7 mục: Tổng quan, Sản phẩm, Hồ sơ, Mức độ sẵn sàng, DPP, Theo dõi, Cài đặt. Brand block: TRACEPASS + ToLocal, GoGlobal. Không thêm module ngoài MVP.

DEMO DATA XUYÊN SUỐT
Company: Vision Textile JSC. Product chính: Cotton Basic T-shirt. SKU TS-COT-001. Batch BATCH-0826. Market EU. Target country Đức. Product ID TP-TS001-B0826. Material 95% Cotton / 5% Elastane.

SCREEN 1 — DASHBOARD

- CTA chính + Tạo sản phẩm.
- Cards: Tổng sản phẩm 8; Sẵn sàng 5; Cần hành động 2; Cần xem lại 1.
- Hồ sơ: 4 sắp hết hạn, 2 còn thiếu, 1 đã hết hạn, 2 DPP cần cập nhật.
- Recent alerts sâu hơn và có liên kết tới product/document tương ứng: GRS Certificate còn 15 ngày; Lab Report thiếu cho TS-002; Certificate TS-COT-001 đã hết hạn; DPP TS-003 cần cập nhật; Supplier Declaration cần review.
- Recent Products table có ảnh thumbnail sản phẩm, sản phẩm, thị trường, readiness, DPP status.
- Không có ngày tháng kiểu headline, lời chào buổi sáng, “môi trường bản mẫu”, “chế độ pitching”.

SCREEN 2 — TẠO / THIẾT LẬP SẢN PHẨM

- Form ngắn, chuyên nghiệp: Tên sản phẩm; SKU / Mã kiểu; Danh mục; Lô sản xuất; Thị trường; Quốc gia mục tiêu; optional Mô tả, GTIN, Commodity Code, Ngày sản xuất.
- Các field có tập lựa chọn phải là Select/Dropdown thật, không phải text input. Danh mục dropdown; Thị trường dropdown (EU); Quốc gia mục tiêu dropdown (Đức, Pháp, Hà Lan, Ý, Tây Ban Nha, Bỉ...).
- CTA chính “Tạo Checklist”; secondary “Lưu nháp”; tertiary “Hủy”.

SCREEN 3 — CHECKLIST

- Header Cotton Basic T-shirt / EU · Đức / BATCH-0826.
- Stepper cố định: Thiết lập ✓ → Hồ sơ → Xác nhận → Đánh giá → DPP.
- Table: Hồ sơ | Yêu cầu | Nguồn pháp lý | Trạng thái | Thao tác.
- Rows: Tech Pack, Composition Sheet, Lab Report, Invoice, C/O, Certificate, Supplier Declaration.
- Ví dụ source Regulation (EU) No 1007/2011 cho Fibre Composition; dùng REACH Annex XVII khi phù hợp. Status user-facing: Chưa tải lên / Đã tải lên / Cần xem lại / Hoàn tất.
- CTA chính “Tiếp tục tải hồ sơ”.

SCREEN 4 — TẢI HỒ SƠ

- Drag & drop area PDF/JPG/PNG, danh sách document và trạng thái.
- Actions Upload/Replace/Delete phải Việt hóa: Tải lên / Thay thế / Xóa.
- CTA “Xử lý bằng AI”. Khi bấm, hiện processing state “AI đang xử lý hồ sơ...” và progress nhẹ; không có copy giải thích công nghệ dư thừa.

SCREEN 5 — AI REVIEW

- Document Composition_Sheet_TS001.pdf, preview tài liệu bên trái, dữ liệu trích xuất bên phải.
- Table: Trường dữ liệu | Giá trị AI | Nguồn | Độ tin cậy | Thao tác.
- Cotton 95%, Elastane 5%, source Trang 1; confidence Cao.
- Actions Xác nhận / Chỉnh sửa / Từ chối.
- CTA “Xác nhận & Chạy đánh giá”.

SCREEN 6 — ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG

- Overall status lớn: CẦN HÀNH ĐỘNG.
- Summary: Sẵn sàng 6; Cần hành động 2; Cần xem lại 1; Vấn đề nghiêm trọng 0.
- Table: Yêu cầu | Trạng thái | Bằng chứng | Vấn đề | Hành động đề xuất.
- Fibre Composition: Sẵn sàng; Chemical Evidence: Cần hành động, thiếu Lab Report; Supplier Origin: Cần xem lại do country mismatch; Certificate: chứng nhận hết hạn.
- Issue side panel phải có Requirement, Rule ID, Legal Source, Evidence, Issue, Recommended Action nhưng user-facing label bằng tiếng Việt; tên luật giữ nguyên.
- Cho phép “Xử lý vấn đề” và “Chạy lại đánh giá”. Sau khi xử lý issue demo, status chuyển Sẵn sàng và mở CTA “Tạo DPP”.

SCREEN 7 — DPP DRAFT

- Làm DPP rõ và hấp dẫn hơn bản dashboard kỹ thuật. Layout như digital product identity.
- Hero có ảnh chiếc áo cotton thật/photorealistic placeholder từ Unsplash-compatible remote image hoặc CSS fallback; product name, Product ID, version, status.
- Sections: Sản phẩm; Vật liệu; Sản xuất; Chuỗi cung ứng; Bằng chứng; Hướng dẫn chăm sóc; Bền vững.
- Nếu không có dữ liệu hiển thị “Chưa có dữ liệu”, không bịa.
- CTA chính “Công bố & Tạo QR”. Helper: “Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry”.

SCREEN 8 — QR / PUBLIC DPP

- QR panel: QR code visual, public URL, Product ID, DPP v1.0, Copy link, Tải QR, Xem trang công khai.
- Public DPP không có sidebar; như một digital product identity page cao cấp, dùng ảnh áo lớn, vật liệu, nhà sản xuất, nguồn gốc, chăm sóc, evidence công khai, sustainability. Không hiển thị rule engine/internal assessment/confidential documents.

SCREEN 9 — THEO DÕI & CẢNH BÁO

- Table: Hạng mục | Sản phẩm | Hạn cập nhật | Trạng thái | Thao tác.
- Ít nhất 7 alert có liên kết logic với dashboard: GRS Certificate due soon, Lab Report missing, Certificate expired, DPP update required, Supplier Declaration review, Composition Sheet update, C/O approaching expiry.
- Status: Sắp tới / Sắp hết hạn / Đã hết hạn / Cần cập nhật.
- Bấm alert điều hướng tới đúng sản phẩm/document hoặc mở panel chi tiết.

INTERACTION & QUALITY

- Mỗi màn chỉ 1 CTA chính nổi bật.
- Các buttons, tabs, dropdowns, links và alert rows phải click được trong prototype.
- Không làm auth phức tạp ở lượt này.
- Responsive desktop-first, usable ở 1440px và laptop 1280px.
- Dùng reusable components và consistent status badges. Status luôn có text + icon, không chỉ màu.
- Không thêm feature ngoài scope như blockchain, ERP integration, supplier portal, analytics nâng cao.
- Chưa kết nối Supabase trong lượt đầu; dùng state/mock data có liên kết nội bộ để review UI/UX trước.

Hãy triển khai toàn bộ frontend và interaction ở mức chạy được, sau đó trả về preview để review. Không hỏi lại các lựa chọn thiết kế nhỏ; tự quyết theo chuẩn SaaS chuyên nghiệp và các yêu cầu trên.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tracepass-eu-ready.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2292569a-97a5-4139-bb71-67625e071e18).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
