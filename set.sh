zokrates compile -i computes/registration_verify.zok -o computes/registration
zokrates compile -i computes/publication_verify.zok -o computes/publication

zokrates setup -i computes/registration -s g16 -p computes/r_proving.key -v computes/r_verification.key
zokrates setup -i computes/publication -s g16 -p computes/p_proving.key -v computes/p_verification.key

zokrates export-verifier -i computes/r_verification.key -o contracts/r_verifier.sol
zokrates export-verifier -i computes/p_verification.key -o contracts/p_verifier.sol

python computes/create_inputs.py
