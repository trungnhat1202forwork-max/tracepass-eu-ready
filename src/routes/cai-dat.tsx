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
import { useLang, setLang, useTranslations } from "@/lib/tracepass/i18n";

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
  const lang = useLang();
  const t = useTranslations();

  const alertRows: [string, boolean][] = [
    [t.settings.alertExpiring, true],
    [t.settings.alertMissing, true],
    [t.settings.alertDppReminder, true],
    [t.settings.alertWeeklyReport, false],
  ];

  return (
    <AppShell>
      <PageHeader title={t.settings.title} description={t.settings.description} />

      <div className="grid max-w-4xl gap-6">
        <div className="surface-card p-7">
          <h2 className="text-[19px] font-semibold">{t.settings.companyHeading}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.settings.companyName}</Label>
              <Input defaultValue={COMPANY} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.taxCode}</Label>
              <Input defaultValue="0301234567" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.mainMarket}</Label>
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
              <Label>{t.settings.language}</Label>
              <Select value={lang} onValueChange={(v) => setLang(v === "en" ? "en" : "vi")}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">{t.settings.languageVi}</SelectItem>
                  <SelectItem value="en">{t.settings.languageEn}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="surface-card p-7">
          <h2 className="text-[19px] font-semibold">{t.settings.alertsHeading}</h2>
          <div className="mt-5 space-y-4">
            {alertRows.map(([label, on]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <span className="text-[15px]">{label}</span>
                <Switch defaultChecked={on} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button size="lg" className="h-11" onClick={() => toast.success(t.settings.saved)}>
            {t.settings.save}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
