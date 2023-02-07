rm -rf inputs
rm -rf outputs

mkdir inputs
mkdir inputs/registration
mkdir inputs/publication

mkdir outputs
mkdir outputs/registration
mkdir outputs/publication

rm computes/registration
rm computes/publication

rm computes/r_proving.key
rm computes/r_verification.key
rm computes/p_proving.key
rm computes/p_verification.key

rm contracts/r_verifier.sol
rm contracts/p_verifier.sol
