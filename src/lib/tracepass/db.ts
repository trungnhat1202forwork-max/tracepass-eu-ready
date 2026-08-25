import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Org = {
  id: string;
  name: string;
  role: string;
  country: string | null;
  contact_name: string | null;
  contact_email: string | null;
};

export type DbProduct = {
  id: string;
  sme_org_id: string;
  name: string;
  sku: string;
  category: string | null;
  market: string | null;
  target_country: string | null;
  material_summary: string | null;
  readiness: string;
  dpp_status: string;
  updated_at: string;
};

export type DbSupplier = {
  id: string;
  org_id: string;
  supplier_code: string;
  supplier_type: string;
  status: string;
  tracepass_organizations?: { name: string; country: string | null; contact_email: string | null };
};

export type DbRequirement = {
  id: string;
  code: string;
  title: string;
  source: string;
  category: string;
  lifecycle: string;
  effective_on: string | null;
  updated_at: string;
};

export type DbProductRequirement = {
  id: string;
  product_id: string;
  requirement_id: string;
  status: string;
  field_name: string;
  supplier_id: string | null;
  evidence_status: string;
  notes: string | null;
};

export type DbDocument = {
  id: string;
  product_id: string | null;
  supplier_id: string | null;
  document_type: string;
  name: string;
  status: string;
  version: string | null;
  expires_at: string | null;
  source: string | null;
  extracted_json: Record<string, unknown> | null;
  updated_at: string;
};

export type RequestedField = { key: string; label: string; required?: boolean };

export type DbSupplierRequest = {
  id: string;
  product_id: string;
  supplier_id: string;
  title: string;
  due_date: string | null;
  status: string;
  requested_fields: RequestedField[] | null;
  reuse_context: {
    reusable_fields?: number;
    reconfirm_fields?: number;
    new_fields?: number;
  } | null;
  responded_at: string | null;
  accepted_at: string | null;
  created_at: string;
};

export type DbSupplierResponse = {
  id: string;
  request_id: string;
  field_key: string;
  value: string | null;
  evidence_name: string | null;
  status: string;
  confirmed_at: string | null;
  created_at: string;
};

export type DbDataRecord = {
  id: string;
  product_id: string | null;
  supplier_id: string | null;
  data_key: string;
  data_value: string;
  source: string | null;
  version: number;
  valid_from: string | null;
  valid_to: string | null;
  confirmation_status: string;
  reuse_scope: string;
  share_permission: string;
  last_confirmed_at: string | null;
  created_at: string;
};

export type DbDppVersion = {
  id: string;
  product_id: string;
  version: number;
  status: string;
  snapshot: Record<string, unknown> | null;
  published_at: string | null;
  created_at: string;
};

export type DbActivity = {
  id: string;
  actor_type: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type DbProductSupplier = {
  id: string;
  product_id: string;
  supplier_id: string;
  material: string | null;
  stage: string | null;
  is_primary: boolean;
};

async function select<T>(table: string, query: string, order?: string): Promise<T[]> {
  let q = supabase.from(table).select(query);
  if (order) q = q.order(order, { ascending: false });
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as T[];
}

const k = (name: string) => ["tracepass", name] as const;

export const useOrgs = () =>
  useQuery({ queryKey: k("orgs"), queryFn: () => select<Org>("tracepass_organizations", "*") });

export const useProducts = () =>
  useQuery({ queryKey: k("products"), queryFn: () => select<DbProduct>("tracepass_products", "*") });

export const useSuppliers = () =>
  useQuery({
    queryKey: k("suppliers"),
    queryFn: () =>
      select<DbSupplier>(
        "tracepass_suppliers",
        "*, tracepass_organizations(name, country, contact_email)",
      ),
  });

export const useRequirements = () =>
  useQuery({
    queryKey: k("requirements"),
    queryFn: () => select<DbRequirement>("tracepass_requirements", "*"),
  });

export const useProductRequirements = () =>
  useQuery({
    queryKey: k("product-requirements"),
    queryFn: () => select<DbProductRequirement>("tracepass_product_requirements", "*"),
  });

export const useDocuments = () =>
  useQuery({
    queryKey: k("documents"),
    queryFn: () => select<DbDocument>("tracepass_documents", "*"),
  });

export const useSupplierRequests = () =>
  useQuery({
    queryKey: k("supplier-requests"),
    queryFn: () =>
      select<DbSupplierRequest>("tracepass_supplier_requests", "*", "created_at"),
  });

export const useSupplierResponses = () =>
  useQuery({
    queryKey: k("supplier-responses"),
    queryFn: () =>
      select<DbSupplierResponse>("tracepass_supplier_responses", "*", "created_at"),
  });

export const useDataRecords = () =>
  useQuery({
    queryKey: k("data-records"),
    queryFn: () => select<DbDataRecord>("tracepass_data_records", "*"),
  });

export const useDppVersions = () =>
  useQuery({
    queryKey: k("dpp-versions"),
    queryFn: () => select<DbDppVersion>("tracepass_dpp_versions", "*", "created_at"),
  });

export const useActivity = () =>
  useQuery({
    queryKey: k("activity"),
    queryFn: () => select<DbActivity>("tracepass_activity_log", "*", "created_at"),
  });

export const useProductSuppliers = () =>
  useQuery({
    queryKey: k("product-suppliers"),
    queryFn: () => select<DbProductSupplier>("tracepass_product_suppliers", "*"),
  });

export async function logActivity(entry: {
  actor_type: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabase.from("tracepass_activity_log").insert({
    ...entry,
    metadata: entry.metadata ?? {},
  });
  if (error) throw new Error(error.message);
}

/** Supplier gửi phản hồi cho một yêu cầu dữ liệu. */
export function useSubmitSupplierResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      request: DbSupplierRequest;
      supplierName: string;
      fields: { key: string; label: string; value: string; status: string }[];
      evidenceName?: string | null;
      permissionScope: string;
      productId: string;
    }) => {
      const now = new Date().toISOString();
      const rows = input.fields.map((f) => ({
        request_id: input.request.id,
        field_key: f.key,
        value: f.value,
        evidence_name: input.evidenceName ?? null,
        status: f.status,
        confirmed_at: now,
      }));
      if (rows.length) {
        const { error } = await supabase.from("tracepass_supplier_responses").insert(rows);
        if (error) throw new Error(error.message);
      }

      const { error: upErr } = await supabase
        .from("tracepass_supplier_requests")
        .update({ status: "responded", responded_at: now })
        .eq("id", input.request.id);
      if (upErr) throw new Error(upErr.message);

      const records = input.fields
        .filter((f) => f.value.trim().length > 0)
        .map((f) => ({
          product_id: input.productId,
          supplier_id: input.request.supplier_id,
          data_key: f.key,
          data_value: f.value,
          source: input.evidenceName ?? `Phản hồi supplier — ${input.supplierName}`,
          version: 1,
          valid_from: now.slice(0, 10),
          confirmation_status: input.evidenceName ? "evidence_attached" : "declared",
          reuse_scope: input.permissionScope,
          share_permission: "sme_authorized",
          last_confirmed_at: now,
        }));
      if (records.length) {
        const { error } = await supabase.from("tracepass_data_records").insert(records);
        if (error) throw new Error(error.message);
      }

      await logActivity({
        actor_type: "supplier",
        actor_name: input.supplierName,
        action: `Phản hồi yêu cầu: ${input.request.title}`,
        entity_type: "supplier_request",
        entity_id: input.request.id,
        metadata: { fields: input.fields.length, evidence: input.evidenceName ?? null },
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tracepass"] });
    },
  });
}

