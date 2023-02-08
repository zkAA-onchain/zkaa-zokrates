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
        process.stdout.write("Deploy Verifier");
        const Verifier = await ethers.getContractFactory("contracts/p_verifier.sol:Verifier", signer.tester);
        contract.verifier = await Verifier.deploy();
        await contract.verifier.deployed();
        console.log(":\t", contract.verifier.address);
    }

    describe("Test", function () {
        it("Verify", async function () {
            await set();
            await deploy();

            for (proof of proofs) {
                let r = await contract.verifier.verifyTx(
                    proof.proof,
                    proof.inputs
                );
                await r.wait();
                // expect(r).to.equal(true);
            }
        });
    });
});
