const { expect } = require("chai");

const fs = require('fs');

const proofs = []
const prooflist = fs.readdirSync("proofs/publication");
prooflist.forEach(function (f) {
    proofs.push(require("../proofs/publication/" + f));
});

describe("Publish", function () {
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
        const Verifier = await ethers.getContractFactory("P_Benchmark", signer.tester);
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
                let r = await contract.verifier.p_verifyTx(
                    proof.proof,
                    proof.inputs
                );
                await r.wait();
                // expect(r).to.equal(true);

                gasUsed.push(await contract.verifier.gasUsed());
            }

            const averageGasUsed = gasUsed.reduce((p, c) => {
                return p.add(c);
            }).div(gasUsed.length);

            console.log(`Average: ${averageGasUsed}`);
        });
    });
});
