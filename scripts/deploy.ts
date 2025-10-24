import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying Official T-REX Infrastructure...\n");
  
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error(
      "No signers available. Please add PRIVATE_KEY to your .env file.\n" +
      "Example: PRIVATE_KEY=0xYourPrivateKeyHere"
    );
  }
  
  const deployer = signers[0];
  const balance = await deployer.getBalance();
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "ETH\n");
  
  if (balance.isZero()) {
    throw new Error(
      `Deployer address ${deployer.address} has 0 ETH balance.\n` +
      "Please fund this address with Sepolia testnet ETH from https://sepoliafaucet.com/"
    );
  }

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("");

  console.log("📦 Deploying Implementation Contracts...");
  
  const TokenImplementation = await ethers.getContractFactory("Token");
  const tokenImplementation = await TokenImplementation.deploy();
  await tokenImplementation.deployed();
  console.log("✅ Token Implementation:", tokenImplementation.address);

  const ClaimTopicsRegistryImplementation = await ethers.getContractFactory("ClaimTopicsRegistry");
  const claimTopicsRegistryImplementation = await ClaimTopicsRegistryImplementation.deploy();
  await claimTopicsRegistryImplementation.deployed();
  console.log("✅ ClaimTopicsRegistry Implementation:", claimTopicsRegistryImplementation.address);

  const TrustedIssuersRegistryImplementation = await ethers.getContractFactory("TrustedIssuersRegistry");
  const trustedIssuersRegistryImplementation = await TrustedIssuersRegistryImplementation.deploy();
  await trustedIssuersRegistryImplementation.deployed();
  console.log("✅ TrustedIssuersRegistry Implementation:", trustedIssuersRegistryImplementation.address);

  const IdentityRegistryStorageImplementation = await ethers.getContractFactory("IdentityRegistryStorage");
  const identityRegistryStorageImplementation = await IdentityRegistryStorageImplementation.deploy();
  await identityRegistryStorageImplementation.deployed();
  console.log("✅ IdentityRegistryStorage Implementation:", identityRegistryStorageImplementation.address);

  const IdentityRegistryImplementation = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistryImplementation = await IdentityRegistryImplementation.deploy();
  await identityRegistryImplementation.deployed();
  console.log("✅ IdentityRegistry Implementation:", identityRegistryImplementation.address);

  const ModularComplianceImplementation = await ethers.getContractFactory("ModularCompliance");
  const modularComplianceImplementation = await ModularComplianceImplementation.deploy();
  await modularComplianceImplementation.deployed();
  console.log("✅ ModularCompliance Implementation:", modularComplianceImplementation.address);

  console.log("\n📦 Deploying TREXImplementationAuthority...");
  const ImplementationAuthority = await ethers.getContractFactory("TREXImplementationAuthority");
  const implementationAuthority = await ImplementationAuthority.deploy(
    true,
    ethers.constants.AddressZero,
    ethers.constants.AddressZero
  );
  await implementationAuthority.deployed();
  console.log("✅ Implementation Authority:", implementationAuthority.address);

  console.log("\n🔧 Adding TREX version to Implementation Authority...");
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
  await addVersionTx.wait();
  console.log("✅ TREX version 4.0.0 added and activated");

  console.log("\n📦 Deploying IdFactory...");
  const IdFactory = await ethers.getContractFactory("IdFactory");
  const idFactory = await IdFactory.deploy(implementationAuthority.address);
  await idFactory.deployed();
  console.log("✅ IdFactory:", idFactory.address);

  console.log("\n📦 Deploying TREXFactory...");
  const TREXFactory = await ethers.getContractFactory("TREXFactory");
  const trexFactory = await TREXFactory.deploy(implementationAuthority.address, idFactory.address);
  await trexFactory.deployed();
  console.log("✅ TREXFactory:", trexFactory.address);

  console.log("\n🔧 Setting TREXFactory in Implementation Authority...");
  const setFactoryTx = await implementationAuthority.setTREXFactory(trexFactory.address);
  await setFactoryTx.wait();
  console.log("✅ TREX Factory configured");

  console.log("\n📦 Deploying TREXGateway...");
  const TREXGateway = await ethers.getContractFactory("TREXGateway");
  const trexGateway = await TREXGateway.deploy(trexFactory.address, deployer.address);
  await trexGateway.deployed();
  console.log("✅ TREXGateway:", trexGateway.address);

  const addresses = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    implementations: {
      token: tokenImplementation.address,
      claimTopicsRegistry: claimTopicsRegistryImplementation.address,
      trustedIssuersRegistry: trustedIssuersRegistryImplementation.address,
      identityRegistryStorage: identityRegistryStorageImplementation.address,
      identityRegistry: identityRegistryImplementation.address,
      modularCompliance: modularComplianceImplementation.address,
    },
    implementationAuthority: implementationAuthority.address,
    idFactory: idFactory.address,
    trexFactory: trexFactory.address,
    trexGateway: trexGateway.address,
    deployedAt: new Date().toISOString(),
  };

  const frontendPath = path.join(__dirname, "../frontend/src/contracts/addresses.json");
  fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
  fs.writeFileSync(frontendPath, JSON.stringify(addresses, null, 2));
  console.log("\n✅ Addresses saved to:", frontendPath);

  const abisPath = path.join(__dirname, "../frontend/src/contracts/abis");
  fs.mkdirSync(abisPath, { recursive: true });
  
  const factoryArtifact = await ethers.getContractFactory("TREXFactory");
  fs.writeFileSync(
    path.join(abisPath, "TREXFactory.json"),
    JSON.stringify({ abi: factoryArtifact.interface.format(ethers.utils.FormatTypes.json) }, null, 2)
  );
  console.log("✅ Saved ABI: TREXFactory");

  const gatewayArtifact = await ethers.getContractFactory("TREXGateway");
  fs.writeFileSync(
    path.join(abisPath, "TREXGateway.json"),
    JSON.stringify({ abi: gatewayArtifact.interface.format(ethers.utils.FormatTypes.json) }, null, 2)
  );
  console.log("✅ Saved ABI: TREXGateway");

  console.log("\n🎉 Deployment Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Factory:", trexFactory.address);
  console.log("Gateway:", trexGateway.address);
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name, `(${network.chainId})`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n⚠️  Save these addresses! You'll need them.");
  console.log("Next step: Run setup-gateway.ts to enable deployments");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    process.exit(1);
  });