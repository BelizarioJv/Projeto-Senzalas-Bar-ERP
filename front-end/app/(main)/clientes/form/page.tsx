"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ICreateCustomerInput } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useCreateCustomer } from "@/hooks/customer/useCreateCustomer";

export default function CreateCustomerPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateCustomerInput>();

  const createCustomer = useCreateCustomer();

  async function onSubmit(data: ICreateCustomerInput) {
    try {
      // Executa a mutação enviando os dados validados do formulário
      await createCustomer.mutateAsync(data);

      toast.success("Cliente cadastrado com sucesso!");
      router.replace("/clientes");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Não foi possível cadastrar o cliente. Tente novamente.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Card para adicionar cliente */}
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <div className="flex gap-4 items-center">
            <CardTitle className="text-2xl font-extrabold">
              Adicionar Cliente
            </CardTitle>
            <UserPlus className="text-accent" size={28} />
          </div>
        </CardHeader>

        <CardContent>
          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                {...register("name", {
                  required: "O nome do cliente é obrigatório",
                  minLength: {
                    value: 3,
                    message: "O nome deve conter pelo menos 3 caracteres",
                  },
                })}
              />

              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="Ex: 31999998888"
                {...register("phone")}
              />
            </div>

            {/* E-mail */}
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: cliente@email.com"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Insira um endereço de e-mail válido",
                  },
                })}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-accent-foreground hover:bg-accent transition font-semibold"
              disabled={createCustomer.isPending}>
              {createCustomer.isPending ? "Salvando..." : "Adicionar Cliente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
