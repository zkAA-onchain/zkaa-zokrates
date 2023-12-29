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

            const averageGasUsed = gasUsed.reduce((p, c) => {
                return p.add(c);
            }).div(gasUsed.length);

            console.log(`Average: ${averageGasUsed}`);
        });
    });
});
