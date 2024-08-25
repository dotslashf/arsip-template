import { TRPCError } from "@trpc/server";
import chalk from "chalk";
import { type LogTRPCRequest } from "~/lib/interface";
export function logTRPCRequest({
  ctx,
  end,
  path,
  result,
  start,
  type,
  input,
}: LogTRPCRequest) {
  const duration = end - start,
    timestamp = new Date().toISOString(),
    userId = ctx.session?.user.id ?? "anonymous",
    status = result instanceof TRPCError ? "error" : "success",
    errorMessage = result instanceof TRPCError ? result.message : "",
    userAgent = ctx.req?.headers.get("user-agent") ?? "Unknown",
    method = ctx.req?.method ?? "Unknown";
  console.log(
    `${chalk.bgBlueBright.black(" TRPC ")} ${chalk.grey(timestamp)} | 🛤️ ${chalk.cyan(path)} | 🛠️ ${chalk.cyan(type)} | 📩 ${chalk.cyan(method)} | ⏱️ ${chalk.cyan(`${duration}ms`)} | 👤 ${chalk.magenta(userId)} | ${status === "error" ? "❌" : "✅"} ${status === "error" ? chalk.red(status) : chalk.green(status)}${errorMessage ? ` | 🛑 ${chalk.red(errorMessage)}` : ""} | 🖥️ ${chalk.grey(userAgent)} | 🔍 ${chalk.grey(JSON.stringify(input ?? null).slice(0, 100))}`,
  );
}
