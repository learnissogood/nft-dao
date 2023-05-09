import React, { useEffect } from "react";
import { VoteCard } from "../components";
import Image from "next/image";
import { loader } from "../assets";
import { useRouter } from "next/router";
import { useStateContext } from "../context";

const DisplayProposals = () => {

  const { push } = useRouter();
  const { proposals, isLoading, fetchProposals } = useStateContext();

  const goToProposalDetails = (proposal) => {
    push({pathname: `/ProposalDetail/${proposal.proposalId}`, query: {proposal: JSON.stringify(proposal)}});
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        All Proposals
      </h1>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Image
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )}

      {!isLoading && proposals.length === 0 && (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] flex items-center justify-center">
          You have not created any campigns yet
        </p>
      )}

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {!isLoading &&
          proposals.length > 0 &&
          proposals.map((proposal) => (
            <VoteCard key={proposal?.id} {...proposal} onClick={() => goToProposalDetails(proposal)} />
          ))}
      </div>
    </div>
  );
};

export default DisplayProposals;
