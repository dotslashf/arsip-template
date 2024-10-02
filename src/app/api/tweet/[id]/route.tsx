import { unstable_cache } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { getTweet as _getTweet } from "react-tweet/api";

const getTweet = unstable_cache(
  async (id: string) => _getTweet(id),
  ["tweet"],
  { revalidate: 3600 * 24 },
);

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const tweet = await getTweet(params.id);
    return NextResponse.json({
      tweet,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch tweet" });
  }
}
