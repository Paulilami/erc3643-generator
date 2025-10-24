import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenConfig, DeployedTokenSuite, ContractAddresses } from '../types/token.types';

interface TokenState {
  currentStep: number;
  config: Partial<TokenConfig>;
  deployedSuite: DeployedTokenSuite | null;
  contractAddresses: ContractAddresses | null;
  isDeploying: boolean;
  deploymentError: string | null;
  isDeployingContracts: boolean;
  contractDeploymentError: string | null;
}

const initialState: TokenState = {
  currentStep: 0,
  config: {
    decimals: 18,
    claimTopics: [],
    trustedIssuers: [],
    issuerClaimTopics: [],
    maxInvestors: 2000,
    allowedCountries: [],
  },
  deployedSuite: null,
  contractAddresses: null,
  isDeploying: false,
  deploymentError: null,
  isDeployingContracts: false,
  contractDeploymentError: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateConfig: (state, action: PayloadAction<Partial<TokenConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    setDeploying: (state, action: PayloadAction<boolean>) => {
      state.isDeploying = action.payload;
    },
    setDeployedSuite: (state, action: PayloadAction<DeployedTokenSuite>) => {
      state.deployedSuite = action.payload;
      state.isDeploying = false;
    },
    setDeploymentError: (state, action: PayloadAction<string | null>) => {
      state.deploymentError = action.payload;
      state.isDeploying = false;
    },
    setContractAddresses: (state, action: PayloadAction<ContractAddresses | null>) => {
      state.contractAddresses = action.payload;
      state.isDeployingContracts = false;
      state.contractDeploymentError = null;
    },
    setDeployingContracts: (state, action: PayloadAction<boolean>) => {
      state.isDeployingContracts = action.payload;
    },
    setContractDeploymentError: (state, action: PayloadAction<string | null>) => {
      state.contractDeploymentError = action.payload;
      state.isDeployingContracts = false;
    },
    resetWizard: (state) => {
      state.currentStep = 0;
      state.config = initialState.config;
      state.deployedSuite = null;
      state.deploymentError = null;
      state.contractAddresses = null;
      state.contractDeploymentError = null;
    },
  },
});

export const {
  setCurrentStep,
  updateConfig,
  setDeploying,
  setDeployedSuite,
  setDeploymentError,
  setContractAddresses,
  setDeployingContracts,
  setContractDeploymentError,
  resetWizard,
} = tokenSlice.actions;

export default tokenSlice.reducer;