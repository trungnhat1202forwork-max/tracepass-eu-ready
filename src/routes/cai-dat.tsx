import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY } from "@/lib/tracepass/data";

export const Route = createFileRoute("/cai-dat")({
  head: () => ({
    meta: [
      { title: "Cài đặt tổ chức | TRACEPASS" },
      {
        name: "description",
        content: "Thông tin doanh nghiệp, thị trường mục tiêu và tùy chọn cảnh báo trên TRACEPASS.",
      },
      { property: "og:title", content: "Cài đặt tổ chức | TRACEPASS" },
      {
        property: "og:description",
        content: "Thông tin doanh nghiệp, thị trường mục tiêu và tùy chọn cảnh báo.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Cài đặt" description="Thông tin doanh nghiệp và tùy chọn cảnh báo." />

      <div className="grid max-w-4xl gap-6">
        <div className="surface-card p-7">
          <h2 className="text-[19px] font-semibold">Doanh nghiệp</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tên doanh nghiệp</Label>
              <Input defaultValue={COMPANY} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Mã số thuế</Label>
              <Input defaultValue="0301234567" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Thị trường chính</Label>
              <Select defaultValue="EU">
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EU">EU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngôn ngữ hiển thị</Label>
              <Select defaultValue="vi">
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="surface-card p-7">
          <h2 className="text-[19px] font-semibold">Cảnh báo</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Cảnh báo hồ sơ sắp hết hạn", true],
              ["Cảnh báo hồ sơ còn thiếu", true],
              ["Nhắc cập nhật DPP", true],
              ["Báo cáo tổng hợp hằng tuần", false],
            ].map(([label, on]) => (
              <div
                key={label as string}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <span className="text-[15px]">{label as string}</span>
                <Switch defaultChecked={on as boolean} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button size="lg" className="h-11" onClick={() => toast.success("Đã lưu cài đặt")}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </AppShell>
  );
}