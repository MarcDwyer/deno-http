export type ParamData = {
  paramKeys: string[];
  startIndex: number;
};

export const getParams = (path: string, start: number): ParamData => {
  const paramKeys = [];
  for (let x = start; x < path.length; x++) {
    const curr = path[x];
    if (curr === ":") {
      let param = "";
      for (let i = x + 1; i < path.length; i++) {
        if (path[i] === "/") {
          x = i;
          break;
        }
        param = param + path[i];
      }
      if (param.length) paramKeys.push(param);
    }
  }
  return { paramKeys, startIndex: start };
};

export function handleParams(path: string) {
  const start = path.indexOf(":");
  let paramData: ParamData | null = null;
  let actualPath = path;
  if (start !== -1) {
    paramData = getParams(path, start);
    actualPath = path.slice(0, start);
  }
  return { actualPath, paramData };
}

export type FindParamResult = {
  [key: string]: string;
};

// Needs to handle these special cases
// http://localhost:1447/gamer/1232342424
export function findParam(
  path: string,
  { startIndex, paramKeys }: ParamData,
) {
  let start = startIndex;
  const result: any = {};
  for (const key of paramKeys) {
    let value = "";
    for (let x = start; x < path.length; x++) {
      const curr = path[x];
      if (curr === "/") {
        start = x + 1;
        value = "";
        break;
      }
      value = value + curr;
    }
    result[key] = value;
  }
  console.log(result);
  return result;
}
