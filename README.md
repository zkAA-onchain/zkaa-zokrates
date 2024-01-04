# TL;DR

- Use Python 3.8.13.
- Install requirements by `pip install -r requirements.txt`.

```bash
$ sh run.sh
```

*or, manually:*

```bash
$ sh reset.sh
```

```bash
# (Benchmark) create witnesses and proofs
# default: g16

$ python computes/create_proofs.py

w_r: Min   3.8539, Max   4.1937, Avg   3.9313 (SD:   0.0574), MED   3.9172
w_p: Min   1.9225, Max   2.1272, Avg   1.9551 (SD:   0.0280), MED   1.9507
p_r: Min   5.6837, Max   7.5084, Avg   5.8884 (SD:   0.2891), MED   5.7857
p_p: Min   2.7790, Max   2.9263, Avg   2.8386 (SD:   0.0327), MED   2.8331
```

```bash
# (Benchmark) verify proofs

$ npx hardhat test benchmark/register.js --network hardhat
$ npx hardhat test benchmark/publish.js --network hardhat

Average: 351563
Average: 227097
```

---

# Example: EdDSA

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
