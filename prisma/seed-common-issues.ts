process.loadEnvFile(".env");

const issues = [
  {
    brand: "Toyota",
    model: "Corolla",
    yearFrom: 2014,
    yearTo: 2019,
    title: "Ruido en suspensión delantera",
    description:
      "En algunos casos los bujes de la suspensión delantera se desgastan antes de lo esperado, generando ruido al pasar sobre baches. Se recomienda revisión cada 40,000 km.",
    severity: "LEVE" as const,
    estimatedRepairCost: 1200,
  },
  {
    brand: "Honda",
    model: "CR-V",
    yearFrom: 2017,
    yearTo: 2021,
    title: "Dilución de aceite en motor turbo 1.5T",
    description:
      "En clima frío o trayectos cortos frecuentes, el combustible puede diluir el aceite del motor. Se recomienda respetar el intervalo de cambio de aceite y no espaciarlo más de lo indicado por el fabricante.",
    severity: "MODERADA" as const,
    estimatedRepairCost: null,
  },
  {
    brand: "Nissan",
    model: "Sentra",
    yearFrom: 2013,
    yearTo: 2019,
    title: "Desgaste prematuro de la transmisión CVT",
    description:
      "Es uno de los reclamos más reportados en esta generación. Antes de comprar, revisa el historial de mantenimiento de la transmisión y realiza una prueba de manejo prolongada buscando tirones o sobrecalentamiento.",
    severity: "GRAVE" as const,
    estimatedRepairCost: 18000,
  },
  {
    brand: "Kia",
    model: "Rio",
    yearFrom: 2018,
    yearTo: 2022,
    title: "Falla en bomba de combustible",
    description:
      "Algunos propietarios reportan fallas de arranque intermitentes asociadas a la bomba de combustible. Revisar si el vehículo tuvo algún llamado a revisión (recall) del fabricante.",
    severity: "MODERADA" as const,
    estimatedRepairCost: 2500,
  },
  {
    brand: "Mazda",
    model: "3",
    yearFrom: 2017,
    yearTo: 2021,
    title: "Corrosión prematura en discos de freno traseros",
    description:
      "En climas húmedos, los discos traseros pueden oxidarse más rápido de lo normal si el vehículo pasa periodos largos sin usarse. No suele afectar el frenado si se atiende a tiempo.",
    severity: "LEVE" as const,
    estimatedRepairCost: 900,
  },
  {
    brand: "BMW",
    model: "X3",
    yearFrom: 2018,
    yearTo: 2022,
    title: "Fugas de aceite en válvulas de admisión (motor turbo)",
    description:
      "Como en otros modelos con motor turbo de esta marca, pueden presentarse fugas menores de aceite en el múltiple de admisión. El mantenimiento en vehículos premium tiende a ser más costoso; considera esto en tu presupuesto.",
    severity: "MODERADA" as const,
    estimatedRepairCost: 4500,
  },
];

async function main() {
  const { prisma } = await import("../src/lib/prisma");
  await prisma.commonIssue.createMany({ data: issues });
  console.log(`Seed de fallas comunes listo: ${issues.length} registros.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
