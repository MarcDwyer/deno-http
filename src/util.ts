import { ParamData } from "./server_request.ts";

export const getParams = (path: string, start: number): ParamData[] => {
  const params = [];
  for (let x = start; x < path.length; x++) {
    const curr = path[x];
    if (curr === ":") {
      const startOfParam = x;
      let param = "";
      for (let i = x + 1; i < path.length; i++) {
        if (path[i] === "/") {
          x = i;
          break;
        }
        param = param + path[i];
      }
      if (param.length) params.push({ param, index: startOfParam });
    }
  }
  return params;
};
