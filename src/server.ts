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
  [routes: string]: SubRoute;
};
type SubRoute = {
  func: (request: IServerRequest) => void;
  paramData: ParamData | null;
  actualPath: string;
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
      if (req.url in this.paths) {
        const found = this.paths[req.url];
        found.func({ req, params: undefined });
      } else {
        this.handleRoute(req);
      }
      //      if (!found) req.respond({ status: 400, body: "Route not found" });
    }
  }
  public use(route: string, func: (req: IServerRequest) => void) {
    const paramResults = handleParams(route);
    this.paths[paramResults.actualPath] = {
      func,
      ...paramResults,
    };
  }
  private handleRoute(req: ServerRequest) {
    const { url } = req;
    let pathData: SubRoute | null = null;
    for (const [k, v] of Object.entries(this.paths)) {
      if (url.startsWith(k)) {
        pathData = v;
      }
    }
    if (pathData) {
      const paramData = pathData.paramData
        ? findParam(url, pathData.paramData)
        : undefined;
      pathData.func({ req, params: paramData });
    } else {
      req.respond({ status: 400, body: "Route could not be found" });
    }
  }
}
