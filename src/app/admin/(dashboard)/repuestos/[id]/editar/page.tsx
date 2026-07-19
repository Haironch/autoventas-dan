import { notFound } from "next/navigation";
import { ProductForm } from "../../ProductForm";
import { updateProductAction } from "../../actions";
import { getProductById } from "@/lib/product-store";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  async function action(formData: FormData) {
    "use server";
    await updateProductAction(id, formData);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Editar {product.name}</h1>
      <ProductForm product={product} action={action} submitLabel="Guardar cambios" />
    </div>
  );
}
