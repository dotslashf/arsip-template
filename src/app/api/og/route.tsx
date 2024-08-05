import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

const getGeist = async () => {
  const response = await fetch(new URL("./Geist-Regular.ttf", import.meta.url));
  const geist = await response.arrayBuffer();

  return geist;
};

const getGeistBold = async () => {
  const response = await fetch(new URL("./Geist-Bold.ttf", import.meta.url));
  const geist = await response.arrayBuffer();

  return geist;
};

const ogCopyPastaId = (copyPasta?: string) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      fontFamily: "Geist",
    }}
  >
    <div tw="flex flex-col w-full h-full items-center justify-center bg-slate-50">
      <div tw="flex w-full">
        <div tw="flex flex-col flex-row w-full py-12 px-4 items-center justify-around p-8">
          <h2 tw="flex items-center justify-center text-5xl font-bold tracking-tight text-slate-800  max-w-xs w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                marginRight: "0.5rem",
              }}
            >
              <path d="m7.5 4.27 9 5.15"></path>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path>
              <path d="M12 22V12"></path>
            </svg>
            <span>arsip template</span>
          </h2>
          <div tw="h-full w-0.5 self-center bg-slate-600 dark:bg-white/10"></div>
          <div tw="flex max-w-xs w-full text-slate-800 text-md text-right">
            {copyPasta}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ogCopyPasta = () => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      fontFamily: "Geist",
    }}
  >
    <div tw="flex w-full">
      <div tw="flex w-full items-center justify-center p-8">
        <h2 tw="flex items-center justify-center text-7xl font-bold tracking-tight text-slate-800 max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style={{
              width: "4.5rem",
              height: "4.5rem",
              marginRight: "0.5rem",
            }}
          >
            <path d="m7.5 4.27 9 5.15"></path>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
            <path d="m3.3 7 8.7 5 8.7-5"></path>
            <path d="M12 22V12"></path>
          </svg>
          <span>arsip template</span>
        </h2>
      </div>
    </div>
  </div>
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const hasCopyPasta = searchParams.has("copyPasta");
  const copyPasta = hasCopyPasta
    ? searchParams.get("copyPasta")?.slice(0, 255)
    : "---";

  return new ImageResponse(
    hasCopyPasta ? ogCopyPastaId(copyPasta) : ogCopyPasta(),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: await getGeist(),
          weight: 400,
        },
        {
          name: "Geist",
          data: await getGeistBold(),
          weight: 700,
        },
      ],
    },
  );
}
