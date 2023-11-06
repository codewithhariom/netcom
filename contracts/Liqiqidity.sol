// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
// import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Pair.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Pair public uniswapPair;

    address public tokenA; // Address of token A in the pair
    address public tokenB; // Address of token B in the pair

    constructor(address _uniswapRouterAddress, address _uniswapPairAddress) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
        uniswapPair = IUniswapV2Pair(_uniswapPairAddress);

        (address token0, address token1) = uniswapPair.token0() < uniswapPair.token1()
            ? (uniswapPair.token0(), uniswapPair.token1())
            : (uniswapPair.token1(), uniswapPair.token0());

        tokenA = token0;
        tokenB = token1;
    }

    function addLiquidity(uint256 amountTokenA, uint256 amountTokenB) external {
        require(amountTokenA > 0 && amountTokenB > 0, "Amounts must be greater than zero");

        // Ensure you have approved this contract to spend your tokens first
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountTokenA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountTokenB);

        IERC20(tokenA).approve(address(uniswapRouter), amountTokenA);
        IERC20(tokenB).approve(address(uniswapRouter), amountTokenB);

        // Add liquidity to the pool
        (uint256 amountADesired, uint256 amountBDesired, , ) = uniswapPair.getReserves();

        uniswapRouter.addLiquidity(
            tokenA,
            tokenB,
            amountTokenA,
            amountTokenB,
            amountADesired,
            amountBDesired,
            msg.sender,
            block.timestamp + 1
        );
    }
}
