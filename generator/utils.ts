import { Source, SourceLocation } from "../typings/source";
import { ArrayAble } from "../typings/utils";
import { SourceList } from "dnd-5th-ruleset";

function isArraySource(
  obj: ArrayAble<SourceLocation>
): obj is Array<SourceLocation> {
  return Array.isArray(obj[0]);
}

function isSimpleSource(obj: ArrayAble<SourceLocation>): obj is SourceLocation {
  return !isArraySource(obj);
}

export function toSourceString(
  sources: ArrayAble<SourceLocation>
): null | string {
  if (isArraySource(sources)) {
    const str = `<small>From ${sources
      .map((e) => {
        return [
          SourceList[(e as SourceLocation)[0]],
          (e as SourceLocation)[1],
        ] as [Source, number];
      })
      .filter(([source]) => !!source && !(source.defaultExcluded || false))
      .map(([source, page]) => {
        if (source.url) {
          return `<a target="_blank" href="${source.url}">${source.name}</a> (p. ${page})`;
        }
        return `${source.name} (p. ${page})`;
      })
      .join(", ")}</small>\n`;
    return str;
  } else if (isSimpleSource(sources)) {
    const source = SourceList[sources[0]];
    const page = sources[1];
    if (source.url) {
      return `<small>From <a target="_blank" href="${source.url}">${source.name}</a> (p. ${page})</small>`;
    } else {
      return `<small>From ${source.name} (p. ${page})</small>`;
    }
  }

  return null;
}
