// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Verifier as P_Verifier} from "./p_verifier.sol";

contract P_Benchmark is P_Verifier {
    uint256 public gasUsed;

    function p_verifyTx(Proof memory proof, uint[4] memory input) external {
        uint256 startGas = gasleft();

        verifyTx(proof, input);

        gasUsed = startGas - gasleft();
    }
}
