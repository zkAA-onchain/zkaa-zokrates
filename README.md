# ⚠️ NOTICE

These implementations are no longer maintained.

Please refer to the [zkaa-circom](https://github.com/zkAA-onchain/zkaa-circom) repository for the latest updates.

---

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
# (Benchmark) circuits

Compiled code written to 'computes/registration'
Number of constraints: 172772

Compiled code written to 'computes/publication'
Number of constraints: 79529
```

```bash
# (Benchmark) create witnesses and proofs
# default: g16

$ python computes/create_proofs.py

w_r: Min   3.8758, Max   4.2994, Avg   3.9449 (SD:   0.0626), MED   3.9323
w_p: Min   1.9393, Max   2.1154, Avg   1.9803 (SD:   0.0318), MED   1.9735
p_r: Min   5.8174, Max   6.7517, Avg   6.0792 (SD:   0.1573), MED   6.0709
p_p: Min   2.8198, Max   3.3376, Avg   2.9251 (SD:   0.0976), MED   2.8958
```

```bash
# (Benchmark) verify proofs

$ npx hardhat test benchmark/register.js --network hardhat

Min: 351563
Max: 351563
Average (std): 351563.0 (0.0 = sqrt(0.0))
Median: 351563.0

$ npx hardhat test benchmark/publish.js --network hardhat

Min: 227097
Max: 227097
Average (std): 227097.0 (0.0 = sqrt(0.0))
Median: 227097.0
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
