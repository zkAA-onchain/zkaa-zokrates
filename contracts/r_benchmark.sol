// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Verifier as R_Verifier} from "./r_verifier.sol";

contract R_Benchmark is R_Verifier {
    uint256 public gasUsed;

    function r_verifyTx(Proof memory proof, uint[20] memory input) external {
        uint256 startGas = gasleft();

        verifyTx(proof, input);

        gasUsed = startGas - gasleft();
    }
}
