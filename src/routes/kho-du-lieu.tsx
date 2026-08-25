import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Database, FileKey2, GitBranch, History, Search, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { SupplyNetwork } from "@/components/tracepass/SupplyNetwork";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useActivity, useDataRecords, useDppVersions } from "@/lib/tracepass/db";

export const Route = createFileRoute("/kho-du-lieu")({ head: () => ({ meta: [{ title: "Kho dữ liệu truy xuất | TRACEPASS" }] }), component: DataVault });
const keyLabels: Record<string, string> = { material_origin: "Nguồn gốc nguyên liệu", fiber_composition: "Thành phần sợi", facility: "Cơ sở sản xuất", certificate: "Chứng nhận", carbon_footprint: "Dấu chân carbon" };

function DataVault() {
  const records = useDataRecords().data ?? [];
  const activity = useActivity().data ?? [];
  const versions = useDppVersions().data ?? [];
  return <AppShell>
    <PageHeader title="Kho dữ liệu truy xuất" description="Mỗi dữ liệu đều có chủ sở hữu, nguồn bằng chứng, phiên bản, phạm vi tái sử dụng và lịch sử xác nhận." />
    <div className="grid gap-4 md:grid-cols-4">{[["Bản ghi dữ liệu",records.length,Database,"text-primary"],["Đã có bằng chứng",records.filter(r=>r.confirmation_status!=="declared").length,FileKey2,"text-emerald"],["Phiên bản DPP",versions.length,GitBranch,"text-info"],["Sự kiện audit",activity.length,History,"text-amber"]].map(([label,value,Icon,tone])=>{const I=Icon as typeof Database;return <div key={String(label)} className="surface-card p-5"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{String(label)}</p><I className={`size-5 ${tone}`}/></div><p className="mt-3 text-3xl font-bold">{Number(value)}</p></div>})}</div>
    <div className="mt-6 surface-card p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Bản đồ đường đi dữ liệu</h2><p className="text-sm text-muted-foreground">Từ nguồn nguyên liệu đến DPP công khai tại EU</p></div><Badge className="bg-emerald-soft text-emerald hover:bg-emerald-soft"><ShieldCheck className="mr-1 size-3.5"/>Chuỗi đã xác minh</Badge></div><SupplyNetwork/></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="surface-card overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="text-lg font-semibold">Data records</h2><p className="text-sm text-muted-foreground">Không ghi đè lịch sử — thay đổi tạo phiên bản mới</p></div><div className="relative"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"/><Input className="w-64 pl-9" placeholder="Tìm dữ liệu, nguồn..."/></div></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/60 text-left text-muted-foreground"><tr><th className="px-5 py-3">Trường dữ liệu</th><th className="px-4 py-3">Giá trị</th><th className="px-4 py-3">Nguồn</th><th className="px-4 py-3">Phiên bản</th><th className="px-5 py-3">Trạng thái</th></tr></thead><tbody>{records.map(r=><tr key={r.id} className="border-t hover:bg-muted/30"><td className="px-5 py-3 font-semibold">{keyLabels[r.data_key]??r.data_key}</td><td className="max-w-[240px] truncate px-4 py-3">{r.data_value}</td><td className="max-w-[210px] truncate px-4 py-3 text-muted-foreground">{r.source}</td><td className="px-4 py-3"><Badge variant="outline">v{r.version}</Badge></td><td className="px-5 py-3"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald"><CheckCircle2 className="size-4"/>Đã xác nhận</span></td></tr>)}{!records.length?<tr><td colSpan={5} className="p-10 text-center text-muted-foreground">Chưa có bản ghi dữ liệu.</td></tr>:null}</tbody></table></div></section>
      <aside className="surface-card overflow-hidden"><div className="border-b p-5"><h2 className="text-lg font-semibold">Audit timeline</h2><p className="text-sm text-muted-foreground">Dấu vết không thể thay bằng AI Agent đơn lẻ</p></div><div className="max-h-[520px] overflow-auto p-5"><div className="space-y-5">{activity.slice(0,12).map((a,i)=><div key={a.id} className="relative flex gap-3"><div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">{i===0?<Clock3 className="size-4"/>:<History className="size-4"/>}</div>{i<Math.min(activity.length,12)-1?<span className="absolute top-8 left-4 h-full w-px bg-border"/>:null}<div><p className="text-sm font-semibold">{a.action}</p><p className="mt-0.5 text-xs text-muted-foreground">{a.actor_name} · {new Date(a.created_at).toLocaleString("vi-VN")}</p></div></div>)}{!activity.length?<p className="text-center text-sm text-muted-foreground">Chưa có hoạt động.</p>:null}</div></div></aside>
    </div>
  </AppShell>;
}
