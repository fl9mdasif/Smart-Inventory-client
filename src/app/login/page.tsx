"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { loginUser } from "@/services/actions/loginUser";
import { storeUserInfo } from "@/services/auth.services";
import { loginSchema } from "@/utils/interface";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(values);

      if (res?.data?.accessToken) {
        toast.success(res?.message || "Login successful!");
        storeUserInfo({ accessToken: res?.data?.accessToken });
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res?.message || "Invalid credentials. Please try again.");
        toast.error(res?.message || "Login failed.");
      }
    } catch (err: any) {
      // console.error(err.message);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Gradients */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />

      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-teal-500/30">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500 ring-1 ring-teal-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel className="text-gray-300 font-medium">Email Address</FieldLabel>
              <div className="relative group/input">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 transition-colors group-focus-within/input:text-teal-500" />
                <Input
                  placeholder="admin@example.com"
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus-visible:ring-teal-500/50"
                  {...form.register("email")}
                  aria-invalid={!!form.formState.errors.email}
                />
              </div>
              <FieldError errors={[form.formState.errors.email]} className="text-red-400" />
            </Field>

            <Field>
              <FieldLabel className="text-gray-300 font-medium">Password</FieldLabel>
              <div className="relative group/input">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 transition-colors group-focus-within/input:text-teal-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus-visible:ring-teal-500/50"
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password}
                />
              </div>
              <FieldError errors={[form.formState.errors.password]} className="text-red-400" />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 font-semibold text-white hover:bg-teal-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm">
          <Link
            href="/register"
            className="text-gray-500 transition-colors hover:text-teal-400"
          >
            Don&apos;t have an account? Create one
          </Link>
          <div className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Md Asif Al Azad. All rights reserved.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
