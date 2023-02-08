# TL;DR

```bash
# clean, setup and (Benchmark) deploy `verifier.sol`
# (default) g16
# create sample inputs
$ sh reset.sh

# (Benchmark) create witnesses and proofs
$ python computes/create_proofs.py

w_r: Min   3.7511, Max   3.9998, Avg   3.8381 (SD:   0.0474), MED   3.8300
w_p: Min   1.7636, Max   1.9181, Avg   1.8132 (SD:   0.0285), MED   1.8098
p_r: Min   5.4607, Max  11.8173, Avg   5.7365 (SD:   0.6323), MED   5.6348
p_p: Min   2.5685, Max   2.9915, Avg   2.6759 (SD:   0.0640), MED   2.6668

# (Benchmark) verify proofs
$ npx hardhat test benchmark/register.js --network localhost
$ npx hardhat test benchmark/publish.js --network localhost
```

For benchmarking, please remove `view` at `verifyTx`, in `Verifier`.


```bash
Compiled 2 Solidity files successfully
 ·------------------------|---------------------------|----------------·
 |  Solc version: 0.8.17  ·  Optimizer enabled: true  ·  Runs: 200     │
 ·························|···························|·················
 |  Contract Name         ·  Size (KiB)               ·  Change (KiB)  │
 ·························|···························|·················
 |  Pairing               ·                    0.084  ·                │
 ·························|···························|·················
 |  Pairing               ·                    0.084  ·                │
 ·························|···························|·················
 |  Verifier              ·                    3.928  ·                │
 ·························|···························|·················
 |  Verifier              ·                    6.135  ·                │
 ·------------------------|---------------------------|----------------·
```

```bash
·--------------------------------------------------|---------------------------|-------------|----------------------------·
|               Solc version: 0.8.17               ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···················································|···························|·············|·····························
|  Methods                                                                                                                │
······································|············|·············|·············|·············|··············|··············
|  Contract                           ·  Method    ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
······································|············|·············|·············|·············|··············|··············
|  contracts/r_verifier.sol:Verifier  ·  verifyTx  ·     387456  ·     387516  ·     387494  ·         100  ·          -  │
······································|············|·············|·············|·············|··············|··············
|  Deployments                                     ·                                         ·  % of limit  ·             │
···················································|·············|·············|·············|··············|··············
|  contracts/r_verifier.sol:Verifier               ·          -  ·          -  ·    1410472  ·        21 %  ·          -  │
·--------------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```

```bash
·--------------------------------------------------|---------------------------|-------------|----------------------------·
|               Solc version: 0.8.17               ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···················································|···························|·············|·····························
|  Methods                                                                                                                │
······································|············|·············|·············|·············|··············|··············
|  Contract                           ·  Method    ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
······································|············|·············|·············|·············|··············|··············
|  contracts/p_verifier.sol:Verifier  ·  verifyTx  ·     239906  ·     239966  ·     239953  ·         100  ·          -  │
······································|············|·············|·············|·············|··············|··············
|  Deployments                                     ·                                         ·  % of limit  ·             │
···················································|·············|·············|·············|··············|··············
|  contracts/p_verifier.sol:Verifier               ·          -  ·          -  ·     921902  ·      13.7 %  ·          -  │
·--------------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```


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
