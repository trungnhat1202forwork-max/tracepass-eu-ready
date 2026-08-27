import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  Link2,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAcceptRequest,
  useCreateDppVersion,
  useCreateSupplierRequest,
  useDataRecords,
  useDppVersions,
  useProducts,
  useSupplierRequests,
  useSuppliers,
} from "@/lib/tracepass/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nha-cung-cap")({
  head: () => ({ meta: [{ title: "Kết nối nhà cung cấp | TRACEPASS" }] }),
  component: SupplierNetwork,
});

const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "Đang chờ", className: "border-amber/30 bg-amber/10 text-amber" },
  responded: { label: "Đã phản hồi", className: "border-info/30 bg-info/10 text-info" },
  accepted: { label: "Đã xác nhận", className: "border-emerald/30 bg-emerald/10 text-emerald" },
};

function SupplierNetwork() {
  const suppliersQ = useSuppliers();
  const requestsQ = useSupplierRequests();
  const productsQ = useProducts();
  const recordsQ = useDataRecords();
  const versionsQ = useDppVersions();
  const createRequest = useCreateSupplierRequest();
  const acceptRequest = useAcceptRequest();
  const createVersion = useCreateDppVersion();
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [title, setTitle] = useState("Bổ sung dữ liệu truy xuất nguồn gốc");

  const suppliers = useMemo(() => suppliersQ.data ?? [], [suppliersQ.data]);
  const requests = useMemo(() => requestsQ.data ?? [], [requestsQ.data]);
  const products = useMemo(() => productsQ.data ?? [], [productsQ.data]);
  const records = useMemo(() => recordsQ.data ?? [], [recordsQ.data]);
  const versions = useMemo(() => versionsQ.data ?? [], [versionsQ.data]);
  const mainProduct = products.find((p) => p.sku === "TS-COT-001") ?? products[0];

  const supplierNames = useMemo(
    () => new Map(suppliers.map((s) => [s.id, s.tracepass_organizations?.name ?? s.supplier_code])),
    [suppliers],
  );
  const pending = requests.filter((r) => r.status === "pending").length;
  const responded = requests.filter((r) => r.status === "responded").length;
  const confirmed = requests.filter((r) => r.status === "accepted").length;

  async function submitRequest() {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier || !mainProduct) return;
    await createRequest.mutateAsync({
      productId: mainProduct.id,
      supplierId,
      supplierName: supplierNames.get(supplierId) ?? supplier.supplier_code,
      title,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      fields: [
        { key: "material_origin", label: "Nguồn gốc nguyên liệu", required: true },
        { key: "fiber_composition", label: "Thành phần sợi", required: true },
        { key: "facility", label: "Cơ sở sản xuất", required: true },
        { key: "certificate", label: "Chứng nhận liên quan" },
      ],
      reuse: { reusable_fields: 2, reconfirm_fields: 1, new_fields: 1 },
    });
    toast.success("Đã gửi yêu cầu dữ liệu tới nhà cung cấp");
    setOpen(false);
  }

  async function accept(id: string) {
    const request = requests.find((r) => r.id === id);
    if (!request) return;
    await acceptRequest.mutateAsync(request);
    toast.success("Dữ liệu đã được xác nhận và lưu vào lịch sử truy xuất");
  }

  async function makeDpp() {
    if (!mainProduct) return;
    const productVersions = versions.filter((v) => v.product_id === mainProduct.id);
    const nextVersion = Math.max(0, ...productVersions.map((v) => v.version)) + 1;
    await createVersion.mutateAsync({
      productId: mainProduct.id,
      nextVersion,
      snapshot: {
        product: mainProduct,
        verifiedSupplierRequests: requests.filter((r) => r.status === "accepted"),
        traceabilityRecords: records.filter((r) => r.product_id === mainProduct.id),
        generatedAt: new Date().toISOString(),
      },
    });
    toast.success(`Đã tạo bản nháp DPP v${nextVersion}`);
  }

  const unavailable = suppliersQ.isError || requestsQ.isError;

  return (
    <AppShell>
      <PageHeader
        title="Kết nối nhà cung cấp"
        description="Thu thập, xác nhận và tái sử dụng dữ liệu có nguồn gốc — không gửi lại biểu mẫu từ đầu cho mỗi lô hàng."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-11">
              <Link to="/cong-nha-cung-cap">
                <Building2 className="size-4" />
                Xem cổng Supplier
              </Link>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-11">
                  <Plus className="size-4" />
                  Gửi yêu cầu mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yêu cầu bổ sung dữ liệu</DialogTitle>
                  <DialogDescription>
                    Yêu cầu được ghi vào lịch sử và chuyển thẳng tới cổng của nhà cung cấp.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label>Nhà cung cấp</Label>
                    <Select value={supplierId} onValueChange={setSupplierId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhà cung cấp" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {supplierNames.get(s.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Nội dung yêu cầu</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                    <strong className="text-foreground">TRACEPASS đã nhận diện:</strong> 2 trường có
                    thể tái sử dụng, 1 trường cần xác nhận lại và 1 trường cần cung cấp mới.
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={submitRequest}
                    disabled={!supplierId || !title || createRequest.isPending}
                  >
                    <Send className="size-4" />
                    {createRequest.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {unavailable ? (
        <div className="mb-5 rounded-xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">
          Không kết nối được dữ liệu Supabase. Kiểm tra biến môi trường hoặc quyền truy cập của
          project.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Nhà cung cấp đã kết nối", suppliers.length, Building2, "text-foreground"],
          ["Đang chờ phản hồi", pending, Clock3, "text-amber"],
          ["Chờ SME xác nhận", responded, RefreshCw, "text-info"],
          ["Dữ liệu đã xác nhận", records.length, Database, "text-emerald"],
        ].map(([label, value, Icon, tone]) => {
          const I = Icon as typeof Building2;
          return (
            <div key={String(label)} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{String(label)}</p>
                <I className={cn("size-5", String(tone))} />
              </div>
              <p className={cn("mt-3 text-3xl font-bold", String(tone))}>{Number(value)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">Yêu cầu dữ liệu</h2>
              <p className="text-sm text-muted-foreground">Một luồng chung giữa SME và supplier</p>
            </div>
            <Badge variant="outline">{requests.length} yêu cầu</Badge>
          </div>
          <div className="divide-y divide-border">
            {requests.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                Chưa có yêu cầu. Hãy gửi yêu cầu đầu tiên.
              </div>
            ) : (
              requests.map((r) => {
                const meta = statusMeta[r.status] ?? statusMeta["pending"]!;
                return (
                  <div key={r.id} className="p-5 transition-colors hover:bg-muted/30">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{r.title}</h3>
                          <Badge variant="outline" className={meta.className}>
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {supplierNames.get(r.supplier_id) ?? "Nhà cung cấp"} · Hạn{" "}
                          {r.due_date ?? "—"}
                        </p>
                      </div>
                      {r.status === "responded" ? (
                        <Button
                          size="sm"
                          onClick={() => accept(r.id)}
                          disabled={acceptRequest.isPending}
                        >
                          <CheckCircle2 className="size-4" />
                          Xác nhận dữ liệu
                        </Button>
                      ) : r.status === "pending" ? (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/cong-nha-cung-cap">
                            Mở cổng Supplier
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald">
                          <ShieldCheck className="size-4" />
                          Đã ghi lịch sử
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(r.requested_fields ?? []).map((f) => (
                        <span
                          key={f.key}
                          className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2">
              <Link2 className="size-5 text-primary" />
              <h2 className="font-semibold">Chuỗi dữ liệu có lịch sử</h2>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["01", "SME gửi yêu cầu"],
                ["02", "Supplier phản hồi + bằng chứng"],
                ["03", "SME xác nhận dữ liệu"],
                ["04", "DPP tạo phiên bản mới"],
              ].map(([n, text], i) => (
                <div key={n} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i < 2 || confirmed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {n}
                  </span>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phiên bản DPP</p>
                <p className="mt-1 text-2xl font-bold">
                  v{Math.max(0, ...versions.map((v) => v.version)) || "—"}
                </p>
              </div>
              <FileCheck2 className="size-8 text-primary" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Mỗi thay đổi được đóng gói thành phiên bản mới, không ghi đè lịch sử cũ.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={makeDpp}
              disabled={!mainProduct || createVersion.isPending}
            >
              <FileCheck2 className="size-4" />
              {createVersion.isPending ? "Đang tạo..." : "Tạo DPP phiên bản mới"}
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
