/**
 * Privacy-conscious analytics utility.
 * Integrates with Google Analytics 4 (GA4) if configured,
 * or safely runs in silent mode without throwing errors.
 */

export type AnalyticsEventName =
  | 'tool_open'
  | 'tool_complete'
  | 'download'
  | 'copy'
  | 'pricing_view'
  | 'pro_cta_click'
  | 'theme_change'
  | 'search_tool';

export interface AnalyticsEventParams {
  tool_name?: string;
  category?: string;
  file_type?: string;
  file_size?: number;
  plan_tier?: string;
  source?: string;
  [key: string]: any;
}

export function trackEvent(eventName: AnalyticsEventName, params?: AnalyticsEventParams): void {
  // If window.gtag is available (e.g. from Google Analytics)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, params);
    } catch {
      // Ignore tracking errors
    }
  }

  // Safe development logging for inspection
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics Event] ${eventName}:`, params);
  }
}
