import {
  serve,
  ServerRequest,
} from "https://deno.land/std@v0.42.0/http/server.ts";
import { handleParams, findParam, FindParamResult } from "./util.ts";
import { ParamData } from "./server_request.ts";

type ServerConfig = {
  hostname?: string;
  port: number;
};
type Routes = {
  [routes: string]: {
    func: (request: IServerRequest) => void;
    paramData: ParamData[] | null;
    actualPath: string;
  };
};
interface IServerRequest {
  req: ServerRequest;
  params: FindParamResult | undefined;
}
export default class Server {
  private serverConfig: ServerConfig;
  private paths: Routes;
  constructor(config: ServerConfig) {
    this.serverConfig = config;
    this.paths = {};
  }
  async start() {
    for await (const req of serve(this.serverConfig)) {
      console.log(req.url);
      for (const [k, v] of Object.entries(this.paths)) {
        if (req.url.startsWith(k)) {
          let finalParams: FindParamResult | undefined;
          if (v.paramData && v.paramData.length) {
            finalParams = findParam(req.url, v.paramData);
          }
          v.func({ req, params: finalParams });
        }
      }
    }
  }
  get(path: string, func: (req: IServerRequest) => void) {
    const paramResults = handleParams(path);
    this.paths[paramResults.actualPath] = {
      func,
      ...paramResults,
    };
  }
}
