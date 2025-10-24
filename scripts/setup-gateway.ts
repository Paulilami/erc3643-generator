import { ethers } from 'hardhat';
import addresses from '../frontend/src/contracts/addresses.json';

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('🔧 Configuring TREXGateway for local testing...');
  console.log('Deployer:', deployer.address);

  const gateway = await ethers.getContractAt(
    'TREXGateway',
    addresses.trexGateway
  );

  const isPublic = await gateway.getPublicDeploymentStatus();
  
  if (!isPublic) {
    console.log('📝 Enabling public deployments...');
    const tx = await gateway.setPublicDeploymentStatus(true);
    await tx.wait();
    console.log('✅ Public deployments enabled');
  } else {
    console.log('✅ Public deployments already enabled');
  }

  console.log('🎉 Gateway configuration complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });