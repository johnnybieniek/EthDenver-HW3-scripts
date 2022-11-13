import { ethers } from "hardhat"
import { TokenizedBallot__factory } from "../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const proposals = ["Chocolate", "Vanilla", "Lemon"]
const tokenContractAddress = "0xC40ae31250AC7224b3Bc2D036c476D25e9fD16a1"
const targetBlock = 7946852

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = []
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]))
    }
    return bytes32Array
}

async function main() {
    console.log("Deploying the TokenizedBallot...")

    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new TokenizedBallot__factory(deployer) // NOT FINISHED
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals),
        tokenContractAddress,
        targetBlock
    )
    await ballotContract.deployed()
    console.log(`TokenizedBallot contract was successfully deployed at ${ballotContract.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
