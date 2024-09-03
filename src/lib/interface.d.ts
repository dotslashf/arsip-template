import {
  type PrismaClient,
  type Tag as TagType,
  type CopyPasta,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type MiddlewareResult } from "@trpc/server/unstable-core-do-not-import";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import { type Renderable, type ValueOrFunction } from "react-hot-toast";

export interface DataInterface {
  copyPastas: string[];
  tags: string[];
  ranks: {
    title: string;
    minCount: number;
  }[];
}

export interface LogTRPCRequest {
  path: string;
  start: number;
  end: number;
  ctx: {
    session: Session | null;
    req: NextRequest | undefined;
    headers: Headers;
    db: PrismaClient<
      {
        log: ("query" | "warn" | "error")[];
      },
      never,
      DefaultArgs
    >;
  };
  input: unknown;
  type: "query" | "mutation" | "subscription";
  result: MiddlewareResult<object>;
}

interface ToastType {
  message: string;
  type: "info" | "success" | "danger" | "promise";
  promiseFn?: Promise<unknown>;
  promiseMsg?: {
    success: string;
    error: ValueOrFunction<Renderable, any>;
    loading: string;
  };
}

export interface CopyPastaCardMinimalProps extends CopyPasta {
  CopyPastasOnTags: ({ tags: TagType } & {
    copyPastaId: string;
    tagId: string;
  })[];
  createdBy?: {
    id: string;
    name: string | null;
  };
  reactions?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[];
  isFullMode?: boolean;
  isCreatorAndDateShown?: boolean;
  isReactionSummaryShown?: boolean;
}

export interface CopyPastaCardProps extends CopyPasta {
  CopyPastasOnTags: ({ tags: TagType } & {
    copyPastaId: string;
    tagId: string;
  })[];
  createdBy?: {
    id: string;
    name: string | null;
  };
  fullMode?: boolean;
  isApprovalMode?: boolean;
  isCreatorAndDateShown?: boolean;
}

export interface CardCopyPastaMinimal extends CopyPasta {
  CopyPastasOnTags: ({ tags: TagType } & {
    copyPastaId: string;
    tagId: string;
  })[];
  createdBy?: {
    id: string;
    name: string | null;
  };
  reactions?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[];
}

export interface CardProps {
  copyPasta: CardCopyPastaMinimal;
}

export interface CardDashboardProps extends CardProps {
  isApprovalMode?: boolean;
  type: "approved" | "disapproved" | "deleted";
}

export interface CardCopyPastaMinimalProps {
  copyPastaProps: CopyPastaCardMinimalProps;
}

export interface CardCopyPastaProps {
  copyPastaProps: CopyPastaCardProps;
}

declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}
