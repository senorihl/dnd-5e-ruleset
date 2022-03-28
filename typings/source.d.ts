export type Source = {
  name: string;
  abbreviation: string;
  abbreviationSpellsheet?: string;
  date?: string;
  group?: string;
  url?: string;
  defaultExcluded?: boolean;
};

export type SourceLocation = [source: string, page: number];
