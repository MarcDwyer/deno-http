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

export function handleParams(path: string) {
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
  return { actualPath, paramData };
}

export type FindParamResult = {
  [key: string]: string;
};
export function findParam(path: string, pData: ParamData[]): FindParamResult {
  return pData.reduce((obj: FindParamResult, param) => {
    const key = param.param;
    let value = "";
    for (let x = param.index; x < path.length; x++) {
      const curr = path[x];
      if (curr === "/") {
        break;
      } else {
        value = value + curr;
      }
    }
    // console.log({ key, value });
    obj[key] = value;
    return obj;
  }, {});
}
