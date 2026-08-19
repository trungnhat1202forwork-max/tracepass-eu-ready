import { useSyncExternalStore } from "react";

export type Lang = "vi" | "en";

const STORAGE_KEY = "tracepass-lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "vi";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" ? "en" : "vi";
}

let lang: Lang = readInitialLang();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setLang(next: Lang) {
  lang = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return lang;
}

function getServerSnapshot(): Lang {
  return "vi";
}

export function useLang() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Translation dictionary.
// Scope: app chrome (sidebar/header nav), the Settings page, and the splash
// screen — i.e. everywhere the language switcher's effect should be visible
// right away. Deeper business data (product records, DPP fields, compliance
// checklists in src/lib/tracepass/data.ts) stays Vietnamese-only for now,
// since translating that regulatory content is a separate, larger task.
export const dict = {
  vi: {
    nav: {
      overview: "Tổng quan",
      products: "Sản phẩm",
      profile: "Hồ sơ",
      readiness: "Mức độ sẵn sàng",
      dpp: "DPP",
      tracking: "Theo dõi",
      settings: "Cài đặt",
    },
    shell: {
      tagline: "ToLocal, GoGlobal",
      company: "Doanh nghiệp",
      alertsAria: "Theo dõi & cảnh báo",
      backHome: "Về trang chủ",
    },
    splash: {
      tagline: "ToLocal, GoGlobal",
      subtitle: "Chuẩn hóa dữ liệu. Sẵn sàng cho thị trường EU.",
      cta: "Bắt đầu",
    },
    settings: {
      title: "Cài đặt",
      description: "Thông tin doanh nghiệp và tùy chọn cảnh báo.",
      companyHeading: "Doanh nghiệp",
      companyName: "Tên doanh nghiệp",
      taxCode: "Mã số thuế",
      mainMarket: "Thị trường chính",
      language: "Ngôn ngữ hiển thị",
      languageVi: "Tiếng Việt",
      languageEn: "Tiếng Anh",
      alertsHeading: "Cảnh báo",
      alertExpiring: "Cảnh báo hồ sơ sắp hết hạn",
      alertMissing: "Cảnh báo hồ sơ còn thiếu",
      alertDppReminder: "Nhắc cập nhật DPP",
      alertWeeklyReport: "Báo cáo tổng hợp hằng tuần",
      save: "Lưu thay đổi",
      saved: "Đã lưu cài đặt",
    },
  },
  en: {
    nav: {
      overview: "Overview",
      products: "Products",
      profile: "Profile",
      readiness: "Readiness",
      dpp: "DPP",
      tracking: "Tracking",
      settings: "Settings",
    },
    shell: {
      tagline: "ToLocal, GoGlobal",
      company: "Company",
      alertsAria: "Alerts & notifications",
      backHome: "Back to home",
    },
    splash: {
      tagline: "ToLocal, GoGlobal",
      subtitle: "Standardize your data. Get ready for the EU market.",
      cta: "Get started",
    },
    settings: {
      title: "Settings",
      description: "Company information and alert preferences.",
      companyHeading: "Company",
      companyName: "Company name",
      taxCode: "Tax code",
      mainMarket: "Primary market",
      language: "Display language",
      languageVi: "Vietnamese",
      languageEn: "English",
      alertsHeading: "Alerts",
      alertExpiring: "Alert when documents are about to expire",
      alertMissing: "Alert when documents are missing",
      alertDppReminder: "Remind me to update the DPP",
      alertWeeklyReport: "Weekly summary report",
      save: "Save changes",
      saved: "Settings saved",
    },
  },
} as const;

export function useTranslations() {
  const l = useLang();
  return dict[l];
}
