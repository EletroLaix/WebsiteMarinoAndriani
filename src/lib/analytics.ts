type Placement = "header" | "mobile_menu" | "footer" | "contact_page";

/**
 * Tracks an outbound click to a social network or email link.
 * Sends a GA4 custom event so each network/placement can be
 * distinguished in the reports.
 */
export function trackOutbound(network: string, placement: Placement, url: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof window === "undefined" || typeof gtag !== "function") return;
  const isEmail = url.startsWith("mailto:");
  gtag("event", isEmail ? "email_click" : "social_click", {
    network,
    placement,
    link_url: url,
    link_id: `${network.toLowerCase()}_${placement}`,
    outbound: true,
  });
}