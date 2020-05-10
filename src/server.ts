import {
  serve,
  ServerRequest,
} from "https://deno.land/std/http/server.ts";
import { handleParams, findParam, FindParamResult, ParamData } from "./util.ts";

type ServerConfig = {
  hostname?: string;
  port: number;
};
type Routes = {
  [routes: string]: {
    func: (request: IServerRequest) => void;
    paramData: ParamData | null;
    actualPath: string;
  };
};
interface IServerRequest {
  req: ServerRequest;
  params: FindParamResult | undefined;
}

export default class Server {
  private paths: Routes = {};
  constructor(private config: ServerConfig) {}
  public async start() {
    for await (const req of serve(this.config)) {
      let found = false;
      for (const [k, v] of Object.entries(this.paths)) {
        if (req.url.startsWith(k)) {
          let finalParams: FindParamResult | undefined;
          if (v.paramData && v.paramData.paramKeys.length) {
            finalParams = findParam(req.url, v.paramData);
          }
          found = true;
          v.func({ req, params: finalParams });
        }
      }
      if (!found) req.respond({ status: 400, body: "Route not found" });
    }
  }
  public use(route: string, func: (req: IServerRequest) => void) {
    const paramResults = handleParams(route);
    this.paths[paramResults.actualPath] = {
      func,
      ...paramResults,
    };
  }
}
