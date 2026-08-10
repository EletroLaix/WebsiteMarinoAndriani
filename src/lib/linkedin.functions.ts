import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const linkedInProfileSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().optional(),
  locale: z.string().optional(),
  email: z.string().optional(),
  email_verified: z.boolean().optional(),
});

export type LinkedInProfile = z.infer<typeof linkedInProfileSchema>;

export const getLinkedInProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const linkedInApiKey = process.env["LINKEDIN_API_KEY"];

    if (!lovableApiKey || !linkedInApiKey) {
      throw new Error("LinkedIn connector is not configured");
    }

    const res = await fetch("https://connector-gateway.lovable.dev/linkedin/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": linkedInApiKey,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LinkedIn API returned ${res.status}: ${body}`);
    }

    const raw = await res.json();
    return linkedInProfileSchema.parse(raw);
  });
