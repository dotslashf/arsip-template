import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import Streak from "~/app/_components/Email/Streak";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const template = searchParams.get("template");
  let templateComponent = null;
  switch (template) {
    case "streak":
      templateComponent = (
        <Streak
          name="Fadhlu"
          streakCount={4}
          previewText="Streakmu bisa saja hilang!"
        />
      );
      break;
    default:
      templateComponent = (
        <Streak
          name="Fadhlu"
          streakCount={4}
          previewText="Streakmu bisa saja hilang!"
        />
      );
      break;
  }

  const html = render(templateComponent);
  const response = new NextResponse(html);
  response.headers.set("Content-Type", "text/html; charset=utf-8");
  return response;
}
