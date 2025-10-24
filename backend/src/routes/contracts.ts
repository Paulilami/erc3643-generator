import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const deploymentCache = new Map<string, any>();

const CONTRACT_NAMES = [
  'Token',
  'ClaimTopicsRegistry',
  'TrustedIssuersRegistry',
  'IdentityRegistryStorage',
  'IdentityRegistry',
  'ModularCompliance',
  'TREXImplementationAuthority',
  'IdFactory',
  'TREXFactory',
  'TREXGateway',
];

function findArtifact(dir: string, contractName: string): string | null {
  if (!fs.existsSync(dir)) {
    return null;
  }

  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const result = findArtifact(fullPath, contractName);
        if (result) return result;
      } else if (item === `${contractName}.json`) {
        return fullPath;
      }
    }
  } catch (error: any) {
    return null;
  }
  
  return null;
}

router.get('/artifacts', (req, res) => {
  try {
    console.log('\n🔍 Loading contract artifacts...');
    
    const artifacts: any = {};
    const rootDir = path.resolve(__dirname, '../../..');
    const artifactsDir = path.join(rootDir, 'artifacts');

    console.log('Root directory:', rootDir);
    console.log('Artifacts directory:', artifactsDir);

    if (!fs.existsSync(artifactsDir)) {
      console.error('❌ Artifacts directory does not exist:', artifactsDir);
      return res.status(500).json({ 
        error: 'Artifacts directory not found. Run: npx hardhat compile',
        path: artifactsDir
      });
    }

    for (const contractName of CONTRACT_NAMES) {
      console.log(`\nSearching for ${contractName}...`);
      const artifactPath = findArtifact(artifactsDir, contractName);
      
      if (!artifactPath) {
        console.error(`❌ ${contractName} not found`);
        return res.status(500).json({ 
          error: `${contractName} artifact not found. Run: npx hardhat compile`,
          contractName
        });
      }

      try {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        artifacts[contractName] = {
          abi: artifact.abi,
          bytecode: artifact.bytecode,
        };
        console.log(`✅ Loaded ${contractName} from ${artifactPath}`);
      } catch (error: any) {
        console.error(`❌ Failed to parse ${contractName}:`, error.message);
        return res.status(500).json({ 
          error: `Failed to parse ${contractName}: ${error.message}`,
          contractName
        });
      }
    }

    console.log('\n✅ All artifacts loaded successfully\n');
    res.json(artifacts);
  } catch (error: any) {
    console.error('❌ Error loading artifacts:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to load artifacts',
      stack: error.stack
    });
  }
});

router.post('/save-deployment', (req, res) => {
  try {
    const { userAddress, chainId, deployment } = req.body;
    
    if (!userAddress || !chainId || !deployment) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const key = `${userAddress.toLowerCase()}-${chainId}`;
    deploymentCache.set(key, { 
      ...deployment, 
      deployedAt: new Date().toISOString(), 
      userAddress, 
      chainId 
    });

    console.log(`✅ Saved deployment for ${userAddress} on chain ${chainId}`);
    res.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error saving deployment:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/deployment/:userAddress/:chainId', (req, res) => {
  try {
    const { userAddress, chainId } = req.params;
    const key = `${userAddress.toLowerCase()}-${chainId}`;
    const deployment = deploymentCache.get(key);

    if (!deployment) {
      return res.status(404).json({ error: 'No deployment found' });
    }

    console.log(`✅ Retrieved deployment for ${userAddress} on chain ${chainId}`);
    res.json(deployment);
  } catch (error: any) {
    console.error('❌ Error retrieving deployment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;