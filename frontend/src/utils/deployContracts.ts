import axios from 'axios';
import { ethers } from 'ethers';
import { ContractAddresses } from '../types/token.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface DeploymentProgress {
  step: string;
  status: 'deploying' | 'complete' | 'error';
  address?: string;
  error?: string;
}

interface ContractArtifacts {
  [key: string]: {
    abi: any[];
    bytecode: string;
  };
}

async function loadArtifacts(): Promise<ContractArtifacts> {
  const response = await axios.get(`${API_URL}/contracts/artifacts`, {
    timeout: 30000,
  });
  return response.data;
}

export async function deployContractsWithProgress(
  chainId: number,
  userAddress: string,
  signer: ethers.Signer,
  onProgress: (progress: DeploymentProgress) => void
): Promise<ContractAddresses> {
  try {
    console.log('🚀 Starting deployment...');
    
    onProgress({ step: 'Loading artifacts', status: 'deploying' });
    const artifacts = await loadArtifacts();
    console.log('✅ Artifacts loaded');
    
    if (!artifacts['IdFactory']) {
      throw new Error('IdFactory artifact not found');
    }
    
    onProgress({ step: 'Loading artifacts', status: 'complete' });

    // Deploy Token Implementation
    console.log('\n📦 Deploying Token...');
    onProgress({ step: 'Token', status: 'deploying' });
    const TokenFactory = new ethers.ContractFactory(artifacts['Token'].abi, artifacts['Token'].bytecode, signer);
    const tokenImplementation = await TokenFactory.deploy();
    await tokenImplementation.deployed();
    console.log('✅ Token deployed:', tokenImplementation.address);
    onProgress({ step: 'Token', status: 'complete', address: tokenImplementation.address });

    // Deploy ClaimTopicsRegistry Implementation
    console.log('\n📦 Deploying ClaimTopicsRegistry...');
    onProgress({ step: 'ClaimTopicsRegistry', status: 'deploying' });
    const CTRFactory = new ethers.ContractFactory(artifacts['ClaimTopicsRegistry'].abi, artifacts['ClaimTopicsRegistry'].bytecode, signer);
    const claimTopicsRegistryImplementation = await CTRFactory.deploy();
    await claimTopicsRegistryImplementation.deployed();
    console.log('✅ ClaimTopicsRegistry deployed:', claimTopicsRegistryImplementation.address);
    onProgress({ step: 'ClaimTopicsRegistry', status: 'complete', address: claimTopicsRegistryImplementation.address });

    // Deploy TrustedIssuersRegistry Implementation
    console.log('\n📦 Deploying TrustedIssuersRegistry...');
    onProgress({ step: 'TrustedIssuersRegistry', status: 'deploying' });
    const TIRFactory = new ethers.ContractFactory(artifacts['TrustedIssuersRegistry'].abi, artifacts['TrustedIssuersRegistry'].bytecode, signer);
    const trustedIssuersRegistryImplementation = await TIRFactory.deploy();
    await trustedIssuersRegistryImplementation.deployed();
    console.log('✅ TrustedIssuersRegistry deployed:', trustedIssuersRegistryImplementation.address);
    onProgress({ step: 'TrustedIssuersRegistry', status: 'complete', address: trustedIssuersRegistryImplementation.address });

    // Deploy IdentityRegistryStorage Implementation
    console.log('\n📦 Deploying IdentityRegistryStorage...');
    onProgress({ step: 'IdentityRegistryStorage', status: 'deploying' });
    const IRSFactory = new ethers.ContractFactory(artifacts['IdentityRegistryStorage'].abi, artifacts['IdentityRegistryStorage'].bytecode, signer);
    const identityRegistryStorageImplementation = await IRSFactory.deploy();
    await identityRegistryStorageImplementation.deployed();
    console.log('✅ IdentityRegistryStorage deployed:', identityRegistryStorageImplementation.address);
    onProgress({ step: 'IdentityRegistryStorage', status: 'complete', address: identityRegistryStorageImplementation.address });

    // Deploy IdentityRegistry Implementation
    console.log('\n📦 Deploying IdentityRegistry...');
    onProgress({ step: 'IdentityRegistry', status: 'deploying' });
    const IRFactory = new ethers.ContractFactory(artifacts['IdentityRegistry'].abi, artifacts['IdentityRegistry'].bytecode, signer);
    const identityRegistryImplementation = await IRFactory.deploy();
    await identityRegistryImplementation.deployed();
    console.log('✅ IdentityRegistry deployed:', identityRegistryImplementation.address);
    onProgress({ step: 'IdentityRegistry', status: 'complete', address: identityRegistryImplementation.address });

    // Deploy ModularCompliance Implementation
    console.log('\n📦 Deploying ModularCompliance...');
    onProgress({ step: 'ModularCompliance', status: 'deploying' });
    const MCFactory = new ethers.ContractFactory(artifacts['ModularCompliance'].abi, artifacts['ModularCompliance'].bytecode, signer);
    const modularComplianceImplementation = await MCFactory.deploy();
    await modularComplianceImplementation.deployed();
    console.log('✅ ModularCompliance deployed:', modularComplianceImplementation.address);
    onProgress({ step: 'ModularCompliance', status: 'complete', address: modularComplianceImplementation.address });

    // Deploy TREXImplementationAuthority
    console.log('\n📦 Deploying TREXImplementationAuthority...');
    onProgress({ step: 'TREXImplementationAuthority', status: 'deploying' });
    const ImplAuthFactory = new ethers.ContractFactory(artifacts['TREXImplementationAuthority'].abi, artifacts['TREXImplementationAuthority'].bytecode, signer);
    const implementationAuthority = await ImplAuthFactory.deploy(
      true,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero
    );
    await implementationAuthority.deployed();
    console.log('✅ TREXImplementationAuthority deployed:', implementationAuthority.address);
    onProgress({ step: 'TREXImplementationAuthority', status: 'complete', address: implementationAuthority.address });

    // Add TREX version
    console.log('\n🔧 Adding TREX version...');
    onProgress({ step: 'Adding TREX version', status: 'deploying' });
    const addVersionTx = await implementationAuthority.addAndUseTREXVersion(
      { major: 4, minor: 0, patch: 0 },
      {
        tokenImplementation: tokenImplementation.address,
        ctrImplementation: claimTopicsRegistryImplementation.address,
        irImplementation: identityRegistryImplementation.address,
        irsImplementation: identityRegistryStorageImplementation.address,
        tirImplementation: trustedIssuersRegistryImplementation.address,
        mcImplementation: modularComplianceImplementation.address,
      }
    );
    console.log('⏳ Waiting for addAndUseTREXVersion transaction...');
    await addVersionTx.wait();
    console.log('✅ TREX version added');
    onProgress({ step: 'Adding TREX version', status: 'complete' });

    // Deploy IdFactory
    console.log('\n📦 Deploying IdFactory...');
    onProgress({ step: 'IdFactory', status: 'deploying' });
    const IdFactoryFactory = new ethers.ContractFactory(artifacts['IdFactory'].abi, artifacts['IdFactory'].bytecode, signer);
    const idFactory = await IdFactoryFactory.deploy(implementationAuthority.address);
    await idFactory.deployed();
    console.log('✅ IdFactory deployed:', idFactory.address);
    onProgress({ step: 'IdFactory', status: 'complete', address: idFactory.address });

    // Deploy TREXFactory
    console.log('\n📦 Deploying TREXFactory...');
    onProgress({ step: 'TREXFactory', status: 'deploying' });
    const TREXFactoryFactory = new ethers.ContractFactory(artifacts['TREXFactory'].abi, artifacts['TREXFactory'].bytecode, signer);
    const trexFactory = await TREXFactoryFactory.deploy(implementationAuthority.address, idFactory.address);
    await trexFactory.deployed();
    console.log('✅ TREXFactory deployed:', trexFactory.address);
    onProgress({ step: 'TREXFactory', status: 'complete', address: trexFactory.address });

    // Set TREXFactory in Implementation Authority
    console.log('\n🔧 Setting TREX Factory...');
    onProgress({ step: 'Setting TREX Factory', status: 'deploying' });
    try {
      const setFactoryTx = await implementationAuthority.setTREXFactory(trexFactory.address);
      console.log('⏳ Waiting for setTREXFactory transaction...');
      await setFactoryTx.wait();
      console.log('✅ TREX Factory set');
      onProgress({ step: 'Setting TREX Factory', status: 'complete' });
    } catch (error: any) {
      console.error('❌ setTREXFactory failed:', error);
      throw new Error(`setTREXFactory failed: ${error.message || error.reason || 'Unknown error'}`);
    }

    // Deploy TREXGateway
    console.log('\n📦 Deploying TREXGateway...');
    onProgress({ step: 'TREXGateway', status: 'deploying' });
    try {
      const TREXGatewayFactory = new ethers.ContractFactory(artifacts['TREXGateway'].abi, artifacts['TREXGateway'].bytecode, signer);
      const trexGateway = await TREXGatewayFactory.deploy(trexFactory.address, userAddress);
      await trexGateway.deployed();
      console.log('✅ TREXGateway deployed:', trexGateway.address);
      onProgress({ step: 'TREXGateway', status: 'complete', address: trexGateway.address });

      // Transfer ownership
      console.log('\n🔧 Transferring ownership...');
      onProgress({ step: 'Transferring ownership', status: 'deploying' });
      const ownershipTx = await trexFactory.transferOwnership(trexGateway.address);
      console.log('⏳ Waiting for transferOwnership transaction...');
      await ownershipTx.wait();
      console.log('✅ Ownership transferred');
      onProgress({ step: 'Transferring ownership', status: 'complete' });

      // Configure gateway
      console.log('\n🔧 Configuring gateway...');
      onProgress({ step: 'Configuring gateway', status: 'deploying' });
      const configTx = await trexGateway.setPublicDeploymentStatus(true);
      console.log('⏳ Waiting for setPublicDeploymentStatus transaction...');
      await configTx.wait();
      console.log('✅ Gateway configured');
      onProgress({ step: 'Configuring gateway', status: 'complete' });

      const result: ContractAddresses = {
        implementations: {
          token: tokenImplementation.address,
          claimTopicsRegistry: claimTopicsRegistryImplementation.address,
          trustedIssuersRegistry: trustedIssuersRegistryImplementation.address,
          identityRegistryStorage: identityRegistryStorageImplementation.address,
          identityRegistry: identityRegistryImplementation.address,
          modularCompliance: modularComplianceImplementation.address,
        },
        implementationAuthority: implementationAuthority.address,
        trexFactory: trexFactory.address,
        trexGateway: trexGateway.address,
      };

      await saveDeployment(userAddress, chainId, result);
      console.log('\n🎉 Deployment complete!');
      return result;
    } catch (error: any) {
      console.error('❌ Error in final steps:', error);
      throw error;
    }

  } catch (error: any) {
    console.error('❌ Deployment error:', error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for deployment. Please add more funds to your wallet.');
    }
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
      throw new Error('Transaction was rejected by user.');
    }
    
    throw new Error(error.reason || error.message || 'Deployment failed');
  }
}

async function saveDeployment(
  userAddress: string,
  chainId: number,
  deployment: ContractAddresses
): Promise<void> {
  try {
    await axios.post(`${API_URL}/contracts/save-deployment`, { userAddress, chainId, deployment });
  } catch (error) {
    console.warn('Failed to save deployment:', error);
  }
}

export async function getDeployedContracts(
  userAddress: string,
  chainId: number
): Promise<ContractAddresses | null> {
  try {
    const response = await axios.get(`${API_URL}/contracts/deployment/${userAddress}/${chainId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    return null;
  }
}