export enum TicketTier {
  EARLY_BIRD = "early_bird",
  FIRST_RELEASE = "first_release",
  SECOND_RELEASE = "second_release"
}

export interface TicketTierInfo {
  /**
   * Ticket tier identifier.
   */
  tier: TicketTier;
  /**
   * Title of the ticket tier.
   */
  title: string;
  /**
   * Price in HKD * 100.
   * 
   * For example, if the price is 200 HKD, the value will be 20000.
   */
  price: number;
  /**
   * Number of available tickets for the given tier.
   */
  quota: number;
  /**
   * Time that the ticket tier sales will be available.
   */
  openTime: Date;
  /**
   * Time that the ticket tier sales will be closed.
   */
  closeTime: Date;
}

export type EventTierInfo = (Pick<TicketTierInfo, "tier" | "title" | "price" | "openTime" | "closeTime"> & {
  /**
   * Ticket tier is within purchase window and still available (non-waitlist).
   */
  available: boolean;
  /**
   * Ticket tier is within purchase window but only waitlist is available.
   */
  pendingAvailable: boolean;
  /**
   * Ticket tier is within purchase window regardless of quota.
   */
  isInWindow: boolean;
  /**
   * Ticket sales has started for the given tier.
   */
  isSalesStarted: boolean;
  /**
   * Ticket sales has ended for the given tier.
   */
  isSalesEnded: boolean;
});

export const eventSalesOpenTime = new Date("2023-08-06T18:00:00+08:00");
export const eventSalesCloseTime = new Date("2023-09-29T23:59:59+08:00");

const earlyBirdCloseTime = new Date("2023-09-11T22:59:59+08:00");
const mainReleaseOpenTime = new Date("2023-09-15T12:00:00+08:00");

export const ticketTiers: TicketTierInfo[] = [
  {
    tier: TicketTier.EARLY_BIRD,
    title: "Early Bird",
    price: 20000,
    quota: 30,
    openTime: eventSalesOpenTime,
    closeTime: earlyBirdCloseTime,
  },
  {
    tier: TicketTier.FIRST_RELEASE,
    title: "First Release",
    price: 22500,
    quota: 55,
    openTime: mainReleaseOpenTime,
    closeTime: eventSalesCloseTime,
  },
  {
    tier: TicketTier.SECOND_RELEASE,
    title: "Second Release",
    price: 25000,
    quota: 45,
    openTime: mainReleaseOpenTime,
    closeTime: eventSalesCloseTime,
  },
];

/**
 * Total number of available tickets.
 */
export const totalQuota = ticketTiers.reduce((acc, { quota }) => acc + quota, 0);

export const getEventTierInfo = async () => {
  const currentDateTime = new Date();
  // Dynamic import to prevent class from being imported in the client side
  const { default: Order } = await import("./models/Order");

  const tierInfo = await Promise.all<EventTierInfo>(ticketTiers.map(async ({
    price,
    title,
    tier,
    quota,
    openTime,
    closeTime,
  }) => {
    const isSalesStarted = currentDateTime >= openTime;
    const isSalesEnded = currentDateTime >= closeTime;
    const isInWindow = isSalesStarted && !isSalesEnded;
    let available = isInWindow;
    let pendingAvailable = isInWindow;
    if (isInWindow) {
      const completedTickets = await Order.countDocuments({
        filled: true,
        tier,
      });
      const pendingTickets = await Order.countDocuments({
        filled: false,
        tier,
        expiresAt: {
          $gt: currentDateTime,
        }
      });
      available = (completedTickets + pendingTickets) < quota;
      pendingAvailable = completedTickets < quota;
    }

    return ({
      title,
      tier,
      price,
      available,
      pendingAvailable,
      isInWindow,
      openTime,
      closeTime,
      isSalesStarted,
      isSalesEnded,
    });
  }));
  return tierInfo;
}
