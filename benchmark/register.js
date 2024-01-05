const { expect } = require("chai");

const fs = require('fs');

const proofs = []
const prooflist = fs.readdirSync("proofs/registration");
prooflist.forEach(function (f) {
    proofs.push(require("../proofs/registration/" + f));
});

describe("Register", function () {
    let signer = {
        "tester": null
    };
    let contract = {
        "verifier": null
    };

    async function set(verbose = true) {
        [signer.tester] = await ethers.getSigners();

        let balanceOfTestter = await signer.tester.getBalance() / (10 ** 18);
        console.log("Tester:\t", signer.tester.address, `(${balanceOfTestter} ETH)`);
    }

    async function deploy() {
        process.stdout.write("Victor");
        const Verifier = await ethers.getContractFactory("R_Benchmark", signer.tester);
        contract.verifier = await Verifier.deploy();
        await contract.verifier.deployed();
        console.log(":\t", contract.verifier.address);
    }

    describe("Benchmark Gas Used", function () {
        it("Verify", async function () {
            await set();
            await deploy();

            let gasUsed = [];
            for (let proof of proofs) {
                let r = await contract.verifier.r_verifyTx(
                    proof.proof,
                    proof.inputs
                );
                await r.wait();
                // expect(r).to.equal(true);

                gasUsed.push(await contract.verifier.gasUsed());
            }

            /* Results */

            let gasUsedFloat = gasUsed.map((e) => {
                return ethers.FixedNumber.fromString(e.toString());
            })

            let sum = new ethers.BigNumber.from(0);
            let minGasUsed = gasUsed[0];
            let maxGasUsed = gasUsed[0];
            let averageGasUsed;
            let sdGasUsed;
            let medianGasUsed;

            // Calculate min, max, and sum
            for (let num of gasUsed) {
                if (num.lt(minGasUsed)) minGasUsed = num;
                if (num.gt(maxGasUsed)) maxGasUsed = num;
                sum = sum.add(num);
            }

            // Calculate average
            averageGasUsed =
                ethers.FixedNumber.fromString(sum.toString())
                    .divUnsafe(ethers.FixedNumber.from(gasUsed.length));

            // Calculate standard deviation
            const ONE = ethers.FixedNumber.from(1);
            const TWO = ethers.FixedNumber.from(2);
            function sqrt(value) {
                x = ethers.FixedNumber.from(value);
                let z = x.addUnsafe(ONE).divUnsafe(TWO);
                let y = x;
                while (z.subUnsafe(y).isNegative()) {
                    y = z;
                    z = x.divUnsafe(z).addUnsafe(z).divUnsafe(TWO);
                }
                return y.divUnsafe(ethers.FixedNumber.from(10 ** 9));
            }

            const varGasUsed = (gasUsedFloat.reduce(
                (p, c) => {
                    return p.addUnsafe(
                        (c.subUnsafe(averageGasUsed))
                            .mulUnsafe(c.subUnsafe(averageGasUsed))
                    )
                },
                new ethers.FixedNumber.from(0)
            )).divUnsafe(ethers.FixedNumber.from(gasUsedFloat.length));
            sdGasUsed = sqrt(varGasUsed);

            // Calculate median
            function compareBigNumbers(a, b) {
                if (a.gt(b)) {
                    return 1;
                } else if (a.lt(b)) {
                    return -1;
                } else {
                    return 0;
                }
            }
            gasUsed.sort(compareBigNumbers);
            if (gasUsed.length % 2 === 0) {
                let mid1 = gasUsed[gasUsed.length / 2 - 1];
                let mid2 = gasUsed[gasUsed.length / 2];
                medianGasUsed =
                    ethers.FixedNumber.fromString(mid1.toString())
                        .addUnsafe(ethers.FixedNumber.fromString(mid2.toString()))
                        .divUnsafe(ethers.FixedNumber.from(2));
            } else {
                medianGasUsed = gasUsed[Math.floor(gasUsed.length / 2)];
            }

            // console.log(gasUsed);
            console.log(`Min: ${minGasUsed}`);
            console.log(`Max: ${maxGasUsed}`);
            console.log(`Average (std): ${averageGasUsed} (${sdGasUsed} = sqrt(${varGasUsed}))`);
            console.log(`Median: ${medianGasUsed}`);
        });
    });
});
