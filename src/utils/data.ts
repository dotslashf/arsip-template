import { type $Enums } from "@prisma/client";

export function getRandomElement(array: string[]) {
  if (array.length === 0) {
    throw new Error("Array cannot be empty");
  }
  return array[Math.floor(Math.random() * array.length)];
}

export function mergeReactions(
  data?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[],
) {
  return data?.reduce(
    (acc, curr) => {
      const key = `${curr.emotion}`;

      if (!acc[key]) {
        acc[key] = {
          ...curr,
          userIds: [],
          _count: { emotion: 0 },
        };
      }

      acc[key]._count.emotion += curr._count.emotion;
      acc[key].userIds.push(curr.userId);

      return acc;
    },
    {} as Record<
      string,
      {
        copyPastaId: string;
        userIds: string[];
        emotion: $Enums.EmotionType;
        _count: {
          emotion: number;
        };
      }
    >,
  );
}
