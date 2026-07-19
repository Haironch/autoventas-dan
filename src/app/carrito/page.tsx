import { listProducts } from "@/lib/product-store";
import { listAccessories } from "@/lib/accessory-store";
import { CarritoClient } from "./CarritoClient";

export default async function CarritoPage() {
  const [products, accessories] = await Promise.all([listProducts(), listAccessories()]);
  return <CarritoClient catalog={[...products, ...accessories]} />;
}
