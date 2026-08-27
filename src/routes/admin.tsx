import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  LayoutDashboard,
  Package,
  Network,
  Database,
  FileText,
  QrCode,
  Bell,
  Gauge,
  Sparkles,
  Settings,
  ArrowRight,
  LogOut,
  Layers,
  AlertCircle,
  Home,
  CheckCircle2,
} from "lucide-react";
import { useWorkspaceRole } from "@/lib/tracepass/role";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useProducts,
  useSuppliers,
  useDataRecords,
  useDocuments,
  useSupplierRequests,
} from "@/lib/tracepass/db";

const ADMIN_PASSWORD_TARGET = "Thinh123@";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Portal | TRACEPASS" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, setIsAdmin, exitAdmin } = useWorkspaceRole();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  // Queries for live MVP metric summary
  const productsQ = useProducts();
  const suppliersQ = useSuppliers();
  const recordsQ = useDataRecords();
  const documentsQ = useDocuments();
  const requestsQ = useSupplierRequests();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPending(true);

    if (password === ADMIN_PASSWORD_TARGET) {
      setIsAdmin(true);
      toast.success("Đăng nhập quyền Quản trị viên (Admin) thành công!");
      setPassword("");
      setPending(false);
    } else {
      setErrorMsg("Sai mật khẩu");
      toast.error("Sai mật khẩu! Vui lòng thử lại.");
      setPending(false);
    }
  };

  const handleExit = () => {
    exitAdmin();
    toast.info("Đã thoát chế độ Quản trị viên.");
    void navigate({ to: "/dang-nhap" });
  };

  // If not authenticated into admin mode, show simple password-only form
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="size-3.5" />
              Trang chủ
            </Link>
            <Link to="/dang-nhap" className="text-xs font-medium text-primary hover:underline">
              Đăng nhập tài khoản B2B
            </Link>
          </div>

          <div className="text-center space-y-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <KeyRound className="size-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">TRACEPASS Admin</h1>
            <p className="text-sm text-muted-foreground">
              Nhập mật khẩu quản trị viên để mở khóa toàn bộ quyền truy cập SME & Supplier.
            </p>
          </div>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Xác thực quyền Quản trị (MVP)
              </CardTitle>
              <CardDescription className="text-xs">
                Chế độ dùng cho quản trị viên và thử nghiệm toàn bộ hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-medium text-foreground block"
                  >
                    Mật khẩu Admin
                  </label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      autoFocus
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errorMsg && (
                    <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 border border-destructive/20 p-2 text-xs font-medium text-destructive">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full font-semibold" disabled={pending}>
                  {pending ? "Đang xác thực..." : "Xác nhận truy cập Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Gợi ý:</span> Mật khẩu quản trị viên mặc
            định là{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-foreground">
              Thinh123@
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Admin Workspace Dashboard
  return (
    <AppShell>
      <PageHeader
        title="Trung tâm Quản trị Hệ thống (Admin Hub)"
        description="Không gian hợp nhất toàn quyền kiểm soát: Xem và điều hướng đồng thời mọi chức năng của Doanh nghiệp (SME) và Nhà cung cấp (Supplier)."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExit}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Thoát chế độ Admin
          </Button>
        }
      />

      {/* Admin MVP Banner */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Bạn đang ở chế độ Quản trị viên (Super Admin Session)
            </h2>
            <p className="text-xs text-muted-foreground">
              Toàn bộ các bộ lọc role guard đã được mở khóa. Bạn có thể tự do bấm vào bất kỳ phân hệ
              nào của SME hoặc Supplier trong sidebar bên trái hoặc danh sách phía dưới.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 border border-emerald/30 px-3 py-1 text-xs font-semibold text-emerald">
            <CheckCircle2 className="size-3.5" />
            Bypass Auth Active
          </span>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Sản phẩm SME</span>
              <Package className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{productsQ.data?.length ?? 3}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Nhà cung cấp chuỗi</span>
              <Network className="size-4 text-emerald" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {suppliersQ.data?.length ?? 4}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Dữ liệu chia sẻ</span>
              <Database className="size-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{recordsQ.data?.length ?? 3}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Hồ sơ chứng nhận</span>
              <FileText className="size-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {documentsQ.data?.length ?? 3}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Yêu cầu dữ liệu</span>
              <Gauge className="size-4 text-violet-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{requestsQ.data?.length ?? 2}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Module Exploration */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SME Panel */}
        <Card className="border-border">
          <CardHeader className="border-b border-border bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                  SME
                </span>
                <CardTitle className="text-base font-bold">Phân Hệ Doanh Nghiệp (SME)</CardTitle>
              </div>
              <span className="text-xs font-medium text-muted-foreground">8 Modules</span>
            </div>
            <CardDescription className="text-xs">
              Các tính năng dành cho Doanh nghiệp xuất khẩu dệt may / da giày tuân thủ ESPR.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {[
              {
                to: "/tong-quan",
                title: "Tổng quan Dashboard SME",
                desc: "Tổng thể mức độ sẵn sàng, chỉ số tuân thủ và cảnh báo rủi ro",
                icon: LayoutDashboard,
              },
              {
                to: "/san-pham",
                title: "Danh mục sản phẩm",
                desc: "Quản lý áo polo, sơ mi, vải dệt & phát hành hộ chiếu số",
                icon: Package,
              },
              {
                to: "/nha-cung-cap",
                title: "Mạng lưới nhà cung cấp",
                desc: "Quản lý Tier 1-3, theo dõi tỷ lệ gửi dữ liệu và độ trễ",
                icon: Network,
              },
              {
                to: "/kho-du-lieu",
                title: "Kho dữ liệu chuỗi cung ứng",
                desc: "Bảng dữ liệu thành phần sợi, vật liệu tái chế, nguồn gốc",
                icon: Database,
              },
              {
                to: "/ho-so",
                title: "Hồ sơ tuân thủ ESPR",
                desc: "Quản lý chứng chỉ GRS, OEKO-TEX, LCA & báo cáo kỹ thuật",
                icon: FileText,
              },
              {
                to: "/muc-do-san-sang",
                title: "Đánh giá mức độ sẵn sàng",
                desc: "Checklist 6 nhóm tiêu chí ESPR và khuyến nghị cải thiện",
                icon: ShieldCheck,
              },
              {
                to: "/dpp",
                title: "Phát hành hộ chiếu DPP",
                desc: "Tạo QR code, dữ liệu công khai theo chuẩn EU Digital Product Passport",
                icon: QrCode,
              },
              {
                to: "/theo-doi",
                title: "Cảnh báo & Giám sát SME",
                desc: "Theo dõi hạn chót chứng chỉ hết hạn và cảnh báo dữ liệu thiếu",
                icon: Bell,
              },
            ].map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="group flex items-center justify-between rounded-xl border border-border/80 p-3 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                    <m.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.desc}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Supplier Panel */}
        <Card className="border-border">
          <CardHeader className="border-b border-border bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald text-xs font-bold text-white">
                  SUP
                </span>
                <CardTitle className="text-base font-bold">
                  Phân Hệ Nhà Cung Cấp (Supplier Portal)
                </CardTitle>
              </div>
              <span className="text-xs font-medium text-muted-foreground">6 Modules</span>
            </div>
            <CardDescription className="text-xs">
              Các tính năng dành cho Nhà máy kéo sợi, dệt nhuộm, phụ liệu tiếp nhận yêu cầu & cung
              cấp dữ liệu.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {[
              {
                to: "/cong-nha-cung-cap",
                title: "Cổng tiếp nhận yêu cầu Supplier",
                desc: "Giao diện điền thông số kỹ thuật sợi, lô hàng, chứng chỉ cho đối tác",
                icon: Gauge,
              },
              {
                to: "/nha-cung-cap",
                title: "Kết nối đối tác thương mại",
                desc: "Xem danh sách các đối tác mua hàng đang yêu cầu chia sẻ dữ liệu",
                icon: Network,
              },
              {
                to: "/kho-du-lieu",
                title: "Dữ liệu đã chia sẻ",
                desc: "Quản lý hồ sơ kỹ thuật sợi cotton, polyester, định lượng GSM",
                icon: Database,
              },
              {
                to: "/ho-so",
                title: "Hồ sơ & Chứng nhận nhà máy",
                desc: "Quản lý và tải lên chứng chỉ GRS, Higg Index, ISO cho nhà máy",
                icon: FileText,
              },
              {
                to: "/muc-do-san-sang",
                title: "AI kiểm tra dữ liệu",
                desc: "Tự động phân tích tính hợp lệ dữ liệu cung cấp trước khi nộp",
                icon: Sparkles,
              },
              {
                to: "/theo-doi",
                title: "Yêu cầu & Thời hạn phản hồi",
                desc: "Danh sách deadline bổ sung chứng chỉ theo yêu cầu đơn hàng",
                icon: Bell,
              },
            ].map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="group flex items-center justify-between rounded-xl border border-border/80 p-3 hover:border-emerald hover:bg-emerald/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted group-hover:bg-emerald/10 text-muted-foreground group-hover:text-emerald transition-colors">
                    <m.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.desc}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-emerald group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Settings & Fast Actions */}
      <div className="mt-8">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              Cài đặt & Tiện ích Quản trị
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/cai-dat"
              className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Cài đặt hệ thống</p>
                <p className="text-xs text-muted-foreground">Ngôn ngữ, thông báo, tích hợp</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              to="/dpp/qr"
              className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">In & Xuất mã QR DPP</p>
                <p className="text-xs text-muted-foreground">Tải mã QR dán nhãn sản phẩm</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <button
              type="button"
              onClick={handleExit}
              className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3 hover:bg-destructive/10 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold text-destructive">Thoát chế độ Admin</p>
                <p className="text-xs text-muted-foreground">Xóa session và về trang đăng nhập</p>
              </div>
              <LogOut className="size-4 text-destructive" />
            </button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
