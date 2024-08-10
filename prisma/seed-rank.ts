import { PrismaClient } from "@prisma/client";

import { createRequire } from "node:module";
import { DataInterface } from "~/lib/constant";
const require = createRequire(import.meta.url);

const data: DataInterface = require("./data.json");

const prisma = new PrismaClient();

async function main() {
  await prisma.rank.createMany({
    data: data.ranks.map((rank) => rank),
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      _count: {
        select: {
          CopyPastaCreatedBy: {
            where: {
              approvedAt: {
                not: null,
              },
            },
          },
        },
      },
    },
  });

  const ranks = await prisma.rank.findMany({
    orderBy: {
      minCount: "asc",
    },
  });

  users.map(async (user) => {
    const contributionCount = user._count.CopyPastaCreatedBy;

    const rank = ranks.reverse().find((r) => contributionCount >= r.minCount);

    if (rank) {
      await prisma.user.update({
        where: { id: user.id },
        data: { rankId: rank.id },
      });
    }
  });

  console.log("Users assigned with rank");
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
