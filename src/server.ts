import {
  serve,
  ServerRequest,
} from "https://deno.land/std@v0.42.0/http/server.ts";
import { getParams } from "./util.ts";
import { ParamData } from "./server_request.ts";

type ServerConfig = {
  hostname?: string;
  port: number;
};
type Routes = {
  [routes: string]: {
    func: (req: ServerRequest) => void;
    paramData: ParamData[] | null;
    actualPath: string;
  };
};
// interface IServerRequest extends ServerRequest {
//   params: ParamData;
// }
export default class Server {
  private serverConfig: ServerConfig;
  private paths: Routes;
  constructor(config: ServerConfig) {
    this.serverConfig = config;
    this.paths = {};
  }
  async start() {
    for await (const req of serve(this.serverConfig)) {
      if (req.url in this.paths) {
        const routeData = this.paths[req.url];
        routeData.func(req);
      } else {
        req.respond({ status: 400, body: "Route does not exist" });
      }
    }
  }
  handleParams(path: string) {
    const start = path.indexOf(":");
    let paramData: ParamData[] | null = null;
    let actualPath = path;
    if (start !== -1) {
      paramData = getParams(path, start);
      if (paramData.length) {
        const { index } = paramData[0];
        actualPath = path.slice(0, index);
      }
    }
    console.log(actualPath);
    return { actualPath, paramData };
  }
  get(path: string, func: (req: ServerRequest) => void) {
    const paramResults = this.handleParams(path);
    console.log(paramResults);
    this.paths[paramResults.actualPath] = {
      func,
      ...paramResults,
    };
  }
}
