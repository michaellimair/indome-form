export interface VaccinationRecord {
  name: string;
  date: Date;
}

export enum VacCase {
  INVALID = "INVALID",
  VP_FAIL = "VP_FAIL",
  OLD_VP_FAIL = "OLD_VP_FAIL",
  VP_SUCCESS = "VP_SUCCESS",
  OLD_VP_SUCCESS = "OLD_VP_SUCCESS",
  UNFIT_EXPIRED = "UNFIT_EXPIRED",
  UNFIT_VALID = "UNFIT_VALID",
  RCY_EXPIRED = "RCY_EXPIRED",
  RCY_VALID = "RCY_VALID",
  PVP_EXPIRED = "PVP_EXPIRED",
  PVP_VALID = "PVP_VALID",
}

export enum AppParameters {
  SCHEMA_VERSION = 1,
  DUPLICATION_NUMBER = 2,
}

export interface VerifyVaccineResult {
  vaccinationStatus: VacCase;
  vaccinations: VaccinationRecord[];
}
