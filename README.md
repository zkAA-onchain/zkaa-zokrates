# How to Use

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
npx hardhat test benchmark/eddsa.js --network localhost
```

---

# References

https://github.com/Zokrates/pycrypto
https://zokrates.github.io/examples/sha256example.html
