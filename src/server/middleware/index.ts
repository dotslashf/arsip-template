import { type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { type MiddlewareResult } from "@trpc/server/unstable-core-do-not-import";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import chalk from "chalk";

interface LogTRPCRequest {
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
  result: MiddlewareResult<object>;
}
export function logTRPCRequest({
  ctx,
  end,
  path,
  result,
  start,
}: LogTRPCRequest) {
  const duration = end - start;
  const timestamp = new Date().toISOString();
  const userId = ctx.session?.user?.id ?? "anonymous";
  const status = result instanceof TRPCError ? "error" : "success";
  const errorMessage = result instanceof TRPCError ? result.message : "";

  const logEntry = `
        ${chalk.blueBright(`[TRPC]`)} ${chalk.grey(timestamp)} |
        ${chalk.yellow(`Path:`)} ${chalk.cyan(path)} |
        ${chalk.yellow(`Duration:`)} ${chalk.cyan(`${duration}ms`)} |
        ${chalk.yellow(`User ID:`)} ${chalk.magenta(userId)} |
        ${chalk.yellow(`Status:`)} ${status === "error" ? chalk.red(status) : chalk.green(status)} 
        ${errorMessage ? chalk.yellow(`Error:`) + chalk.red(errorMessage) : ""} |
        ${chalk.yellow(`User Agent:`)} ${chalk.grey(ctx.req?.headers.get("user-agent"))}
    `;

  console.log(logEntry.trim().replace(/\s+/g, " "));
}
