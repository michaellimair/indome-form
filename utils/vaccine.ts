import parseDate from 'date-fns/parse';
import { differenceInYears, differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';

import {
  VacCase,
  VerifyVaccineResult,
  AppParameters,
} from '../customTypes';

const dateFormat = "dd-MM-yyyy";

export const verifyVaccine = (qrString: string): VerifyVaccineResult => {
  const strArr: string[] = qrString.split('|');

  let strv: string;

  const toDate = (str: string): Date => parseDate(str, dateFormat, new Date());

  const toAge = (dt: Date) => {
    const currentDate = new Date();
    const result: string[] = [];
    const years = differenceInYears(currentDate, dt);
    let age = dayjs(dt);
    if (years > 0) {
      result.push(`${years} years`);
      age = age.add(years, 'years');
    }

    const days = dayjs(currentDate).diff(age, 'days');
    return {
      years,
      days,
    };
  }

  const setDigitalSignature = (signature: string) => {};

  const phase1Start = toDate("18-03-2022");
  const phase2Start = toDate("30-04-2022");
  const phase3Start = toDate("31-05-2022");

  const prefix1 = strArr[0];
  const prefix2 = strArr[1];
  const qrCodeVersion = strArr[2];
  const keyVersion = strArr[3];
  const vacRef = strArr[4];
  const iNum = strArr[5];
  const label1 = strArr[6];
  const secondLastDoseDate = toDate(strArr[7]);
  const secondLastVaccineName = strArr[8];
  const secondLastVaccineNameTc = strArr[9];
  const specialIndicator1 = strArr[10];

  let dob: Date | null;

  let localDate2: Date | null = null;

  let expiryDate: Date | null;
  let thirdLastVaccinePart1: string;
  let lastDoseDate: Date | null;
  let lastVaccineName: string;
  let lastVaccineNameTc: string;
  let specialIndicator2: string;
  let thirdLastVaccinePart2: string;
  let downloadDate: Date | null;

  let thirdLastDoseDate: Date | null;

  let vaccineSeq: number;

  if (strArr.length === 19) {
    expiryDate = null;
    thirdLastVaccinePart1 = strArr[11];
    lastDoseDate = toDate(strArr[12]);
    lastVaccineName = strArr[13];
    lastVaccineNameTc = strArr[14];
    specialIndicator2 = strArr[15];
    thirdLastVaccinePart2 = strArr[16];
    downloadDate = toDate(strArr[17]);
    strv = strArr[18];
  } else {
    expiryDate = toDate(strArr[11]);
    thirdLastVaccinePart1 = strArr[12];
    lastDoseDate = toDate(strArr[13]);
    lastVaccineName = strArr[14];
    lastVaccineNameTc = strArr[15];
    specialIndicator2 = strArr[16];
    thirdLastVaccinePart2 = strArr[17];
    downloadDate = toDate(strArr[18]);
    strv = strArr[19];
  }

  setDigitalSignature(strv);

  if (thirdLastVaccinePart1.length > 10) {
    thirdLastDoseDate = toDate(thirdLastVaccinePart1.substring(0, 10));
  } else {
    thirdLastDoseDate = null;
  }

  const split: string[] = specialIndicator2.split(",");
  if (specialIndicator2.length > 10 && split.length >= 1) {
    localDate2 = toDate(split[0]);
  }

  dob = localDate2;

  try {
    if (split.length >= 2) {
      vaccineSeq = parseInt(split[1], 10);
    } else {
      vaccineSeq = 0;
    }
  } catch (e) {
    vaccineSeq = 0;
  }

  let strToSign = strArr.slice(0, strArr.length - 1).join('|') + '|';

  let localDate3 = dob;

  let mAge = toAge(localDate3 === null ? toDate("01-01-1990") : localDate3);

  const formatVaccineName = (str: string) => {
    return str.trim().toLowerCase().replace("/", "").replace(" ", "");
  }

  const unifyVaccineName = (input: string) => {
    const vaccineNames: Record<string, string> = {
      "Comirnaty COVID-19 mRNA Vaccine (BNT162b2) Concentrate for Dispersion for Injection": "BioNTech",
      "2019冠狀病毒病疫苗 (復必泰)": "BioNTech",
      "CoronaVac COVID-19 Vaccine (Vero Cell), Inactivated": "CoronaVac",
      "2019冠狀病毒病疫苗 (克爾來福)": "CoronaVac",
      "AstraZeneca COVID-19 Vaccine Vaxzevria COVID-19 Vaccine (ChAdOx1-S [recombinant]) AZD1222 Oxford/AstraZeneca": "AstraZeneca",
      "重組新型冠狀病毒疫苗(CHO 细胞) 智克威得 ZF2001": "ZF2001",
      "Covaxin BBV152": "Covaxin",
      "Comirnaty 復必泰 Tozinameran - COVID-19 mRNA vaccine (nucleoside modified) Pfizer-BioNTech COVID-19 Vaccine BNT162b2": "BioNTech",
      "Recombinant COVID-19 Vaccine (Adenovirus Type-5-Vectored Vaccine) 重組新型冠狀病毒疫苗(5 型腺病毒載體)) Convidecia 克威莎": "Convidecia",
      "SARS-COV-2 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗 (Vero 細胞) 科維福": "ChineseAcademy",
      "Janssen COVID-19 Vaccine 强生新冠疫苗 Janssen Ad26.COV2.S (COVID-19) vaccine 楊森 Ad26.COV2.S (COVID-19)疫苗": "Janssen",
      "Moderna COVID‑19 Vaccine 莫德納COVID-19 疫苗 mRNA-1273 vaccine": "Moderna",
      "Nuvaxovid NVX-CoV2373": "Nuvaxovid",
      "Covishield ChAdOx1 nCoV-19 Corona Virus Vaccine (Recombinant) AZD1222": "Covishield",
      "Covovax NVX-CoV2373": "Covovax",
      "SARS-COV-2 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗 (Vero 細胞) 可維克": "Kangtai",
      "COVID-19 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗(Vero 細胞) BBIBP-CorV 眾愛可維 COVID-19-i 新冠疫苗(Vero 細胞) SARS-COV-2 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗(Vero 細胞) COVID-19 Vaccine 新型冠狀病毒疫苗": "BBIBP-CorV",
      "COVID-19 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗(Vero 細胞) WIBP-CorV 眾康可維": "WIBP-CorV",
      "CoronaVac 克爾來福 COVID-19 Vaccine (Vero Cell), Inactivated 新型冠狀病毒滅活疫苗 (Vero 細胞)": "Kangtai",
    };

    if (Object.keys(vaccineNames).map((it) => formatVaccineName(it)).includes(formatVaccineName(input))) {
      return vaccineNames[formatVaccineName(input)];
    }

    return input.trim()
  }

  const getSortedDoseDates = (): Date[] => {
    const dates: Date[] = [];
    if (thirdLastDoseDate !== null) {
      dates.push(thirdLastDoseDate);
    }
    if (secondLastDoseDate !== null) {
      dates.push(secondLastDoseDate);
    }
    if (lastDoseDate !== null) {
      dates.push(lastDoseDate);
    }
    return dates;
  }

  const getEffectiveDoses = (): number => {
    return Math.max(getSortedDoseDates().length, vaccineSeq);
  }

  const firstDoseDate = (): Date | null => {
    const sortedDoseDates = getSortedDoseDates();
    if (sortedDoseDates.length === 0) {
        return null;
    }
    return sortedDoseDates[0];
  }

  const isApplyAdultRules = (): boolean => {
    return !isWithinAge18GracePeriod() && mAge.years >= 18;
  }


  const numOfDoseTakenByVaccineName = (str: string) => {
    const lowerCase: string = str.toLowerCase();
    let flag = (unifyVaccineName(lastVaccineName).toLowerCase().includes(lowerCase) || unifyVaccineName(lastVaccineNameTc).toLowerCase().includes(lowerCase)) ? 1 : 0;
    if (unifyVaccineName(secondLastVaccineName).toLowerCase().includes(lowerCase) || unifyVaccineName(secondLastVaccineNameTc).toLowerCase().includes(lowerCase)) {
      flag++;
    }
    return (unifyVaccineName(thirdLastVaccinePart1).toLowerCase().includes(lowerCase) || unifyVaccineName(thirdLastVaccinePart2).toLowerCase().includes(lowerCase)) ? flag + 1 : flag;
  }

  const isFulfilledNamedVaccineRequirementRecovery = (): boolean => {
    if (isApplyAdultRules()) {
      const requiredAdultDoses: Record<string, number> = {
        "AstraZeneca": 2,
        "ZF2001": 3,
        "Covaxin": 2,
        "BioNTech": 2,
        "Convidecia": 1,
        "SputnikV": 2,
        "ChineseAcademy": 2,
        "Janssen": 1,
        "Moderna": 2,
        "Nuvaxovid": 2,
        "Covishield": 2,
        "Covovax": 2,
        "Kangtai": 2,
        "BBIBP-CorV": 2,
        "WIBP-CorV": 2,
        "CoronaVac": 2,
      }
      for (const vaccName of Object.keys(requiredAdultDoses)) {
        if (numOfDoseTakenByVaccineName(vaccName) >= requiredAdultDoses[vaccName]) {
          return true;
        }
      }
      if (getEffectiveDoses() > 2) {
          return true;
      }
      if (getEffectiveDoses() === 2 && numOfDoseTakenByVaccineName("ZF2001") !== 2) {
          return true;
      }
    } else {
      const requiredNonAdultDoses: Record<string, number> = {
        "AstraZeneca": 1,
        "ZF2001": 1,
        "Covaxin": 1,
        "BioNTech": 1,
        "Convidecia": 1,
        "SputnikV": 1,
        "ChineseAcademy": 1,
        "Janssen": 1,
        "Moderna": 1,
        "Nuvaxovid": 1,
        "Covishield": 1,
        "Covovax": 1,
        "Kangtai": 1,
        "BBIBP-CorV": 1,
        "WIBP-CorV": 1,
        "CoronaVac": 2,
      }
      for (const vaccName of Object.keys(requiredNonAdultDoses)) {
        if (numOfDoseTakenByVaccineName(vaccName) >= requiredNonAdultDoses[vaccName]) {
          return true;
        }
      }
      if (getEffectiveDoses() > 1) {
        return true;
      }
      if (getEffectiveDoses() === 1 && numOfDoseTakenByVaccineName("CoronaVac") !== 1) {
        return true;
      }
    }
    if (isLastDoseDateWithinGracePeriod()) {
        if (!isApplyAdultRules()) {
            return getEffectiveDoses() >= 1;
        }
        const requiredDoses: Record<string, number> = {
          "AstraZeneca": 1,
          "ZF2001": 2,
          "Covaxin": 1,
          "BioNTech": 1,
          "SputnikV": 1,
          "ChineseAcademy": 1,
          "Moderna": 1,
          "Nuvaxovid": 1,
          "Covishield": 1,
          "Covovax": 1,
          "Kangtai": 1,
          "BBIBP-CorV": 1,
          "WIBP-CorV": 1,
          "CoronaVac": 1,  
        }
        for (const vaccName of Object.keys(requiredDoses)) {
            if (numOfDoseTakenByVaccineName(vaccName) >= requiredDoses[vaccName]) {
                return true;
            }
        }
        return getEffectiveDoses() >= 1;
    }
    return false;
  }

  const isFulfilledNamedVaccineRequirementStage1 = () => {
    return getEffectiveDoses() >= 1;
  }

  const isFulfilledNamedVaccineRequirementStage2 = () => {
    const stageTwoRequirements: Record<string, number> = {
      "AstraZeneca": 2,
      "ZF2001": 3,
      "Covaxin": 2,
      "BioNTech": 2,
      "Convidecia": 1,
      "SputnikV": 2,
      "ChineseAcademy": 2,
      "Janssen": 1,
      "Moderna": 2,
      "Nuvaxovid": 2,
      "Covishield": 2,
      "Covovax": 2,
      "Kangtai": 2,
      "BBIBP-CorV": 2,
      "WIBP-CorV": 2,
      "CoronaVac": 2,
    };
    for (const vaccName of Object.keys(stageTwoRequirements)) {
      if (numOfDoseTakenByVaccineName(vaccName) >= stageTwoRequirements[vaccName]) {
        return true;
      }
    }
    if (getEffectiveDoses() > 2) {
        return true;
    }
    if (getEffectiveDoses() === 2 && numOfDoseTakenByVaccineName("ZF2001") !== 2) {
        return true;
    }
    if (isApplyAdultRules() || !isLastDoseDateWithinGracePeriod()) {
        return false;
    }
    if (getEffectiveDoses() === 1 && numOfDoseTakenByVaccineName("ZF2001") !== 1) {
        return true;
    }
    return getEffectiveDoses() === 2 && numOfDoseTakenByVaccineName("ZF2001") === 2;
  }

  const isFulfilledNamedVaccineRequirementStage3 = (): boolean => {
    const effectiveDoses = getEffectiveDoses();
    if (effectiveDoses >= 4) {
        return true;
    }
    if (effectiveDoses === 3) {
        if (numOfDoseTakenByVaccineName("ZF2001") !== 3) {
            return true;
        }
        return isLastDoseDateWithinGracePeriod();
    } else if (effectiveDoses !== 2) {
        return isLastDoseDateWithinGracePeriod() && (numOfDoseTakenByVaccineName("Janssen") >= 1 || numOfDoseTakenByVaccineName("Convidecia") >= 1);
    } else if (numOfDoseTakenByVaccineName("Janssen") >= 1 || numOfDoseTakenByVaccineName("Convidecia") >= 1) {
        return true;
    } else {
        if (numOfDoseTakenByVaccineName("ZF2001") !== 2) {
            return isLastDoseDateWithinGracePeriod();
        }
        return false;
    }
  }

  const isLastDoseDateWithinGracePeriod = (): boolean => {
    return differenceInCalendarDays(lastDoseDate ?? new Date(), new Date()) <= 180;
  }

  const isRecoveryCase = (): boolean => {
    return specialIndicator1 === ("001") || specialIndicator2 === ("001");
  }

  const vpFailResult = (): VacCase => {
    return dob !== null ? VacCase.VP_FAIL : VacCase.OLD_VP_FAIL;
  }

  const vpSuccessResult = (): VacCase => {
    return dob !== null ? VacCase.VP_SUCCESS : VacCase.OLD_VP_SUCCESS;
  }

  const isWithinAge12GracePeriod = (): boolean => {
    return mAge.years === 12 && mAge.days <= 90;
  }

  const isWithinAge18GracePeriod = (): boolean => {
    return mAge.years === 18 && mAge.days <= 90;
  }

  const checkVacCase = () => {
    const mCurrentDate = new Date()
    const localDate = thirdLastDoseDate;
    if (localDate !== null && differenceInCalendarDays(mCurrentDate, localDate) < 0) {
        return VacCase.INVALID;
    }
    const localDate2 = secondLastDoseDate;
    if (localDate2 !== null && differenceInCalendarDays(mCurrentDate, localDate2) < 0) {
        return VacCase.INVALID;
    }
    const localDate3 = lastDoseDate;
    if (localDate3 !== null && differenceInCalendarDays(mCurrentDate, localDate3) < 0) {
        return VacCase.INVALID;
    }
    if (specialIndicator1 === ("002") || specialIndicator1 === ("003") || specialIndicator1 === ("007")) {
        const localDate4 = expiryDate;
        if (localDate4 === null) {
            return VacCase.INVALID;
        }
        try {
            const f6 = differenceInCalendarDays(mCurrentDate, localDate4);
            let caseNumber: number | null = null;
            switch (specialIndicator1) {
                case "002":
                  caseNumber = 0;
                  break;
                case "003":
                  caseNumber = 1;
                  break;
                case "007":
                  caseNumber = 2;
                  break;
            }
            switch (caseNumber) {
              case 0:
                return f6 < 0 ? VacCase.UNFIT_EXPIRED : VacCase.UNFIT_VALID;
              case AppParameters.SCHEMA_VERSION /* 1 */:
                return f6 < 0 ? VacCase.RCY_EXPIRED : VacCase.RCY_VALID;
              case AppParameters.DUPLICATION_NUMBER /* 2 */:
                return f6 < 0 ? VacCase.PVP_EXPIRED : VacCase.PVP_VALID;
            }
        } catch (e) {
          return VacCase.INVALID;
        }
    }
    return (isWithinAge12GracePeriod() || mAge.years < 12) ? vpSuccessResult() : (differenceInCalendarDays(mCurrentDate, phase1Start) < 0 || differenceInCalendarDays(mCurrentDate, phase2Start) >= 0) ? isRecoveryCase() ? isFulfilledNamedVaccineRequirementRecovery() ? vpSuccessResult() : vpFailResult() : (differenceInCalendarDays(mCurrentDate, phase2Start) < 0 || differenceInCalendarDays(mCurrentDate, phase3Start) >= 0) ? isFulfilledNamedVaccineRequirementStage3() ? vpSuccessResult() : vpFailResult() : isFulfilledNamedVaccineRequirementStage2() ? vpSuccessResult() : vpFailResult() : isFulfilledNamedVaccineRequirementStage1() ? vpSuccessResult() : vpFailResult();
  }

  const vaccinations = [];

  if (lastDoseDate) {
    vaccinations.push({
      name: lastVaccineName,
      date: lastDoseDate,
    });
  }

  if (secondLastDoseDate) {
    vaccinations.push({
      name: secondLastVaccineName,
      date: secondLastDoseDate,
    });
  }

  if (thirdLastDoseDate) {
    vaccinations.push({
      name: thirdLastVaccinePart1,
      date: thirdLastDoseDate,
    });
  }

  return {
    vaccinationStatus: checkVacCase(),
    vaccinations,
  }
}