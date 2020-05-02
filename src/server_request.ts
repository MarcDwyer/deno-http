import {
  ServerRequest,
} from "https://deno.land/std@v0.42.0/http/server.ts";
import { getParams } from "./util.ts";

export type ParamData = {
  param: string;
  index: number;
};
type Params = {
  [param: string]: any;
};
