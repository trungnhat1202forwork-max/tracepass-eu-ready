import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/tracepass/auth";

export const Route = createFileRoute("/dat-lai-mat-khau")({
  head: () => ({ meta: [{ title: "Đặt lại mật khẩu | TRACEPASS" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Mật khẩu mới phải có tối thiểu 8 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setPending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      toast.error(error.message || "Không thể cập nhật mật khẩu");
      return;
    }

    setSuccess(true);
    toast.success("Đặt lại mật khẩu thành công!");
    await refreshProfile();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Link
          to="/dang-nhap"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại Đăng nhập
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Brandmark className="size-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">TRACEPASS</h1>
              <p className="text-xs text-muted-foreground">Khôi phục quyền truy cập B2B</p>
            </div>
          </div>

          {success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold">Mật khẩu đã được cập nhật!</h2>
                <p className="text-sm text-muted-foreground">
                  Bạn có thể tiếp tục truy cập không gian làm việc ngay bây giờ.
                </p>
              </div>
              <Button className="w-full h-11" onClick={() => void navigate({ to: "/dang-nhap" })}>
                Vào Workspace TRACEPASS
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <KeyRound className="size-5" />
                  <h2>Tạo mật khẩu mới</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vui lòng nhập mật khẩu an toàn mới cho tài khoản của bạn.
                </p>
              </div>

              <div className="grid gap-2 pt-2">
                <Label htmlFor="new-pwd">Mật khẩu mới (tối thiểu 8 ký tự)</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground select-none" />
                  <Input
                    id="new-pwd"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-pwd">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground select-none" />
                  <Input
                    id="confirm-pwd"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full mt-2"
                disabled={pending || password.length < 8 || password !== confirmPassword}
              >
                {pending ? "Đang cập nhật..." : "Lưu mật khẩu mới"}
              </Button>

              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <span>
                  Mật khẩu mới sẽ được mã hóa an toàn theo tiêu chuẩn bảo mật Supabase Auth.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
