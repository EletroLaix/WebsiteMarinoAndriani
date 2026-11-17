import { pagePath } from "@/Application/Site";
import { useDictionary, useLang } from "@/Interface/Hooks/UseLanguage";
import { ScrambleText } from "@/Interface/Components/ScrambleText";

export function NotFoundView() {
	const lang = useLang();
	const t = useDictionary();

	return (
		<section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
			<p className="font-display text-8xl font-bold text-primary">404</p>
			<h1 className="mt-4 font-display text-2xl font-semibold">{t.notFound.title}</h1>
			<p className="mt-2 text-muted-foreground">{t.notFound.text}</p>
			{/* A plain link: the 404 page is served outside the router on GitHub Pages. */}
			<a
				href={pagePath("home", lang)}
				className="cut-sm cut-fill mt-8 inline-flex min-h-12 items-center bg-primary px-6 font-mono text-[13px] font-semibold tracking-wide uppercase text-primary-foreground hover:bg-primary/90"
			>
				<ScrambleText text={t.notFound.home} />
			</a>
		</section>
	);
}