/** SME gửi yêu cầu bổ sung dữ liệu tới supplier. */
export function useCreateSupplierRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      productId: string;
      supplierId: string;
      supplierName: string;
      title: string;
      dueDate: string;
      fields: RequestedField[];
      reuse: { reusable_fields: number; reconfirm_fields: number; new_fields: number };
    }) => {
      const { data, error } = await supabase
        .from("tracepass_supplier_requests")
        .insert({
          product_id: input.productId,
          supplier_id: input.supplierId,
          title: input.title,
          due_date: input.dueDate,
          status: "pending",
          requested_fields: input.fields,
          reuse_context: input.reuse,
        })
        .select("*")
        .single();
      if (error) throw new Error(error.message);

      await logActivity({
        actor_type: "sme",
        actor_name: "Vision Textile JSC",
        action: `Gửi yêu cầu dữ liệu: ${input.title}`,
        entity_type: "supplier_request",
        entity_id: (data as { id: string }).id,
        metadata: { supplier: input.supplierName, fields: input.fields.length },
      });
      return data as DbSupplierRequest;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tracepass"] });
    },
  });
}

/** SME chấp nhận dữ liệu supplier gửi lên. */
export function useAcceptRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: DbSupplierRequest) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("tracepass_supplier_requests")
        .update({ status: "accepted", accepted_at: now })
        .eq("id", request.id);
      if (error) throw new Error(error.message);
      await logActivity({
        actor_type: "sme",
        actor_name: "Vision Textile JSC",
        action: `Xác nhận dữ liệu từ phản hồi: ${request.title}`,
        entity_type: "supplier_request",
        entity_id: request.id,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tracepass"] });
    },
  });
}

/** Tạo phiên bản DPP mới từ dữ liệu hiện có. */
export function useCreateDppVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      productId: string;
      nextVersion: number;
      snapshot: Record<string, unknown>;
    }) => {
      const { error } = await supabase.from("tracepass_dpp_versions").insert({
        product_id: input.productId,
        version: input.nextVersion,
        status: "draft",
        snapshot: input.snapshot,
      });
      if (error) throw new Error(error.message);
      await logActivity({
        actor_type: "sme",
        actor_name: "Vision Textile JSC",
        action: `Tạo DPP phiên bản v${input.nextVersion}`,
        entity_type: "dpp_version",
        entity_id: input.productId,
        metadata: { version: input.nextVersion },
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tracepass"] });
    },
  });
}

export async function logAiRun(input: {
  action: string;
  status: string;
  productId?: string | null;
  resultJson?: Record<string, unknown>;
}) {
  await supabase.from("tracepass_ai_runs").insert({
    action: input.action,
    status: input.status,
    product_id: input.productId ?? null,
    result_json: input.resultJson ?? {},
  });
}

export type AiComplianceResult = {
  model: string;
  mode: string;
  coverage: number;
  confidence: number;
  matches: Array<{ code: string; title: string; source: string; similarity: number; relevant: boolean }>;
  gaps: Array<{ code: string; title: string; reason: string }>;
  humanReviewRequired: boolean;
  analyzedAt: string;
};

export function useAiComplianceAnalysis() {
  return useMutation({
    mutationFn: async (input: { text: string; productId?: string | null }) => {
      const { data, error } = await supabase.functions.invoke<AiComplianceResult>(
        "tracepass-ai-analyze",
        { body: input },
      );
      if (error) throw new Error(error.message);
      if (!data) throw new Error("AI không trả về kết quả");
      return data;
    },
  });
}
