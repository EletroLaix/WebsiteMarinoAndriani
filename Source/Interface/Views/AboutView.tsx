import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/Application/Utilities";
import {
	Certifications,
	formatPeriod,
	Roles,
	Skills,
	type SkillId,
} from "@/Resources/Content/Experience";
import type { Lang } from "@/Resources/Content/Localized";
import { Profile } from "@/Resources/Content/Profile";
import { dictionary } from "@/Resources/Dictionary";
import { PixelatedImage } from "@/Interface/Components/PixelatedImage";

export function AboutView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const [openRole, setOpenRole] = useState<string | null>(Roles[0]?.id ?? null);
	const [hoveredSkill, setHoveredSkill] = useState<SkillId | null>(null);
	const [pinnedSkill, setPinnedSkill] = useState<SkillId | null>(null);
	const activeSkill = hoveredSkill ?? pinnedSkill;

	return (
		<>
			<section className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-12 px-4 py-24 sm:px-6">
				<div className="max-w-2xl min-w-0 flex-1 basis-[28rem]">
					<h1 className="rise font-display text-5xl font-bold tracking-tighter sm:text-6xl">
						{t.about.title}
					</h1>
					<p className="rise rise-1 mt-6 text-lg text-muted-foreground">
						{t.about.intro}
					</p>
				</div>
				<PixelatedImage
					src={Profile.portrait.path}
					alt={t.about.portraitAlt}
					width={260}
					height={260}
					frameClassName="rise rise-2 h-[260px] w-[260px] shrink-0 rounded-2xl border border-border"
				/>
			</section>

			<section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
				<h2 className="font-display text-3xl font-bold tracking-tight">
					{t.about.experienceTitle}
				</h2>
				<p className="mt-2 text-muted-foreground">{t.about.skillsHint}</p>

				<div className="mt-10 flex flex-wrap items-start gap-10">
					<aside className="max-w-xs flex-1 basis-60 lg:sticky lg:top-24">
						<p className="mb-3 font-mono text-xs tracking-widest text-faint">
							{t.about.skillsLabel.toUpperCase()}
						</p>
						<div className="flex flex-wrap gap-2">
							{Skills.map((skill) => {
								const active = activeSkill === skill.id;
								return (
									<button
										key={skill.id}
										type="button"
										aria-pressed={pinnedSkill === skill.id}
										onClick={() =>
											setPinnedSkill((value) =>
												value === skill.id ? null : skill.id,
											)
										}
										onPointerEnter={() => setHoveredSkill(skill.id)}
										onPointerLeave={() => setHoveredSkill(null)}
										onFocus={() => setHoveredSkill(skill.id)}
										onBlur={() => setHoveredSkill(null)}
										className={cn(
											"min-h-9 rounded-md border px-3 font-mono text-[13px]",
											active
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-card text-muted-foreground hover:border-primary",
										)}
									>
										{skill.label[lang]}
									</button>
								);
							})}
						</div>
					</aside>

					<ol className="min-w-0 flex-[999_1_32rem] space-y-3.5 border-l-2 border-ember pl-7">
						{Roles.map((role) => {
							const used = activeSkill ? role.skills.includes(activeSkill) : false;
							const open = openRole === role.id;
							const highlighted = used || open;
							return (
								<li
									key={role.id}
									className={cn(
										"relative transition-opacity duration-300",
										activeSkill && !used && "opacity-30",
									)}
								>
									<span
										className={cn(
											"absolute top-6 -left-[37px] h-4 w-4 rounded-full border-2 border-primary",
											highlighted ? "bg-primary" : "bg-background",
										)}
										aria-hidden="true"
									/>
									<div
										className={cn(
											"rounded-xl border bg-card transition-colors",
											highlighted ? "border-primary" : "border-border",
										)}
									>
										<button
											type="button"
											aria-expanded={open}
											aria-controls={`role-${role.id}`}
											onClick={() => setOpenRole(open ? null : role.id)}
											className="flex w-full items-start justify-between gap-4 p-5 text-left"
										>
											<span className="min-w-0">
												<span className="block font-mono text-[12.5px] text-accent">
													{formatPeriod(role, lang)}
												</span>
												<span className="mt-1 block font-display text-xl font-semibold">
													{role.title[lang]}
												</span>
												<span className="block text-sm text-muted-foreground">
													{role.company}
												</span>
											</span>
											<ChevronDown
												className={cn(
													"mt-1.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
													open && "rotate-180",
												)}
												aria-hidden="true"
											/>
										</button>
										{open && (
											<div
												id={`role-${role.id}`}
												className="rise grid gap-3 px-5 pb-5 sm:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]"
											>
												<RoleDetail
													label={t.about.problem}
													text={role.problem[lang]}
													tone="border-ember"
												/>
												<RoleDetail
													label={t.about.solution}
													text={role.solution[lang]}
													tone="border-primary"
												/>
												{role.result && (
													<RoleDetail
														label={t.about.result}
														text={role.result[lang]}
														tone="border-accent"
													/>
												)}
											</div>
										)}
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 pt-8 pb-28 sm:px-6">
				<h2 className="font-display text-3xl font-bold tracking-tight">
					{t.about.certificationsTitle}
				</h2>
				<div className="mt-6 grid gap-4 md:grid-cols-2">
					{Certifications.map((certification) => (
						<div
							key={certification.title}
							className="rounded-xl border border-border bg-card p-6"
						>
							<p className="font-mono text-[12.5px] text-accent">
								{certification.year}
							</p>
							<h3 className="mt-1 font-display text-xl font-semibold">
								{certification.title}
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{certification.detail}
							</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

function RoleDetail({ label, text, tone }: { label: string; text: string; tone: string }) {
	return (
		<div className={cn("border-t-2 pt-2.5", tone)}>
			<p className="font-mono text-[11.5px] tracking-widest text-faint">
				{label.toUpperCase()}
			</p>
			<p className="mt-1.5 text-[15px] text-foreground/85">{text}</p>
		</div>
	);
}
