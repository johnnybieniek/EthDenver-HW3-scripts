import { ethers } from "hardhat"
import * as dotenv from "dotenv"
import { TokenizedBallot__factory } from "../typechain-types"
dotenv.config()

const PRIVATE_KEY = process.env.STOLEN_PRIVATE || ""

const ballotAddress = "0x915575a26a0013D05246ccad3282dF205BEa36Dd" // add the address of our TokenizedBallot from etherscan
const proposalToVoteFor = 0 // index of the proposal to vote for
const votesToUse = 1 // amount of voting power to spend

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const user = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new TokenizedBallot__factory(user)
    const ballotContract = ballotContractFactory.attach(ballotAddress)

    console.log("Checking if you have any voting power")
    const votingPower = await ballotContract.votingPower(user.address)
    if (votingPower.eq(0)) {
        console.log("Unfortunately, you don't have any voting power!")
        return
    } else {
        console.log(`You have ${votingPower} votes left!`)
    }
    console.log(`Voting for proposal #${proposalToVoteFor}...`)

    const voteTx = await ballotContract.vote(proposalToVoteFor, votesToUse)
    await voteTx.wait()
    console.log("Congrats, you have just voted!")
    const proposalVoteCount = await (await ballotContract.proposals(proposalToVoteFor)).voteCount

    console.log(`Your chosen proposal now has ${proposalVoteCount} votes!`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
