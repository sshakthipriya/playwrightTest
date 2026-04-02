"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Mail, Lock, User, Building2 } from "lucide-react";

export function AuthPageContent({ mode = "login" }: { mode?: "login" | "register" }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "buyer", phone: "", business_name: "" });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(form.email, form.password);
        toast.success(`Welcome back, ${user.name}!`);
        const dest = user.role === "admin" ? "/dashboard/admin" : user.role === "seller" || user.role === "dealer" ? "/dashboard/seller" : "/";
        router.push(dest);
      } else {
        const user = await register(form);
        toast.success(`Welcome to FieldExchange, ${user.name}!`);
        router.push("/");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" data-testid="auth-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1B4D3E] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-base" style={{fontFamily:"Manrope"}}>FE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"Manrope"}}>
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? "Sign in to access your equipment marketplace" : "Join the trusted equipment marketplace"}
          </p>
        </div>

        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs font-semibold text-blue-800 mb-1.5">Demo Accounts</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Admin: admin@greenway.com / admin123</p>
              <p>Seller: seller@greenway.com / seller123</p>
              <p>Dealer: dealer@greenway.com / dealer123</p>
              <p>Buyer: buyer@greenway.com / buyer123</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.name} onChange={(e: any) => update("name", e.target.value)}
                      placeholder="Your full name" className="pl-10" required data-testid="register-name" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">I want to</Label>
                  <RadioGroup value={form.role} onValueChange={(v: string) => update("role", v)} className="grid grid-cols-3 gap-2" data-testid="role-select">
                    {[{v:"buyer",l:"Buy"},{v:"seller",l:"Sell"},{v:"dealer",l:"Deal"}].map(r => (
                      <Label key={r.v} htmlFor={r.v}
                        className={`flex items-center justify-center gap-1.5 p-2.5 rounded-md border cursor-pointer text-sm transition-colors ${
                          form.role === r.v ? "border-[#1B4D3E] bg-[#1B4D3E]/5 text-[#1B4D3E] font-medium" : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}>
                        <RadioGroupItem value={r.v} id={r.v} className="sr-only" />
                        {r.l}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type="email" value={form.email} onChange={(e: any) => update("email", e.target.value)}
                  placeholder="you@example.com" className="pl-10" required data-testid="auth-email" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type="password" value={form.password} onChange={(e: any) => update("password", e.target.value)}
                  placeholder="Your password" className="pl-10" required data-testid="auth-password" />
              </div>
            </div>

            {!isLogin && (form.role === "seller" || form.role === "dealer") && (
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Business Name</Label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.business_name} onChange={(e: any) => update("business_name", e.target.value)}
                    placeholder="Optional" className="pl-10" data-testid="register-business" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading}
            className="w-full mt-6 bg-[#1B4D3E] hover:bg-[#143d30] text-white font-semibold h-11"
            data-testid="auth-submit-btn">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>

          <Separator className="my-5" />

          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={() => setIsLogin(!isLogin)}
              className="text-[#1B4D3E] font-semibold ml-1 hover:underline" data-testid="auth-toggle">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
