import { ethers } from "ethers";

export function getFunctionSignature(functionString: string): string {
  const functionName = functionString.split("(")[0].trim();
  if (functionName === "") {
    throw new Error(`Invalid function string: ${functionString}`);
  }
  const functionParams = functionString.split("(")[1].split(")")[0].trim();
  if (functionParams === "") {
    return `${functionName}()`;
  }
  const functionParamArray = functionParams.split(",").map((param) => {
    const splitParams = param.trim().split(" ");
    let type = splitParams[0].trim();
    if (type.startsWith("index")) {
      type = splitParams[1].trim();
    }
    if (type === "uint") {
      type = "uint256";
    } else if (type === "int") {
      type = "int256";
    }
    return type;
  });
  return `${functionName}(${functionParamArray.join(",")})`;
}

export function getFunctionSelector(
  functionNameOrSig: string,
  params?: string[],
): string {
  if (params === undefined) {
    return ethers.id(getFunctionSignature(functionNameOrSig)).slice(0, 10);
  }
  return ethers.FunctionFragment.getSelector(functionNameOrSig, params);
}

export function getEventSchema(
  functionNameOrSig: string,
  params?: string[],
): string {
  if (params === undefined) {
    return ethers.id(getFunctionSignature(functionNameOrSig));
  }
  const concatFunction = `${functionNameOrSig}(${params.join(",")})`;
  return ethers.id(concatFunction);
}
