import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, FileUp, LockKeyhole, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupplierRequests, useSuppliers, useSubmitSupplierResponse } from "@/lib/tracepass/db";

export const Route = createFileRoute("/cong-nha-cung-cap")({
  head: () => ({ meta: [{ title: "Cổng nhà cung cấp | TRACEPASS" }] }),
  component: SupplierPortal,
});

function SupplierPortal() {
  const suppliersQ = useSuppliers();
  const requestsQ = useSupplierRequests();
  const submit = useSubmitSupplierResponse();
  const suppliers = suppliersQ.data ?? [];
  const requests = requestsQ.data ?? [];
  const [supplierId, setSupplierId] = useState("");
  const pending = useMemo(() => requests.filter((r) => r.status === "pending" && (!supplierId || r.supplier_id === supplierId)), [requests, supplierId]);
  const [requestId, setRequestId] = useState("");
  const request = pending.find((r) => r.id === requestId) ?? pending[0];
  const [values, setValues] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState("GRS_Certificate_2026.pdf");
  const [permission, setPermission] = useState("same_material_12_months");

  useEffect(() => { if (request && request.id !== requestId) setRequestId(request.id); }, [request, requestId]);
  useEffect(() => { if (suppliers[0] && !supplierId) setSupplierId(suppliers[0].id); }, [supplierId, suppliers]);

  async function send() {
    if (!request) return;
    const supplier = suppliers.find((s) => s.id === request.supplier_id);
    const fields = (request.requested_fields ?? []).map((f) => ({ key: f.key, label: f.label, value: values[f.key] ?? suggested[f.key] ?? "", status: "supplier_confirmed" }));
    if (fields.some((f) => !f.value.trim())) { toast.error("Vui lòng điền đủ các trường bắt buộc"); return; }
    await submit.mutateAsync({ request, supplierName: supplier?.tracepass_organizations?.name ?? supplier?.supplier_code ?? "Supplier", fields, evidenceName: evidence || null, permissionScope: permission, productId: request.product_id });
    toast.success("Phản hồi đã gửi. SME sẽ nhận được dữ liệu để xác nhận.");
    setValues({});
  }

  return <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><div className="flex items-center gap-3"><Brandmark className="size-10" /><div><p className="font-bold">TRACEPASS</p><p className="text-xs text-muted-foreground">Cổng nhà cung cấp</p></div></div><Button asChild variant="ghost"><Link to="/nha-cung-cap"><ArrowLeft className="size-4" />Trở về SME workspace</Link></Button></div></header>
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Kết nối bảo mật</Badge><h1 className="text-3xl font-bold">Phản hồi yêu cầu dữ liệu</h1><p className="mt-2 max-w-2xl text-muted-foreground">Chỉ cung cấp đúng dữ liệu được yêu cầu. Bạn kiểm soát phạm vi tái sử dụng và mọi lần xác nhận đều được lưu lịch sử.</p></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4 text-emerald" />Dữ liệu chỉ chia sẻ với Vision Textile JSC</div></div>
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="surface-card h-fit p-5"><Label>Đang xem với tư cách</Label><Select value={supplierId} onValueChange={(v) => { setSupplierId(v); setRequestId(""); }}><SelectTrigger className="mt-2"><SelectValue placeholder="Chọn supplier" /></SelectTrigger><SelectContent>{suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.tracepass_organizations?.name ?? s.supplier_code}</SelectItem>)}</SelectContent></Select><div className="mt-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Yêu cầu cần xử lý</h2><Badge variant="outline">{pending.length}</Badge></div><div className="mt-3 space-y-2">{pending.map((r) => <button key={r.id} onClick={() => setRequestId(r.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${request?.id === r.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}><p className="text-sm font-semibold">{r.title}</p><p className="mt-1 text-xs text-muted-foreground">Hạn {r.due_date ?? "—"}</p></button>)}{pending.length === 0 ? <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 size-6 text-emerald" />Không còn yêu cầu đang chờ</div> : null}</div></div></aside>
        <section className="surface-card overflow-hidden">{request ? <><div className="border-b border-border p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{request.title}</h2><p className="mt-1 text-sm text-muted-foreground">Vision Textile JSC · Hạn phản hồi {request.due_date ?? "—"}</p></div><Badge variant="outline" className="border-amber/30 bg-amber/10 text-amber">Đang chờ phản hồi</Badge></div><div className="mt-4 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"><Sparkles className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm"><strong>AI hỗ trợ điền:</strong> TRACEPASS đã gợi ý dữ liệu từ hồ sơ gần nhất. Bạn cần kiểm tra và xác nhận trước khi gửi.</p></div></div><div className="grid gap-5 p-6">{(request.requested_fields ?? []).map((f) => <div key={f.key} className="grid gap-2"><Label>{f.label}{f.required ? <span className="text-destructive"> *</span> : null}</Label><Input value={values[f.key] ?? suggested[f.key] ?? ""} onChange={(e) => setValues((x) => ({ ...x, [f.key]: e.target.value }))} /><p className="text-xs text-muted-foreground">Gợi ý từ dữ liệu đã xác nhận gần nhất · Vui lòng kiểm tra</p></div>)}<div className="grid gap-2"><Label>Bằng chứng đính kèm</Label><div className="flex gap-2"><Input value={evidence} onChange={(e) => setEvidence(e.target.value)} /><Button variant="outline"><FileUp className="size-4" />Chọn tệp</Button></div></div><div className="grid gap-2"><Label>Cho phép tái sử dụng dữ liệu</Label><Select value={permission} onValueChange={setPermission}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="request_only">Chỉ cho yêu cầu này</SelectItem><SelectItem value="same_material_12_months">Cùng nguyên liệu trong 12 tháng</SelectItem><SelectItem value="same_supplier_until_change">Các lô từ supplier này đến khi có thay đổi</SelectItem></SelectContent></Select></div></div><div className="flex items-center justify-between gap-4 border-t border-border bg-muted/30 px-6 py-4"><p className="text-xs text-muted-foreground">Bằng việc gửi, bạn xác nhận dữ liệu trên là chính xác tại thời điểm hiện tại.</p><Button onClick={send} disabled={submit.isPending}><Send className="size-4" />{submit.isPending ? "Đang gửi..." : "Gửi phản hồi"}</Button></div></> : <div className="flex min-h-[420px] items-center justify-center p-8 text-center text-muted-foreground"><div><CheckCircle2 className="mx-auto mb-3 size-10 text-emerald" /><p className="font-semibold text-foreground">Không có yêu cầu cần phản hồi</p><p className="mt-1 text-sm">Chọn nhà cung cấp khác hoặc quay lại SME workspace để tạo yêu cầu mới.</p></div></div>}</section>
      </div>
    </main>
  </div>;
}

const suggested: Record<string, string> = {
  material_origin: "Cotton — Gujarat, India",
  fiber_composition: "95% Cotton / 5% Elastane",
  facility: "GreenWeave Spinning Mill — Ahmedabad",
  certificate: "GRS 4.0 — CU-112233",
};
