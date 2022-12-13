import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ChainlinkDemo } from "../target/types/chainlink_demo";

const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
const DIVISOR = 100000000;
const CHAINLINK_FEED = "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6";

describe("ChainLink Demo", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ChainlinkDemo as Program<ChainlinkDemo>;

  const priceFeedAccount = anchor.web3.Keypair.generate();

  console.log("priceFeedAccount public key: " + priceFeedAccount.publicKey);
  console.log("user public key: " + provider.wallet.publicKey);

  it("Price feed", async () => {
    // Add your test here.
    console.log("Fetching transaction logs...");

    const tx = await program.methods
      .execute()
      .accounts({
        decimal: priceFeedAccount.publicKey,
        user: provider.wallet.publicKey,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([priceFeedAccount])
      .rpc();
    console.log("Tx id", tx);
    // Fetch the account details of the account containing the price data
    const latestPrice = await program.account.decimal.fetch(
      priceFeedAccount.publicKey
    );
    console.log("Price Is: " + latestPrice.value.toNumber() / DIVISOR);
  });
});
