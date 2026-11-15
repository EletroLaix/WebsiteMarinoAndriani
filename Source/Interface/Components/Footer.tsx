import { openConsentBanner, trackOutbound } from "@/Application/Analytics";
import { Profile } from "@/Resources/Content/Profile";
import { useDictionary } from "@/Interface/Hooks/UseLanguage";
import { SocialIcon } from "@/Interface/Components/Icons";

export function Footer() {
	const t = useDictionary();
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border/60">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-9 sm:px-6">
				<div className="flex items-center gap-3">
					<img
						src={Profile.icon.path}
						alt=""
						width={32}
						height={32}
						className="brand-eye h-8 w-8"
					/>
					<div>
						<p className="font-display font-semibold">{Profile.name}</p>
						<p className="text-sm text-faint">{t.footer.role}</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					{Profile.socials.map((social) => (
						<a
							key={social.id}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer me"
							aria-label={social.label}
							onClick={() => trackOutbound(social.label, "footer", social.url)}
							className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-primary"
						>
							<SocialIcon id={social.id} className="h-5 w-5" />
						</a>
					))}
				</div>

				<p className="text-sm text-faint">
					© {year} {Profile.name} ·{" "}
					<button
						type="button"
						onClick={openConsentBanner}
						className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
					>
						{t.footer.consent}
					</button>
				</p>
			</div>
		</footer>
	);
}
