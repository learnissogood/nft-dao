// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * Interface for the FakeNFTMarketplace
 */
interface IMarketplace {
    /// @dev getPrice() returns the price of an NFT from the FakeNFTMarketplace
    /// @return Returns the price in Wei for an NFT
    function getPrice() external view returns (uint256);

    /// @dev available() returns whether or not the given _tokenId has already been purchased
    /// @return Returns a boolean value - true if available, false if not
    function available(uint256 _tokenId) external view returns (bool);

    /// @dev purchase() purchases an NFT from the FakeNFTMarketplace
    /// @param _tokenId - the fake NFT tokenID to purchase
    function purchase(uint256 _tokenId) external payable;
}

/**
 * Minimal interface for CryptoDevsNFT containing only two functions
 * that we are interested in
 */
interface IDaoCryptoNFT {
    /// @dev balanceOf returns the number of NFTs owned by the given address
    /// @param owner - address to fetch number of NFTs for
    /// @return Returns the number of NFTs owned
    function balanceOf(address owner) external view returns (uint256);

    /// @dev tokenOfOwnerByIndex returns a tokenID at given index for owner
    /// @param owner - address to fetch the NFT TokenID for
    /// @param index - index of NFT in owned tokens array to fetch
    /// @return Returns the TokenID of the NFT
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

interface ICryptoDaoToken {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);
}

contract NftDAO is Ownable {
    struct Proposal {
        // title - the title of the proposal
        string title;
        // description - the description of the proposal
        string description;
        // creator - the address of the creator of the proposal
        address creator;
        // nftTokenId - the tokenID of the NFT to purchase from Marketplace if the proposal passes
        uint256 nftTokenId;
        // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 deadline;
        // yayVotes - number of yay votes for this proposal
        uint256 yesVotes;
        // nayVotes - number of nay votes for this proposal
        uint256 noVotes;
        // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
        // voters - a mapping of DAONFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
        mapping(uint256 => bool) memberVoters;
        mapping(uint256 => bool) vipVoters;
    }

    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;

    // Number of proposals that have been created
    uint256 public numProposals;

    // Contracts Interfaces initialized
    IMarketplace nftMarketplace;
    IDaoCryptoNFT daoNFT1;
    IDaoCryptoNFT daoNFT2;
    ICryptoDaoToken cryptoToken;

    // Create an enum named Vote containing possible options for a vote
    enum Vote {
        YES, // YES = 0
        NO // NO = 1
    }

    // Create a modifier which only allows a function to be
    // called by someone who is a member of the DAO
    modifier nftHolderOnly() {
        require(
            daoNFT1.balanceOf(msg.sender) > 0 ||
                daoNFT2.balanceOf(msg.sender) > 0 ||
                owner() == msg.sender,
            "NOT_A_DAO_MEMBER"
        );
        _;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposal's deadline has not been exceeded yet
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposals' deadline HAS been exceeded
    // and if the proposal has not yet been executed
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    // Create a payable constructor which initializes the contract
    // instances for Marketplace and DAONFTs
    // The payable allows this constructor to accept an ETH deposit when it is being deployed
    constructor(
        address _nftMarketplace,
        address _daoNFT1,
        address _daoNFT2,
        address _cryptoToken
    ) payable {
        nftMarketplace = IMarketplace(_nftMarketplace);
        daoNFT1 = IDaoCryptoNFT(_daoNFT1);
        daoNFT2 = IDaoCryptoNFT(_daoNFT2);
        cryptoToken = ICryptoDaoToken(_cryptoToken);
    }

    /// @dev createProposal allows a CryptoDevsNFT holder to create a new proposal in the DAO
    /// @param _nftTokenId - the tokenID of the NFT to be purchased from FakeNFTMarketplace if this proposal passes
    /// @return Returns the proposal index for the newly created proposal
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _nftTokenId,
        uint256 _duration
    ) external nftHolderOnly returns (uint256) {
        require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        proposal.deadline = block.timestamp + _duration * 1 minutes;
        proposal.creator = msg.sender;
        proposal.title = _title;
        proposal.description = _description;

        numProposals++;

        return numProposals - 1;
    }

    /// @dev voteOnProposal allows a daoNFT holder to cast their vote on an active proposal
    /// @param proposalIndex - the index of the proposal to vote on in the proposals array
    /// @param vote - the type of vote they want to cast
    function voteOnProposal(
        uint256 proposalIndex,
        Vote vote
    ) external nftHolderOnly activeProposalOnly(proposalIndex) {
        require(
            cryptoToken.balanceOf(msg.sender) > 0,
            "You don't have voting power, please acquire CDT Tokens"
        );

        Proposal storage proposal = proposals[proposalIndex];

        uint256 voterMemberNFTBalance = daoNFT1.balanceOf(msg.sender);
        uint256 voterVipNFTBalance = daoNFT2.balanceOf(msg.sender);
        uint256 voterDaoTokenBalance = cryptoToken.balanceOf(msg.sender);
        uint256 sqrtBalance = sqrt(voterDaoTokenBalance / 10 ** 18);
        uint256 votingPower = sqrtBalance * sqrtBalance;

        if (voterMemberNFTBalance > 0) {
            uint256 memberTokenId = daoNFT1.tokenOfOwnerByIndex(msg.sender, 0);
            require(
                proposal.memberVoters[memberTokenId] == false,
                "You already vote with this NFT"
            );
            if (proposal.memberVoters[memberTokenId] == false) {
                // WIP FINSIH THIS IMPLEMENTATION
                if (vote == Vote.YES) {
                    proposal.yesVotes += votingPower;
                } else {
                    proposal.noVotes += votingPower;
                }
                proposal.memberVoters[memberTokenId] = true;
            }
        }
        
        if (voterVipNFTBalance > 0) {
            uint256 vipTokenId = daoNFT2.tokenOfOwnerByIndex(msg.sender, 0);
            require(
                proposal.vipVoters[vipTokenId] == false,
                "You already vote with this NFT"
            );
            if (proposal.vipVoters[vipTokenId] == false) {
                // WIP FINSIH THIS IMPLEMENTATION
                if (vote == Vote.YES) {
                    proposal.yesVotes += votingPower;
                } else {
                    proposal.noVotes += votingPower;
                }
                proposal.vipVoters[vipTokenId] = true;
            }
        }
    }

    // Helper function to calculate the square root of a number
    function sqrt(uint256 x) private pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /// @dev executeProposal allows any DAONFT holder to execute a proposal after it's deadline has been exceeded
    /// @param proposalIndex - the index of the proposal to execute in the proposals array
    function executeProposal(
        uint256 proposalIndex
    ) external nftHolderOnly inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        require(
            proposal.yesVotes > proposal.noVotes,
            "You cannot execute this proposal. Not enough upvotes"
        );

        // If the proposal has more YES votes than NO votes
        // purchase the NFT from the Marketplace
        if (proposal.yesVotes > proposal.noVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "NOT_ENOUGH_FUNDS");
            nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
        }
        proposal.executed = true;
    }

    /// @dev withdrawEther allows the contract owner (deployer) to withdraw the ETH from the contract
    function withdrawEther() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "FAILED_TO_WITHDRAW_ETHER");
    }

    // The following two functions allow the contract to accept ETH deposits
    // directly from a wallet without calling a function
    receive() external payable {}

    fallback() external payable {}
}
