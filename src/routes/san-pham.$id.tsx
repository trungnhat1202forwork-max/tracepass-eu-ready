import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/tracepass/AppShell";
import { ReadinessBadge } from "@/components/tracepass/StatusBadge";
import { STEPS, Stepper, type StepKey } from "@/components/tracepass/Stepper";
import { SetupStep } from "@/components/tracepass/steps/SetupStep";
import { DocsStep } from "@/components/tracepass/steps/DocsStep";
import { AiReviewStep } from "@/components/tracepass/steps/AiReviewStep";
import { AssessmentStep } from "@/components/tracepass/steps/AssessmentStep";
import { DppStep } from "@/components/tracepass/steps/DppStep";
import { products } from "@/lib/tracepass/data";
import { useAppState } from "@/lib/tracepass/store";

type Search = { buoc: StepKey };

export const Route = createFileRoute("/san-pham/$id")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const buoc = String(search["buoc"] ?? "thiet-lap") as StepKey;
    return { buoc: STEPS.some((s) => s.key === buoc) ? buoc : "thiet-lap" };
  },
  head: () => ({
    meta: [
      { title: "Quy trình sản phẩm | TRACEPASS" },
      {
        name: "description",
        content:
          "Thiết lập, hồ sơ, xác nhận dữ liệu, đánh giá mức độ sẵn sàng và DPP cho từng sản phẩm.",
      },
      { property: "og:title", content: "Quy trình sản phẩm | TRACEPASS" },
      {
        property: "og:description",
        content: "Từ thiết lập sản phẩm đến DPP cho thị trường EU.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { buoc } = Route.useSearch();
  const navigate = useNavigate();
  const { aiProcessed, issuesResolved } = useAppState();
  const product = products.find((p) => p.id === id) ?? products[0]!;

  const completed: StepKey[] = ["thiet-lap"];
  if (aiProcessed) completed.push("ho-so", "xac-nhan");
  if (issuesResolved) completed.push("danh-gia");

  const go = (key: StepKey) => navigate({ to: "/san-pham/$id", params: { id }, search: { buoc: key } });

  return (
    <AppShell>
      <nav className="mb-4 flex items-center gap-1.5 text-[13.5px] text-muted-foreground">
        <Link to="/san-pham" className="hover:text-foreground">
          Sản phẩm
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] leading-tight font-bold">{product.name}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {product.market} · {product.country} / {product.batch} · {product.sku}
          </p>
        </div>
        <ReadinessBadge status={issuesResolved ? "ready" : product.readiness} />
      </div>

      <Stepper current={buoc} onSelect={go} completed={completed} />

      <div className="mt-6">
        {buoc === "thiet-lap" ? <SetupStep product={product} onNext={() => go("ho-so")} /> : null}
        {buoc === "ho-so" ? <DocsStep onNext={() => go("xac-nhan")} /> : null}
        {buoc === "xac-nhan" ? <AiReviewStep onNext={() => go("danh-gia")} /> : null}
        {buoc === "danh-gia" ? <AssessmentStep onNext={() => go("dpp")} /> : null}
        {buoc === "dpp" ? <DppStep /> : null}
      </div>
    </AppShell>
  );
}