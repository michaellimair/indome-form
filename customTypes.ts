export enum AppParameters {
  SCHEMA_VERSION = 1,
  DUPLICATION_NUMBER = 2,
}

export type EventStatus = {
  orderCount: number;
  available: boolean;
  pendingAvailable: boolean;
  firstReleaseAvailable: boolean;
  firstReleaseOpen: boolean;
  secondReleaseOpen: boolean;
  secondReleaseAvailable: boolean;
  finalised: boolean;
  pendingCount: number;
}
