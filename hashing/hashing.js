"use strict";

const crypto = require("crypto");

// The Power of a Smile - by Tupac Shakur
const poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

const Blockchain = {
	blocks: [],
};

const blockHash = (block) => {
	return crypto
		.createHash("sha256").update(
			`${block.index}${block.prevHash}${block.data}${block.timestamp}`
		).digest("hex");
}

const createBlock = (data, index) => {
	let prevHash = Blockchain.blocks[index].hash;

	let block = {
		index: index + 1,
		prevHash: prevHash,
		data: data,
		timestamp: Date.now(),
	}

	block.hash = blockHash(block)

	Blockchain.blocks.push(block)

	return block
}

const blockChecks = {
	validHash: (genesisBlock, block) => {
		if (genesisBlock && block.hash !== '000000') return false;
		if (!genesisBlock) {
			if (block.hash === '000000') return false;
			if (block.hash !== blockHash(block)) return false;

		}
	},
	validPrevHash: (genesisBlock, block) => {
		if (!genesisBlock) {
			if (block.prevHash.length < 0 || block.prevHash === "") return false;
			if (block.prevHash !== Blockchain.blocks[block.index - 1].hash) return false;
		}
	},
	validData: (block) => {
		if (block.data.length < 0 && block.data !== "") return false;
	},
	validIndexblock: (block) => {
		if (block.index >= 0 === false || !Number.isInteger(block.index)) return false;
	}

}

const verifyBlock = (block) => {
	const genesisBlock = Blockchain.blocks[0] === block;
	blockChecks.validHash(genesisBlock, block)
	blockChecks.validPrevHash(genesisBlock, block)
	blockChecks.validData(block)
	blockChecks.validIndexblock(block)

	return true;
}

const verifyChain = (blockchain) => {
	for (let block of blockchain.blocks) {
		return verifyBlock(block)
	}
}

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

poem.forEach((line, index) => {
	createBlock(line, index)
})

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);
