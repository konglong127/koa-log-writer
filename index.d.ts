import * as Koa from "koa";

declare namespace KoaLogWriter {

  interface KoaLogWriterOptions {

    print?: boolean;

    logPath?: string;

    logSize?: number;

    log?: (x: string) => void;
  }

}

declare function KoaLogWriter(options?: KoaLogWriter.KoaLogWriterOptions): Koa.Middleware<{}, {}>;

export = KoaLogWriter;
