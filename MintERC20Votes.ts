import { ethers } from "hardhat"
import * as dotenv from "dotenv"
import { MyToken__factory } from "../typechain-types"
dotenv.config()

const contractAddress = "0xC40ae31250AC7224b3Bc2D036c476D25e9fD16a1" // address of the token contract on Etherscan
const VALUE_TO_MINT = ethers.utils.parseEther("5")
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const addressTo = "0x31F83c5F7812cFb925402c74B57687616E09e41b"

async function main() {
    console.log("Checking the your balance...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const tokenContractFactory = new MyToken__factory(deployer)
    const tokenContract = tokenContractFactory.attach(contractAddress)

    const deployersBalance = await tokenContract.balanceOf(addressTo)

    console.log(`Your current balance: ${deployersBalance}`)

    console.log("Minting tokens!")
    const mintTx = await tokenContract.mint(addressTo, VALUE_TO_MINT)
    await mintTx.wait()

    const newBalance = await tokenContract.balanceOf(addressTo)
    console.log(`Your new balance: ${newBalance}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
