import tshirtHero from "@/assets/tshirt-hero.jpg";
import polo from "@/assets/product-polo.jpg";
import denim from "@/assets/product-denim.jpg";
import knit from "@/assets/product-knit.jpg";

export type ReadinessKey = "ready" | "action" | "review" | "critical";

export const readinessLabel: Record<ReadinessKey, string> = {
  ready: "Sẵn sàng",
  action: "Cần hành động",
  review: "Cần xem lại",
  critical: "Vấn đề nghiêm trọng",
};

export const COMPANY = "Vision Textile JSC";

export type Product = {
  id: string;
  name: string;
  sku: string;
  batch: string;
  market: string;
  country: string;
  productId: string;
  material: string;
  category: string;
  image: string;
  readiness: ReadinessKey;
  dpp: "Đã công bố" | "Bản nháp" | "Cần cập nhật" | "Chưa tạo";
};

export const products: Product[] = [
  {
    id: "ts-cot-001",
    name: "Cotton Basic T-shirt",
    sku: "TS-COT-001",
    batch: "BATCH-0826",
    market: "EU",
    country: "Đức",
    productId: "TP-TS001-B0826",
    material: "95% Cotton / 5% Elastane",
    category: "Áo thun dệt kim",
    image: tshirtHero,
    readiness: "action",
    dpp: "Bản nháp",
  },
  {
    id: "ts-002",
    name: "Pique Polo Shirt",
    sku: "TS-002",
    batch: "BATCH-0724",
    market: "EU",
    country: "Pháp",
    productId: "TP-TS002-B0724",
    material: "100% Cotton",
    category: "Áo polo",
    image: polo,
    readiness: "action",
    dpp: "Chưa tạo",
  },
  {
    id: "ts-003",
    name: "Relaxed Denim Trousers",
    sku: "TS-003",
    batch: "BATCH-0619",
    market: "EU",
    country: "Hà Lan",
    productId: "TP-TS003-B0619",
    material: "98% Cotton / 2% Elastane",
    category: "Quần dệt thoi",
    image: denim,
    readiness: "review",
    dpp: "Cần cập nhật",
  },
  {
    id: "ts-004",
    name: "Ribbed Knit Sweater",
    sku: "TS-004",
    batch: "BATCH-0512",
    market: "EU",
    country: "Ý",
    productId: "TP-TS004-B0512",
    material: "70% Cotton / 30% Recycled Polyester",
    category: "Áo len dệt kim",
    image: knit,
    readiness: "ready",
    dpp: "Đã công bố",
  },
];

export const dashboardStats = {
  totalProducts: 8,
  ready: 5,
  action: 2,
  review: 1,
};

export const documentStats = [
  { label: "Sắp hết hạn", value: 4, tone: "amber" as const },
  { label: "Còn thiếu", value: 2, tone: "danger" as const },
  { label: "Đã hết hạn", value: 1, tone: "danger" as const },
  { label: "DPP cần cập nhật", value: 2, tone: "info" as const },
];

export type AlertStatus = "upcoming" | "due-soon" | "expired" | "update";

export const alertStatusLabel: Record<AlertStatus, string> = {
  upcoming: "Sắp tới",
  "due-soon": "Sắp hết hạn",
  expired: "Đã hết hạn",
  update: "Cần cập nhật",
};

export type AlertItem = {
  id: string;
  item: string;
  productId: string;
  productSku: string;
  due: string;
  status: AlertStatus;
  detail: string;
  legal: string;
  action: string;
};

