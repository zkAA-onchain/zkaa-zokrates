npx hardhat clean

rm -rf inputs
mkdir inputs
mkdir inputs/registration
mkdir inputs/publication

rm -rf witnesses
mkdir witnesses
mkdir witnesses/registration
mkdir witnesses/publication

rm -rf proofs
mkdir proofs
mkdir proofs/registration
mkdir proofs/publication

rm computes/registration
rm computes/publication

rm computes/r_proving.key
rm computes/r_verification.key
rm computes/p_proving.key
rm computes/p_verification.key

rm contracts/r_verifier.sol
rm contracts/p_verifier.sol
