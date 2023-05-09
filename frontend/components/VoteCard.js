import React, { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "../assets";

const VoteCard = ({
  proposalName,
  proposalDescription,
  proposalCreator,
  proposalId,
  nftTokenId,
  deadline,
  yesVotes,
  noVotes,
  executed,
  onClick,
}) => {
  const [proposalStatus, setProposalStatus] = useState(false);

  useEffect(() => {
    const checkProposalStatus = () => {
      const newDate = new Date();
      if (deadline > newDate) {
        setProposalStatus(true);
      } else {
        setProposalStatus(false);
      }
    };
    checkProposalStatus();
  }, [deadline]);

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            {proposalName}
          </h3>
          {executed ? (
            <h1 className="p-2 bg-[#1dc071] text-white rounded-xl">Executed</h1>
          ) : (
            <div>
              {proposalStatus ? (
                <h1 className="p-2 bg-[#e7e72cca] text-white rounded-xl">
                  Active
                </h1>
              ) : (
                <h1 className="p-2 bg-[#ec3434ca] text-white rounded-xl">
                  Finished
                </h1>
              )}
            </div>
          )}
        </div>
        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[30px] truncate">
          {proposalDescription} --&gt; ID {nftTokenId}
        </p>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <Image
              src={profile}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            by <span className="text-[#b2b3bd]">{proposalCreator}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
