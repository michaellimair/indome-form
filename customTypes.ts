import { EventTierInfo } from "./ticket-tiers";

export type EventStatus = {
  /**
   * Direct purchase of tickets (non-waitlist) available.
   */
  available: boolean;

  /**
   * Waitlist tickets are available.
   */
  pendingAvailable: boolean;

  tierInfo: EventTierInfo[]
}
