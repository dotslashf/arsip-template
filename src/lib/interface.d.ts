import { type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type MiddlewareResult } from "@trpc/server/unstable-core-do-not-import";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import { Renderable, ValueOrFunction } from "react-hot-toast";

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
