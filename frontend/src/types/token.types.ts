export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply?: string;
  claimTopics: number[];
  trustedIssuers: string[];
  issuerClaimTopics: number[][];
  maxInvestors: number;
  maxTokensPerInvestor?: string;
  allowedCountries?: string[];
}

export interface DeployedTokenSuite {
  token: string;
  identityRegistry: string;
  identityRegistryStorage: string;
  compliance: string;
  claimTopicsRegistry: string;
  trustedIssuersRegistry: string;
  deployer: string;
  timestamp: number;
}

export interface CompliancePreset {
  name: string;
  description: string;
  maxInvestors: number;
  maxTokensPerInvestor?: string;
  claimTopics: number[];
}

export interface ContractAddresses {
  implementations: {
    token: string;
    claimTopicsRegistry: string;
    trustedIssuersRegistry: string;
    identityRegistryStorage: string;
    identityRegistry: string;
    modularCompliance: string;
  };
  implementationAuthority: string;
  trexFactory: string;
  trexGateway: string;
}
