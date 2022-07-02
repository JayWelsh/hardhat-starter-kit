// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const etherscanChainIds = [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    11155111 // Sepolia
]

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const initialGreeting = "Hello, Hardhat!";
  const greeter = await Greeter.deploy(initialGreeting);

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  // We run verification on Etherscan
  // If there is an official Etherscan instance of this network we are deploying to
  if(etherscanChainIds.indexOf(hre.network) > -1) {
    console.log('Deploying to a network supported by Etherscan, running Etherscan contract verification')
    
    // First we pause for a minute to give Etherscan a chance to update with our newly deployed contracts
    console.log('First waiting a minute to give Etherscan a chance to update...')
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // We can now run Etherscan verification of our contracts

    try {
      await hre.run('verify:verify', {
        address: greeter.address,
        constructorArguments: [initialGreeting]
      });
    } catch (err) {
      console.log(`Auction verify error: ${err}`);
    }
  } else {
    console.log('Not deploying to a network supported by Etherscan, skipping Etherscan contract verification');
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
