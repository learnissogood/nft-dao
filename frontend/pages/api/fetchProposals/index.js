import { ethers } from "ethers";
import { DAONFT_ABI } from "../../../constants1";

export default async function handler(req, res) {
  const { method } = req;

  if (method == "GET") {
    const provider = new ethers.getDefaultProvider(process.env.RPC_URL);
    const fetchProposals = async () => {
      try {
        const nftDAOContractInterface = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAO_NFT_ADDRESS,
          DAONFT_ABI,
          provider
        );

        const daoNumProposals = await nftDAOContractInterface.numProposals();

        const proposalsArray = [];
        for (let i = 0; i < daoNumProposals; i++) {
          const proposal = await fetchProposalById(i);
          proposalsArray.push(proposal);
        }

        return proposalsArray;
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProposalById = async (id) => {
      try {
        const nftDAOContractInterface = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAO_NFT_ADDRESS,
          DAONFT_ABI,
          provider
        );
        const proposal = await nftDAOContractInterface.proposals(id);
        const parsedProposal = {
          proposalName: proposal.title,
          proposalDescription: proposal.description,
          proposalCreator: proposal.creator,
          proposalId: id,
          nftTokenId: proposal.nftTokenId.toString(),
          deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
          yesVotes: proposal.yesVotes.toString(),
          noVotes: proposal.noVotes.toString(),
          executed: proposal.executed,
        };
        return parsedProposal;
      } catch (error) {
        console.error(error);
      }
    };

    const proposals = await fetchProposals();

    res.status(200).json(proposals);
  }
}
