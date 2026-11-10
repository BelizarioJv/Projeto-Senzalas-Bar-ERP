"use client";
import { isAxiosError } from "axios";
import { LoginForm } from "@/types/login";
import { useRouter } from "next/navigation";
import { useLoginForm } from "@/hooks/login/useLogin";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Beer } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation } = useLoginForm();

  const form = useForm<LoginForm>({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  function onSubmit(values: LoginForm) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Bem-vindo ao Senzalas Bar!");
        router.replace("/");
      },
      onError: (error: unknown) => {
        console.error("Erro ao fazer login", error);
        toast.error(
          (isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined) || "Não foi possível fazer login",
        );
      },
    });
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>

      {/* Gradient overlay subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-amber-950/10 pointer-events-none"></div>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card de login */}
        <Card className="border border-amber-600/30 bg-gradient-to-br from-gray-950 to-black shadow-2xl shadow-amber-600/10 rounded-2xl overflow-hidden">
          {/* Header com efeito */}
          <CardHeader className="space-y-8 pb-8 text-center bg-gradient-to-b from-amber-950/20 to-transparent pt-8">
            {/* Logo animado */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl">
                  <Beer size={56} className="text-white" />
                </div>
              </div>
            </div>

            {/* Títulos */}
            <div className="space-y-3">
              <h1 className="text-5xl font-serif font-bold">
                <span className="text-white">Senzalas</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  {" "}
                  Bar
                </span>
              </h1>
              <CardDescription
                className="text-gray-400 text-2xl
               font-light tracking-wide">
                Painel Administrativo
              </CardDescription>
            </div>
          </CardHeader>

          {/* Conteúdo do formulário */}
          <CardContent className="pt-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                {/* Campo Usuário */}
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-gray-300 block mb-3 tracking-wide">
                        USUÁRIO
                      </label>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="seu@usuario.com"
                            type="text"
                            disabled={loginMutation.isPending}
                            className="bg-gray-900/50 border border-amber-600/20 hover:border-amber-600/40 focus:border-amber-500 text-white placeholder:text-gray-600 rounded-lg focus:ring-amber-500/50 focus:ring-2 transition-all duration-300 py-3 px-4 backdrop-blur-sm"
                            {...field}
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-600/0 via-amber-600/0 to-amber-600/0 group-hover:from-amber-600/5 group-hover:via-amber-600/5 group-hover:to-amber-600/5 transition-all pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-2" />
                    </FormItem>
                  )}
                />

                {/* Campo Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-gray-300 tracking-wide">
                          SENHA
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-sm  text-amber-500/70 hover:text-amber-400 transition-colors font-medium">
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>

                      <div className="relative group">
                        <FormControl>
                          <Input
                            placeholder="••••••••••"
                            type={showPassword ? "text" : "password"}
                            disabled={loginMutation.isPending}
                            className="bg-gray-900/50 border border-amber-600/20 hover:border-amber-600/40 focus:border-amber-500 text-white placeholder:text-gray-600 rounded-lg focus:ring-amber-500/50 focus:ring-2 transition-all duration-300 py-3 px-4 pr-12 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>

                        {/* Ícone de senha */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                          {showPassword ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </div>

                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-600/0 via-amber-600/0 to-amber-600/0 group-hover:from-amber-600/5 group-hover:via-amber-600/5 group-hover:to-amber-600/5 transition-all pointer-events-none"></div>
                      </div>

                      <FormMessage className="text-red-400 text-xs mt-2" />
                    </FormItem>
                  )}
                />

                {/* Mensagem de erro geral */}
                {loginMutation.isError && (
                  <div className="bg-red-950/30 backdrop-blur-sm border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-lg flex items-start gap-3 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>
                      {loginMutation.error?.message || "Erro ao fazer login"}
                    </span>
                  </div>
                )}

                {/* Botão de submissão */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-0.5 mt-8">
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Beer className="w-5 h-5" />
                      Entrar
                    </span>
                  )}
                </Button>

                {/* Informação adicional */}
                <p className="text-center text-gray-500 text-xs pt-4">
                  Acesso restrito ao painel administrativo
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Decoração embaixo do card */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-amber-600/40 text-xs">
            <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
            <span>SENZALAS BAR APP</span>
            <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-gray-600 text-xs">
        <p>&copy; {new Date().getFullYear()} Familia Senzalas Bar</p>
      </div>
    </div>
  );
}
