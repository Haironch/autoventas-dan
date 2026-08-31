import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { listVehicles } from "@/lib/vehicle-store";
import { listProducts } from "@/lib/product-store";
import { listAccessories } from "@/lib/accessory-store";

const STATIC_ROUTES = [
  "",
  "/catalogo",
  "/comparar",
  "/repuestos",
  "/accesorios",
  "/importar",
  "/vender",
  "/agendar",
  "/fallas",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, products, accessories] = await Promise.all([
    listVehicles(),
    listProducts(),
    listAccessories(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${SITE_URL}/catalogo/${v.id}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/repuestos/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const accessoryEntries: MetadataRoute.Sitemap = accessories.map((a) => ({
    url: `${SITE_URL}/accesorios/${a.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...vehicleEntries, ...productEntries, ...accessoryEntries];
}
