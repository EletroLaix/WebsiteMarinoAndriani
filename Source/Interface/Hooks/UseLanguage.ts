import { useRouterState } from "@tanstack/react-router";
import { langFromPath } from "@/Application/Site";
import { dictionary, type Dictionary } from "@/Resources/Dictionary";
import type { Lang } from "@/Resources/Content/Localized";

/** The page language is defined by the URL: `/en/...` is English, everything else Italian. */
export function useLang(): Lang {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return langFromPath(pathname);
}

export function useDictionary(): Dictionary {
	return dictionary(useLang());
}
