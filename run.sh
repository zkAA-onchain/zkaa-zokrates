sh reset.sh

python computes/create_proofs.py

npx hardhat compile

npx hardhat test benchmark/register.js --network hardhat
npx hardhat test benchmark/publish.js --network hardhat
