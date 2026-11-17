import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/Application/Utilities";
import { Profile } from "@/Resources/Content/Profile";
import { useDictionary } from "@/Interface/Hooks/UseLanguage";
import { ScrambleText } from "@/Interface/Components/ScrambleText";

export function CopyEmailButton({ className }: { className?: string | undefined }) {
	const t = useDictionary();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(Profile.email);
			setCopied(true);
		} catch {
			window.location.href = `mailto:${Profile.email}`;
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			className={cn(
				"inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 font-mono text-[13px] font-semibold tracking-wide uppercase text-foreground hover:-translate-y-0.5 hover:border-primary",
				className,
			)}
		>
			{copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
			<span aria-live="polite">
				<ScrambleText text={copied ? t.contact.copied : t.contact.copy} />
			</span>
		</button>
	);
}
