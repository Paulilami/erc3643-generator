import { CompliancePreset } from '../types/token.types';

export const CLAIM_TOPICS = {
  KYC: 1,
  AML: 2,
  ACCREDITATION: 3,
  INVESTOR_TYPE: 4,
};

export const compliancePresets: CompliancePreset[] = [
  {
    name: 'Standard Compliance',
    description: 'Basic KYC requirement with 2000 investor limit',
    maxInvestors: 2000,
    claimTopics: [CLAIM_TOPICS.KYC],
  },
  {
    name: 'Accredited Investors Only',
    description: 'For accredited/professional investors with KYC and accreditation verification',
    maxInvestors: 500,
    claimTopics: [CLAIM_TOPICS.KYC, CLAIM_TOPICS.ACCREDITATION],
  },
  {
    name: 'Enhanced Due Diligence',
    description: 'Full compliance suite including KYC, AML, and investor type verification',
    maxInvestors: 1000,
    claimTopics: [CLAIM_TOPICS.KYC, CLAIM_TOPICS.AML, CLAIM_TOPICS.INVESTOR_TYPE],
  },
  {
    name: 'Institutional Only',
    description: 'For institutional investors with enhanced verification',
    maxInvestors: 200,
    claimTopics: [CLAIM_TOPICS.KYC, CLAIM_TOPICS.AML, CLAIM_TOPICS.ACCREDITATION],
  },
];