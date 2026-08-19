import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, countries } from "@/lib/tracepass/data";

export const Route = createFileRoute("/san-pham/moi")({
  head: () => ({
    meta: [
      { title: "Tạo sản phẩm mới | TRACEPASS" },
      {
        name: "description",
        content: "Thiết lập sản phẩm dệt may và tạo checklist hồ sơ cho thị trường EU.",
      },
      { property: "og:title", content: "Tạo sản phẩm mới | TRACEPASS" },
      {
        property: "og:description",
        content: "Thiết lập sản phẩm và tạo checklist hồ sơ cho thị trường EU.",
      },
    ],
  }),
  component: NewProduct,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[14px] font-medium">{label}</Label>
      {children}
    </div>
  );
}

function NewProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("Cotton Basic T-shirt");
  const [sku, setSku] = useState("TS-COT-001");
  const [batch, setBatch] = useState("BATCH-0826");
  const [category, setCategory] = useState(categories[0]!);
  const [country, setCountry] = useState(countries[0]!);

  return (
    <AppShell>
      <PageHeader
        title="Tạo sản phẩm"
        description="Thiết lập thông tin cơ bản để TRACEPASS sinh checklist hồ sơ tương ứng."
      />

      <form
        className="surface-card max-w-4xl p-7"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/san-pham/$id", params: { id: "ts-cot-001" }, search: { buoc: "ho-so" } });
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tên sản phẩm">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </Field>
          <Field label="SKU / Mã kiểu">
            <Input value={sku} onChange={(e) => setSku(e.target.value)} className="h-11" />
          </Field>
          <Field label="Danh mục">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Lô sản xuất">
            <Input value={batch} onChange={(e) => setBatch(e.target.value)} className="h-11" />
          </Field>
          <Field label="Thị trường">
            <Select defaultValue="EU">
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EU">EU</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quốc gia mục tiêu">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="GTIN (tùy chọn)">
            <Input placeholder="Nhập mã GTIN" className="h-11" />
          </Field>
          <Field label="Commodity Code (tùy chọn)">
            <Input placeholder="Ví dụ: 6109 10 00" className="h-11" />
          </Field>
          <Field label="Ngày sản xuất (tùy chọn)">
            <Input type="date" className="h-11" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Mô tả (tùy chọn)">
              <Textarea rows={3} placeholder="Mô tả ngắn về sản phẩm" />
            </Field>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" className="h-11">
            Tạo Checklist
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.success("Đã lưu nháp sản phẩm")}
          >
            Lưu nháp
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link to="/san-pham">Hủy</Link>
          </Button>
        </div>
      </form>
    </AppShell>
  );
}