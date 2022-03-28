import { SourceLocation } from "../typings/source";
import { ArrayAble } from "../typings/utils";

export function isArraySource(
  obj: ArrayAble<SourceLocation>
): obj is Array<SourceLocation> {
  return Array.isArray(obj[0]);
}

export function isSimpleSource(
  obj: ArrayAble<SourceLocation>
): obj is SourceLocation {
  return !isArraySource(obj);
}
