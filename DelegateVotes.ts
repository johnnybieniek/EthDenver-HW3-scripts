import { ethers } from "hardhat"
import * as dotenv from "dotenv"
import { MyToken__factory } from "../typechain-types"
dotenv.config()

const contractAddress = "0xC40ae31250AC7224b3Bc2D036c476D25e9fD16a1" // address of our token contract on Etherscan
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
let delegationAddress: string // assign this variable if you want to delefate your votes to someone else

async function main() {
    console.log("Checking your voting power...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const tokenContractFactory = new MyToken__factory(deployer)
    const tokenContract = tokenContractFactory.attach(contractAddress)

    const votingPower = await tokenContract.getVotes(deployer.address)

    console.log(`Your current voting power: ${votingPower}`)

    console.log("Delegating your votes!")
    if (delegationAddress) {
        const mintTx = await tokenContract.delegate(delegationAddress)
        await mintTx.wait()
    } else {
        const mintTx = await tokenContract.delegate(deployer.address)
        await mintTx.wait()
    }

    const newVotingPower = await tokenContract.getVotes(deployer.address)
    console.log(`Your new voting power: ${newVotingPower}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