export const alerts: AlertItem[] = [
  {
    id: "al-1",
    item: "GRS Certificate",
    productId: "ts-cot-001",
    productSku: "TS-COT-001",
    due: "15 ngày nữa",
    status: "due-soon",
    detail: "Chứng nhận GRS của nhà cung cấp sợi sẽ hết hiệu lực trong 15 ngày.",
    legal: "ESPR — Khung DPP",
    action: "Yêu cầu nhà cung cấp cấp lại chứng nhận trước ngày hết hạn.",
  },
  {
    id: "al-2",
    item: "Lab Report",
    productId: "ts-002",
    productSku: "TS-002",
    due: "Quá hạn tải lên",
    status: "expired",
    detail: "Thiếu Lab Report cho nhóm chất bị hạn chế của mã TS-002.",
    legal: "REACH Annex XVII",
    action: "Tải lên Lab Report từ phòng thử nghiệm được công nhận.",
  },
  {
    id: "al-3",
    item: "Certificate",
    productId: "ts-cot-001",
    productSku: "TS-COT-001",
    due: "Đã hết hạn 6 ngày",
    status: "expired",
    detail: "Chứng nhận vật liệu của TS-COT-001 đã hết hiệu lực.",
    legal: "ESPR — Khung DPP",
    action: "Thay thế bằng chứng nhận còn hiệu lực và chạy lại đánh giá.",
  },
  {
    id: "al-4",
    item: "DPP",
    productId: "ts-003",
    productSku: "TS-003",
    due: "Trong 10 ngày",
    status: "update",
    detail: "Dữ liệu vật liệu thay đổi, bản DPP hiện tại chưa phản ánh phiên bản mới.",
    legal: "ESPR — Khung DPP",
    action: "Cập nhật dữ liệu và phát hành DPP phiên bản mới.",
  },
  {
    id: "al-5",
    item: "Supplier Declaration",
    productId: "ts-002",
    productSku: "TS-002",
    due: "Trong 21 ngày",
    status: "upcoming",
    detail: "Bản khai nhà cung cấp cần được nhân sự phụ trách xác nhận lại.",
    legal: "Regulation (EU) No 1007/2011",
    action: "Xem lại nội dung khai báo và xác nhận thủ công.",
  },
  {
    id: "al-6",
    item: "Composition Sheet",
    productId: "ts-004",
    productSku: "TS-004",
    due: "Trong 30 ngày",
    status: "update",
    detail: "Tỷ lệ sợi tái chế được cập nhật, cần đồng bộ bảng thành phần.",
    legal: "Regulation (EU) No 1007/2011",
    action: "Tải lên bảng thành phần mới nhất từ nhà máy dệt.",
  },
  {
    id: "al-7",
    item: "C/O",
    productId: "ts-003",
    productSku: "TS-003",
    due: "Trong 28 ngày",
    status: "due-soon",
    detail: "Giấy chứng nhận xuất xứ sắp tới hạn cập nhật cho lô kế tiếp.",
    legal: "Yêu cầu hải quan EU",
    action: "Chuẩn bị C/O cho lô hàng kế tiếp.",
  },
];

export type DocStatus = "missing" | "uploaded" | "review" | "done";

export const docStatusLabel: Record<DocStatus, string> = {
  missing: "Chưa tải lên",
  uploaded: "Đã tải lên",
  review: "Cần xem lại",
  done: "Hoàn tất",
};

export type ChecklistRow = {
  id: string;
  doc: string;
  requirement: string;
  legal: string;
  status: DocStatus;
  badge: "current" | "dpp" | "future" | "prep";
};

export const requirementBadgeLabel = {
  current: "Hiện hành",
  dpp: "Khung DPP",
  future: "Yêu cầu tương lai",
  prep: "Mức độ chuẩn bị TRACEPASS",
} as const;

export const checklist: ChecklistRow[] = [
  {
    id: "tech-pack",
    doc: "Tech Pack",
    requirement: "Thông số kỹ thuật và cấu trúc sản phẩm",
    legal: "ESPR",
    status: "done",
    badge: "dpp",
  },
  {
    id: "composition",
    doc: "Composition Sheet",
    requirement: "Fibre Composition — tỷ lệ sợi theo khối lượng",
    legal: "Regulation (EU) No 1007/2011",
    status: "uploaded",
    badge: "current",
  },
  {
    id: "lab",
    doc: "Lab Report",
    requirement: "Kết quả thử nghiệm chất bị hạn chế",
    legal: "REACH Annex XVII",
    status: "missing",
    badge: "current",
  },
  {
    id: "invoice",
    doc: "Invoice",
    requirement: "Hóa đơn thương mại cho lô hàng",
    legal: "Yêu cầu hải quan EU",
    status: "done",
    badge: "current",
  },
  {
    id: "co",
    doc: "C/O",
    requirement: "Chứng nhận xuất xứ hàng hóa",
    legal: "Yêu cầu hải quan EU",
    status: "uploaded",
    badge: "current",
  },
  {
    id: "certificate",
    doc: "Certificate",
    requirement: "Chứng nhận vật liệu / tiêu chuẩn bền vững",
    legal: "ESPR",
    status: "review",
    badge: "prep",
  },
  {
    id: "supplier",
    doc: "Supplier Declaration",
    requirement: "Khai báo nhà cung cấp về nguồn gốc",
    legal: "Regulation (EU) No 1007/2011",
    status: "review",
    badge: "future",
  },
];

