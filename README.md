# TL;DR

## Setup and Deploy `verifier.sol`

```bash
$ zokrates compile -i computes/registration_verify.zok -o computes/registration
$ zokrates compile -i computes/publication_verify.zok -o computes/publication
```

```bash
$ zokrates setup -i computes/registration -s g16 -p computes/r_proving.key -v computes/r_verification.key
$ zokrates setup -i computes/publication -s g16 -p computes/p_proving.key -v computes/p_verification.key
```

```bash
$ zokrates export-verifier -i computes/r_verification.key -o contracts/r_verifier.sol
$ zokrates export-verifier -i computes/p_verification.key -o contracts/p_verifier.sol
```

## Create sample inputs

```bash
$ python computes/create_inputs.py
```

## Create `proof.json`

```bash
$ cat inputs/registration/PrivateKey\(...).txt | xargs zokrates compute-witness -i computes/registration -o outputs/registration/r_witness -a
```

```bash
$ cat inputs/publication/PrivateKey\(...).txt | xargs zokrates compute-witness -i computes/publication -o outputs/publication/p_witness -a
```

```bash
$ zokrates generate-proof -i computes/registration -p computes/r_proving.key -s g16 -w outputs/registration/r_witness -b ark -j outputs/registration/r_proof.json
```

```bash
$ zokrates generate-proof -i computes/publication -p computes/p_proving.key -s g16 -w outputs/publication/p_witness -b ark -j outputs/publication/p_proof.json
```

<!-- Use ark -->


## Verify Proof

```bash
$ npx hardhat node
```

```bash
$ npx hardhat test benchmark/register.js --network localhost
```

```bash
$ npx hardhat test benchmark/publish.js --network localhost
```

# How to Use

Example: EdDSA

## Requirements

```bash
$ cd pycrypto
$ pip install -r requirements.txt
```

## Setup and Deploy `verifier.sol`

```bash
$ zokrates compile -i computes/eddsa_verify.zok -o computes/eddsa

Compiling computes/eddsa_verify.zok

Compiled code written to 'computes/eddsa'
Number of constraints: 90600
```

```bash
$ zokrates setup -i computes/eddsa -s <g16|gm17|marlin> -p computes/proving.key -v computes/verification.key

Verification key written to 'verification.key'
Proving key written to 'proving.key'
Setup completed
```

which create `verification.key` and `proving.key` files.

```bash
$ zokrates export-verifier -i computes/verification.key -o contracts/verifier.sol

Exporting verifier...
Verifier exported to 'contracts/verifier.sol'
```

which create a `verifier.sol` file. The contract contains verification key and a function `verifyTx`.

## Create EdDSA Signature

```bash
$ python computes/eddsa_input.py
```

which create a `{PrivateKey(fe=...)}.txt` file.

## Create `proof.json`

```bash
$ cat inputs/PrivateKey\(fe=18821004183710398453495808059433168382174078234751537864067898375499416937150\).txt| xargs zokrates compute-witness -i computes/eddsa -o computes/witness -a

Computing witness...
Witness file written to 'computes/witness'
```

which create witness.

```bash
$ zokrates generate-proof -i computes/eddsa -p computes/proving.key -s <g16|gm17|marlin> -w computes/witness -b <bellman|ark> -j computes/proof.json

Proof written to 'computes/proof.json'
```

## Verify Proof

```bash
$ npx hardhat node
```

```bash
$ npx hardhat test benchmark/eddsa.js --network localhost
```

---

# References

https://github.com/Zokrates/pycrypto
https://zokrates.github.io/examples/sha256example.html
