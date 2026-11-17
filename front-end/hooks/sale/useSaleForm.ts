import { useForm, useFieldArray } from "react-hook-form";
import { useProducts } from "@/hooks/products/useProducts";
import { useCreateSale } from "@/hooks/sale/useCreateSale";
import { SaleFormData } from "@/types/sale";
import { toast } from "sonner";

export function useSaleForm() {
  const { productsQuery } = useProducts();
  const createSale = useCreateSale();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SaleFormData>({
    defaultValues: {
      payment: "PIX",
      products: [],
      discountPercent: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const products = watch("products") ?? [];

  const total =
    products.reduce((acc, item) => {
      const product = productsQuery.data?.data.find(
        (availableProduct) => availableProduct.id === item.productId,
      );
      return acc + item.quantity * Number(product?.salePrice ?? 0);
    }, 0) ?? 0;

  function handleAddProduct(selectedProductId: string, quantity: number) {
    const product = productsQuery.data?.data.find(
      (p) => p.id === Number(selectedProductId),
    );
    if (!product) return;

    const existingIndex = fields.findIndex(
      (item) => item.productId === product.id,
    );

    if (existingIndex >= 0) {
      const currentQty = watch(`products.${existingIndex}.quantity`);
      setValue(`products.${existingIndex}.quantity`, currentQty + quantity);
      return;
    }

    append({
      productId: product.id,
      quantity,
    });
  }

  async function onSubmit(data: SaleFormData) {
    try {
      await createSale.mutateAsync(data);
      alert("Venda cadastrada com sucesso!");
      toast.success("Venda cadastrada com sucesso!");
      reset();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message);
      } else {
        toast.error("Erro inesperado");
      }
    }
  }

  return {
    register,
    handleSubmit,
    fields,
    products,
    total,
    handleAddProduct,
    onSubmit,
    remove,
    errors,
    productsQuery,
    createSale,
  };
}
