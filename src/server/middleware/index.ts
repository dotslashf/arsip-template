import { TRPCError } from "@trpc/server";
import chalk from "chalk";
import { LogTRPCRequest } from "~/lib/interface";

export function logTRPCRequest({
  ctx,
  end,
  path,
  result,
  start,
  type,
  input,
}: LogTRPCRequest) {
  const duration = end - start;
  const timestamp = new Date().toISOString();
  const userId = ctx.session?.user?.id ?? "anonymous";
  const status = result instanceof TRPCError ? "error" : "success";
  const errorMessage = result instanceof TRPCError ? result.message : "";
  const userAgent = ctx.req?.headers.get("user-agent") ?? "Unknown";
  const method = ctx.req?.method ?? "Unknown";
  const ip =
    ctx.req?.headers.get("x-forwarded-for") ??
    ctx.req?.connection.remoteAddress ??
    "Unknown";

  const logEntry = `
${chalk.bgBlueBright.black(" TRPC ")}     ${chalk.grey(timestamp)}
${chalk.yellow("Path:")}      ${chalk.cyan(path)}
${chalk.yellow("Type:")}      ${chalk.cyan(type)}
${chalk.yellow("Method:")}    ${chalk.cyan(method)}
${chalk.yellow("Duration:")}  ${chalk.cyan(`${duration}ms`)}
${chalk.yellow("User ID:")}   ${chalk.magenta(userId)}
${chalk.yellow("IP:")}        ${chalk.magenta(ip)}
${chalk.yellow("Status:")}    ${status === "error" ? chalk.red(status) : chalk.green(status)}
${chalk.yellow("Input:")}     ${chalk.grey(JSON.stringify(input ?? null).slice(0, 100))}
${chalk.yellow("User Agent:")} ${chalk.grey(userAgent)}
${errorMessage && chalk.yellow("Error:") + "     " + chalk.red(errorMessage)}
${chalk.grey("─".repeat(80))}
  `;

  console.log(logEntry.trim());
}
