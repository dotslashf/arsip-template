import { OriginSource, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

interface Data {
  copyPastas: string[];
  tags: string[];
}
const data: Data = require("./data.json");

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.tag.createManyAndReturn({
      data: data.tags.map((tag) => {
        return {
          name: tag,
        };
      }),
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