export type Requirement = {
  id: string;
  ruleId: string;
  name: string;
  status: ReadinessKey;
  evidence: string;
  issue: string;
  action: string;
  legal: string;
};

export const requirements: Requirement[] = [
  {
    id: "fibre",
    ruleId: "RULE-TEX-001",
    name: "Fibre Composition",
    status: "ready",
    evidence: "Composition_Sheet_TS001.pdf — Trang 1",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "Regulation (EU) No 1007/2011",
  },
  {
    id: "chemical",
    ruleId: "RULE-CHM-014",
    name: "Chemical Evidence",
    status: "action",
    evidence: "Chưa có bằng chứng",
    issue: "Thiếu Lab Report cho nhóm chất bị hạn chế",
    action: "Tải lên Lab Report từ phòng thử nghiệm được công nhận",
    legal: "REACH Annex XVII",
  },
  {
    id: "origin",
    ruleId: "RULE-ORG-007",
    name: "Supplier Origin",
    status: "review",
    evidence: "Supplier_Declaration_TS001.pdf — Trang 2",
    issue: "Quốc gia trên khai báo không khớp với C/O",
    action: "Nhân sự phụ trách đối chiếu và xác nhận quốc gia sản xuất",
    legal: "Regulation (EU) No 1007/2011",
  },
  {
    id: "certificate",
    ruleId: "RULE-CER-021",
    name: "Certificate",
    status: "action",
    evidence: "GRS_Certificate_2024.pdf",
    issue: "Chứng nhận đã hết hạn hiệu lực",
    action: "Thay thế bằng chứng nhận còn hiệu lực",
    legal: "ESPR",
  },
  {
    id: "labeling",
    ruleId: "RULE-LBL-003",
    name: "Labeling Data",
    status: "ready",
    evidence: "Tech_Pack_TS001.pdf — Trang 3",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "Regulation (EU) No 1007/2011",
  },
  {
    id: "care",
    ruleId: "RULE-CAR-009",
    name: "Care Instruction",
    status: "ready",
    evidence: "Tech_Pack_TS001.pdf — Trang 4",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "ESPR",
  },
  {
    id: "identifier",
    ruleId: "RULE-IDN-002",
    name: "Product Identifier",
    status: "ready",
    evidence: "TP-TS001-B0826",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "ESPR — Khung DPP",
  },
  {
    id: "traceability",
    ruleId: "RULE-TRC-011",
    name: "Batch Traceability",
    status: "ready",
    evidence: "Invoice_TS001.pdf, C/O_TS001.pdf",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "Yêu cầu hải quan EU",
  },
  {
    id: "recycled",
    ruleId: "RULE-SUS-018",
    name: "Recycled Content Claim",
    status: "ready",
    evidence: "Supplier_Declaration_TS001.pdf — Trang 1",
    issue: "Không có vấn đề",
    action: "Không cần hành động",
    legal: "ESPR — Yêu cầu tương lai",
  },
];

export const uploadDocs = [
  { id: "tech-pack", name: "Tech_Pack_TS001.pdf", size: "1.8 MB", status: "done" as DocStatus },
  {
    id: "composition",
    name: "Composition_Sheet_TS001.pdf",
    size: "640 KB",
    status: "uploaded" as DocStatus,
  },
  { id: "lab", name: "—", size: "—", status: "missing" as DocStatus },
  { id: "invoice", name: "Invoice_TS001.pdf", size: "320 KB", status: "done" as DocStatus },
  { id: "co", name: "CO_TS001.pdf", size: "410 KB", status: "uploaded" as DocStatus },
  {
    id: "certificate",
    name: "GRS_Certificate_2024.pdf",
    size: "780 KB",
    status: "review" as DocStatus,
  },
  {
    id: "supplier",
    name: "Supplier_Declaration_TS001.pdf",
    size: "520 KB",
    status: "review" as DocStatus,
  },
];

export const countries = ["Đức", "Pháp", "Hà Lan", "Ý", "Tây Ban Nha", "Bỉ", "Ba Lan", "Thụy Điển"];
export const categories = [
  "Áo thun dệt kim",
  "Áo polo",
  "Áo sơ mi dệt thoi",
  "Quần dệt thoi",
  "Áo len dệt kim",
  "Đồ thể thao",
];

export const mainProduct = products[0];