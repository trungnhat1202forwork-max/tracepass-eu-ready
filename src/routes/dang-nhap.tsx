import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Network,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dang-nhap")({
  head: () => ({ meta: [{ title: "Đăng nhập B2B | TRACEPASS" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  async function signIn() {
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Đăng nhập thành công");
    void navigate({ to: "/tong-quan" });
  }
  async function signUp() {
    setPending(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dang-nhap`,
      },
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Kiểm tra email để xác nhận tài khoản");
  }
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_32%),radial-gradient(circle_at_80%_75%,var(--emerald)_0,transparent_35%)]" />
        <Link to="/" className="relative flex items-center gap-3">
          <Brandmark className="size-11" />
          <div>
            <p className="font-extrabold">TRACEPASS</p>
            <p className="text-xs opacity-70">B2B Compliance Network</p>
          </div>
        </Link>
        <div className="relative my-auto max-w-lg">
          <h1 className="text-4xl leading-tight font-extrabold">
            Một tài khoản. Hai phía của chuỗi dữ liệu.
          </h1>
          <p className="mt-5 text-lg leading-8 opacity-75">
            SME và Supplier làm việc trên cùng dữ liệu, nhưng chỉ nhìn thấy đúng phần được cấp
            quyền.
          </p>
          <div className="mt-8 space-y-4">
            {[
              [Building2, "Workspace theo tổ chức"],
              [Network, "Kết nối đối tác có kiểm soát"],
              [ShieldCheck, "RLS bảo vệ dữ liệu từng doanh nghiệp"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Building2;
              return (
                <div key={String(text)} className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <I className="size-5" />
                  </span>
                  <span className="font-semibold">{String(text)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Về trang chủ
          </Link>
          <div className="mb-7">
            <div className="flex items-center gap-3 lg:hidden">
              <Brandmark className="size-10" />
              <strong>TRACEPASS</strong>
            </div>
            <h2 className="mt-5 text-3xl font-bold">Truy cập workspace</h2>
            <p className="mt-2 text-muted-foreground">
              Đăng nhập để gửi yêu cầu, xác nhận dữ liệu và phát hành DPP.
            </p>
          </div>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Tạo tài khoản</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-5 space-y-4">
              <div className="grid gap-2">
                <Label>Email công việc</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Mật khẩu</Label>
                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="h-11 w-full"
                onClick={signIn}
                disabled={pending || !email || !password}
              >
                {pending ? "Đang đăng nhập..." : "Đăng nhập an toàn"}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="mt-5 space-y-4">
              <div className="grid gap-2">
                <Label>Họ và tên</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Email công việc</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Mật khẩu (tối thiểu 8 ký tự)</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="h-11 w-full"
                onClick={signUp}
                disabled={pending || !name || !email || password.length < 8}
              >
                Tạo tài khoản B2B
              </Button>
              <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" />
                Sau khi xác nhận email, quản trị viên sẽ gán bạn vào đúng tổ chức SME hoặc Supplier.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
