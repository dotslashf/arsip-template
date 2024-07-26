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
  const [tags, copyPastas] = await prisma.$transaction([
    prisma.tag.createManyAndReturn({
      data: data.tags.map((tag) => {
        return {
          name: tag,
        };
      }),
    }),
    prisma.copyPasta.createManyAndReturn({
      data: data.copyPastas.map((copy) => {
        return {
          content: copy,
          createdById: "b4ead74f-fe2f-4359-98f6-4ba25ad9f29a",
          approvedById: "b4ead74f-fe2f-4359-98f6-4ba25ad9f29a",
          isApproved: true,
          createdAt: new Date(),
          source: faker.helpers.arrayElement(
            Object.keys(OriginSource),
          ) as OriginSource,
          sourceUrl: faker.internet.url(),
          postedAt: faker.date.past({ years: 2 }),
        };
      }),
    }),
  ]);

  function generateCopyPastaWithTags() {
    const results: { copyPastaId: string; tagId: string }[] = [];

    copyPastas.map((copy) => {
      const maxTags = faker.number.int({ min: 1, max: 3 });
      const hashTags = new Set<string>();
      while (hashTags.size < maxTags) {
        const tagId = faker.helpers.arrayElement(tags).id;
        hashTags.add(tagId);
      }
      hashTags.forEach((tagId) => {
        results.push({ copyPastaId: copy.id, tagId });
      });
    });

    return results;
  }

  await prisma.$transaction([
    prisma.copyPastasOnTags.createMany({
      data: generateCopyPastaWithTags(),
      skipDuplicates: true,
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
