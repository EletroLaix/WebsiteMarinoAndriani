import { MapPin, Send } from "lucide-react";
import { trackOutbound } from "@/Application/Analytics";
import type { Lang } from "@/Resources/Content/Localized";
import { Profile } from "@/Resources/Content/Profile";
import { dictionary } from "@/Resources/Dictionary";
import { CopyEmailButton } from "@/Interface/Components/CopyEmailButton";
import { SocialIcon } from "@/Interface/Components/Icons";
import { ScrambleText } from "@/Interface/Components/ScrambleText";

export function ContactView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const mailto = `mailto:${Profile.email}`;

	return (
		<section className="mx-auto flex max-w-6xl flex-wrap items-start gap-14 px-4 py-24 sm:px-6 lg:pb-32">
			<div className="min-w-0 flex-[999_1_30rem]">
				<h1 className="rise font-display text-5xl font-bold tracking-tighter sm:text-6xl">
					{t.contact.title}
				</h1>
				<p className="rise rise-1 mt-5 text-lg text-muted-foreground">{t.contact.note}</p>

				<div className="rise rise-2 mt-10 max-w-xl rounded-2xl border border-border bg-card p-6">
					<p className="font-mono text-xs tracking-widest text-faint">
						{t.contact.emailLabel.toUpperCase()}
					</p>
					<p className="mt-2 font-display text-2xl font-semibold break-all">
						{Profile.email}
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<a
							href={mailto}
							onClick={() => trackOutbound("Email", "contact_page", mailto)}
							className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 font-mono text-[13px] font-semibold tracking-wide uppercase text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90"
						>
							<Send className="h-4 w-4" aria-hidden="true" />
							<ScrambleText text={t.contact.write} />
						</a>
						<CopyEmailButton />
					</div>
				</div>
			</div>

			<div className="rise rise-2 flex flex-1 basis-80 flex-col gap-3">
				<p className="mb-1 font-mono text-xs tracking-widest text-faint">
					{t.contact.elsewhere.toUpperCase()}
				</p>
				{Profile.socials.map((social) => (
					<a
						key={social.id}
						href={social.url}
						target="_blank"
						rel="noopener noreferrer me"
						onClick={() => trackOutbound(social.label, "contact_page", social.url)}
						className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:translate-x-1 hover:border-primary"
					>
						<SocialIcon id={social.id} className="h-5 w-5 text-primary" />
						<span className="flex-1 font-semibold">{social.label}</span>
						<span className="font-mono text-xs text-faint">{social.handle}</span>
					</a>
				))}
				<p className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-border px-5 py-4 font-semibold">
					<MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
					{Profile.location.label[lang]}
				</p>
			</div>
		</section>
	);
}
