import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, KeyRound, Loader2, LogOut, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/tracepass/auth";
import { useWorkspaceRole } from "@/lib/tracepass/role";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Quản trị hệ thống | TRACEPASS" }] }),
  component: AdminPage,
});

type AccessState = "checking" | "signed-out" | "denied" | "allowed";

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { setRole } = useWorkspaceRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [access, setAccess] = useState<AccessState>("checking");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAccess("signed-out");
      return;
    }

    let active = true;
    setAccess("checking");
    void supabase
      .from("tracepass_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Không thể kiểm tra quyền quản trị", error);
          setAccess("denied");
          return;
        }
        setAccess(data ? "allowed" : "denied");
      });

    return () => {
      active = false;
    };
  }, [loading, user]);

  async function handleSignIn() {
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      toast.error("Không thể đăng nhập. Hãy kiểm tra email, mật khẩu và xác nhận email tài khoản.");
      return;
    }
    toast.success("Đăng nhập thành công. Đang kiểm tra quyền quản trị.");
  }

  function enterWorkspace(role: "sme" | "supplier") {
    setRole(role);
    void navigate({ to: role === "sme" ? "/tong-quan" : "/cong-nha-cung-cap" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <section className="w-full max-w-lg rounded-3xl border bg-background p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <Brandmark className="size-12" />
          <div>
            <p className="font-extrabold tracking-tight">TRACEPASS</p>
            <p className="text-sm text-muted-foreground">Quản trị hệ thống an toàn</p>
          </div>
        </div>

        {(loading || access === "checking") && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-semibold">Đang xác minh phiên đăng nhập và quyền quản trị…</p>
          </div>
        )}

        {!loading && access === "signed-out" && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl bg-muted p-4">
              <div className="flex items-center gap-2 font-semibold">
                <KeyRound className="size-5 text-primary" />
                Đăng nhập tài khoản quản trị
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Quyền được kiểm tra bằng Supabase. Trang này không sử dụng hoặc hiển thị mật
                khẩu mặc định.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Mật khẩu</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button
              className="h-11 w-full"
              disabled={pending || !email || !password}
              onClick={handleSignIn}
            >
              {pending ? "Đang đăng nhập…" : "Đăng nhập và xác minh quyền"}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        )}

        {!loading && access === "denied" && (
          <div className="mt-8 space-y-5 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldCheck className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Không có quyền quản trị</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Tài khoản đã đăng nhập nhưng chưa được cấp quyền trong hệ thống TRACEPASS.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => void signOut()}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>
        )}

        {!loading && access === "allowed" && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="size-5" />
                Đã xác minh quản trị viên
              </div>
              <p className="mt-1 text-sm">Chọn không gian cần kiểm tra.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="h-20 flex-col" onClick={() => enterWorkspace("sme")}>
                <Building2 className="size-5" />
                Doanh nghiệp dệt may
              </Button>
              <Button
                className="h-20 flex-col"
                variant="secondary"
                onClick={() => enterWorkspace("supplier")}
              >
                <Truck className="size-5" />
                Nhà cung cấp
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => void signOut()}>
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
