export interface DataInterface {
  copyPastas: string[];
  tags: string[];
  ranks: {
    title: string;
    minCount: number;
  }[];
}

export interface LogTRPCRequest {
  ctx: any;
  end: number;
  path: string;
  result: any;
  start: number;
  input: any;
}

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
  input: any;
  type: "query" | "mutation" | "subscription";
  result: MiddlewareResult<object>;
}
