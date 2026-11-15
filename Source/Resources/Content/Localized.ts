export type Lang = "it" | "en";

export const Languages: readonly Lang[] = ["it", "en"];

export const DefaultLang: Lang = "it";

/** A piece of text available in every supported language. */
export type Localized = Record<Lang, string>;
