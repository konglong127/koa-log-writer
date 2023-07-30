import * as Koa from "koa";

declare namespace KoaLogWriter {

  interface KoaLogWriterOptions {

    print?: boolean;

    logPath?: string;

    logSize?: number;

    extension?: string;
  }

}

declare module 'koa' {
  interface Context {
    log: {
      write: (params: { type: string, info: string, filename?: string, content?: string }) => void;
    };
  }
}

declare function KoaLogWriter(options?: KoaLogWriter.KoaLogWriterOptions): Koa.Middleware<{}, {}>;

export = KoaLogWriter;
