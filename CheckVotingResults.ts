import { ethers } from "hardhat"
import * as dotenv from "dotenv"
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types"
import Web3 from "web3"
dotenv.config()

const tokenContractAddress = "0xC40ae31250AC7224b3Bc2D036c476D25e9fD16a1" // address of our token contract on Etherscan
const ballotContractAddress = "0xCa03a911C593F3E4aD2B25e0b8731D6b336649aD"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const NUM_PROPOSALS = 3 // number of active proposals. Has to be updated manually if the contract changes...

async function main() {
    console.log("Checking current voting results...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const tokenContractFactory = new MyToken__factory(signer)
    const tokenContract = tokenContractFactory.attach(tokenContractAddress)
    const ballotContractFactory = new TokenizedBallot__factory(signer)
    const ballotContract = ballotContractFactory.attach(ballotContractAddress)

    for (let i = 0; i < NUM_PROPOSALS; i++) {
        const proposalName = (await ballotContract.proposals(i)).name
        const name = ethers.utils.parseBytes32String(proposalName)
        const votes = (await ballotContract.proposals(i)).voteCount

        console.log(`Proposal #${i} - ${name}`)
        console.log(`Number of votes: ${votes}`)
    }

    const winnerNameBytes = await ballotContract.winnerName()
    const winnerName = ethers.utils.parseBytes32String(winnerNameBytes)
    console.log(`Currently, the winner is: ${winnerName}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
