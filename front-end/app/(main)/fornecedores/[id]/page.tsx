// app/produto/[id]/page.tsx
"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useGetSupplier } from "@/hooks/supplier/useGetSupplier";
import { useParams } from "next/navigation";
import { useDeleteSupplier } from "@/hooks/supplier/useDeleteSupplier";
import { AppDialog } from "@/components/layout/Dialog";
import { ArrowLeft } from "lucide-react";

export default function SupplierPage() {
  const router = useRouter();
  //Buscando fornecedor pelo Id
  const params = useParams();
  const id = params.id as string;
  const { data: supplier, isPending, error } = useGetSupplier(id);

  const deleteMutation = useDeleteSupplier();

  async function deleteSupplier(id: string) {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("fornecedor Excluido com sucesso");
      setTimeout(() => {
        router.push("/fornecedores");
      }, 1000);
    } catch (error) {
      console.error("Erro ao exluir fornecedor:", error);
      toast.error("Não foi possível excluir o fornecedor");
    }
  }

  //Verificaçoes
  if (isPending) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar fornecedor</p>;
  if (!supplier) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-card text-card-foreground border rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b">
          <Link
            href="/fornecedores"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <h1 className="text-4xl font-bold">{supplier.name}</h1>

          <p className="text-muted-foreground mt-2">
            Informações do fornecedor
          </p>
        </div>

        {/* Informações */}
        <div className="grid md:grid-cols-2 gap-6 p-8">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Nome</p>

            <p className="text-xl font-semibold">{supplier.name}</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Email</p>

            <p className="text-xl font-semibold">
              {supplier.email || "Não informado"}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Telefone</p>

            <p className="text-xl font-semibold">
              {supplier.phone || "Não informado"}
            </p>
          </div>
        </div>

        {/* Observações */}
        {supplier.observations && (
          <div className="p-8 border-t">
            <h2 className="font-semibold text-lg mb-3">Observações</h2>

            <p className="text-muted-foreground">{supplier.observations}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 p-8 border-t">
          <Link
            href={`/fornecedores/${id}/edit`}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-primary
              text-primary-foreground
              px-6
              py-2
              font-medium
              hover:opacity-90
              transition
            ">
            Editar Fornecedor
          </Link>

          <AppDialog
            titleButton="Excluir fornecedor"
            titleContent="Excluir fornecedor?"
            description={`Esta ação não pode ser desfeita. O fornecedor ${supplier.name} será removido.`}
            disabled={deleteMutation.isPending}
            onConfirm={() => deleteSupplier(id)}
          />
        </div>
      </div>
    </div>
  );
}
