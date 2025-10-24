import { ethers } from 'ethers';
import { TokenConfig, DeployedTokenSuite, ContractAddresses } from '../types/token.types';

const TREX_GATEWAY_ABI = [
  "function deployTREXSuite((address owner, string name, string symbol, uint8 decimals, address irs, address ONCHAINID, address[] irAgents, address[] tokenAgents, address[] complianceModules, bytes[] complianceSettings) _tokenDetails, (uint256[] claimTopics, address[] issuers, uint256[][] issuerClaims) _claimDetails) external",
  "function getPublicDeploymentStatus() external view returns(bool)",
  "function isDeployer(address deployer) external view returns(bool)",
  "event GatewaySuiteDeploymentProcessed(address indexed requester, address intendedOwner, uint256 feeApplied)"
];

const TREX_FACTORY_ABI = [
  "function getToken(string calldata _salt) external view returns(address)",
  "event TREXSuiteDeployed(address indexed _token, address _ir, address _irs, address _tir, address _ctr, address _mc, string indexed _salt)"
];

export async function deployTokenSuite(
  config: TokenConfig,
  signer: ethers.Signer,
  contractAddresses: ContractAddresses
): Promise<DeployedTokenSuite> {
  try {
    const provider = signer.provider;
    if (!provider) {
      throw new Error('No provider available from signer');
    }

    const ownerAddress = await signer.getAddress();

    const gateway = new ethers.Contract(
      contractAddresses.trexGateway,
      TREX_GATEWAY_ABI,
      signer
    );

    const factory = new ethers.Contract(
      contractAddresses.trexFactory,
      TREX_FACTORY_ABI,
      provider
    );

    const [isPublic, isDeployer] = await Promise.all([
      gateway.getPublicDeploymentStatus(),
      gateway.isDeployer(ownerAddress)
    ]);
    
    if (!isPublic && !isDeployer) {
      throw new Error('You are not authorized to deploy tokens.');
    }

    const tokenDetails = {
      owner: ownerAddress,
      name: config.name,
      symbol: config.symbol,
      decimals: config.decimals,
      irs: ethers.constants.AddressZero,
      ONCHAINID: ethers.constants.AddressZero,
      irAgents: [ownerAddress],
      tokenAgents: [ownerAddress],
      complianceModules: [],
      complianceSettings: [],
    };

    const claimDetails = {
      claimTopics: config.claimTopics,
      issuers: config.trustedIssuers || [],
      issuerClaims: (config.trustedIssuers || []).map((_, index) => 
        config.issuerClaimTopics?.[index] || config.claimTopics
      ),
    };

    let gasLimit = 8000000;
    try {
      const gasEstimate = await gateway.estimateGas.deployTREXSuite(
        tokenDetails,
        claimDetails
      );
      gasLimit = Math.floor(gasEstimate.toNumber() * 1.2);
    } catch (e) {
      console.warn('Could not estimate gas, using default');
    }

    const tx = await gateway.deployTREXSuite(
      tokenDetails,
      claimDetails,
      { gasLimit }
    );

    const receipt = await tx.wait();

    const factoryIface = new ethers.utils.Interface(TREX_FACTORY_ABI);
    let trexEvent = null;

    for (const log of receipt.logs) {
      try {
        const parsed = factoryIface.parseLog(log);
        if (parsed.name === 'TREXSuiteDeployed') {
          trexEvent = parsed;
          break;
        }
      } catch (e) {}
    }

    if (!trexEvent) {
      throw new Error('TREXSuiteDeployed event not found');
    }

    const deployedSuite: DeployedTokenSuite = {
      token: trexEvent.args._token,
      identityRegistry: trexEvent.args._ir,
      identityRegistryStorage: trexEvent.args._irs,
      compliance: trexEvent.args._mc,
      claimTopicsRegistry: trexEvent.args._ctr,
      trustedIssuersRegistry: trexEvent.args._tir,
      deployer: ownerAddress,
      timestamp: Date.now(),
    };

    return deployedSuite;

  } catch (error: any) {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for deployment.');
    }
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
      throw new Error('Transaction was rejected.');
    }
    throw new Error(error.reason || error.message || 'Deployment failed');
  }
}

export function getExplorerUrl(address: string, chainId: number): string {
  const explorers: { [key: number]: string } = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    31337: '',
    1337: '',
  };

  const baseUrl = explorers[chainId];
  if (!baseUrl) return '';
  
  return `${baseUrl}/address/${address}`;
}