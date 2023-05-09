import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout, CountBox } from "../../components";
import { profile, proposalDetails } from "../../assets";
import { useSigner } from "wagmi";

import { ethers } from "ethers";
import { DAONFT_ABI } from "../../constants1";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const ProposalDetail = () => {
  const { query } = useRouter();
  const { data: signer } = useSigner();

  const proposal = query.proposal ? JSON.parse(query.proposal) : null;

  const [proposalStatus, setProposalStatus] = useState("");

  const handleExecute = async () => {
    try {
      const nftDAOContractInterface = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAO_NFT_ADDRESS,
        DAONFT_ABI,
        signer
      );
      await nftDAOContractInterface.executeProposal(query.id);
      toast.info("⏳ Executing Proposal ⏳", {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error.reason);
      toast.error(`🦄 Upss!, ${error.reason}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleVote = async (vote) => {
    try {
      const nftDAOContractInterface = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAO_NFT_ADDRESS,
        DAONFT_ABI,
        signer
      );
      await nftDAOContractInterface.voteOnProposal(query.id, vote);
      toast.info("⏳ Voting ⏳", {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error(`🦄 Upss!, ${error.reason}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    const checkProposalStatus = () => {
      const newDate = new Date();
      if (!proposal?.executed) {
        if (!proposal?.executed && proposal?.deadline > newDate.toISOString()) {
          setProposalStatus("Active");
        } else {
          setProposalStatus("Finished");
        }
      } else {
        setProposalStatus("Executed");
      }
    };
    checkProposalStatus();
  }, [proposal?.deadline]);

  return (
    <>
      <ToastContainer />
      <Layout>
        <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] justify-between">
          <Image
            src={proposalDetails}
            alt="proposalImage"
            width={500}
            height={500}
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
            <CountBox title="State" value={proposalStatus} />
            <CountBox title="Votes For" value={proposal?.yesVotes} />
            <CountBox title="Votes Against" value={proposal?.noVotes} />
          </div>
        </div>

        <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
          <div className="flex-[2] flex flex-col gap-[40px]">
            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Creator
              </h4>

              <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                  <Image
                    src={profile}
                    alt="user"
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                    {proposal?.proposalCreator}
                  </h4>
                  <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                    4 Proposals
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Description
              </h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  {proposal?.proposalDescription}
                </p>
              </div>
            </div>

            {!proposal?.executed && proposalStatus === "Finished" && (
              <div className="flex-1">
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Vote
                </h4>
                <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                  <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                    Execute Proposal
                  </p>
                  <div className="mt-[30px]">
                    <button
                      onClick={() => handleExecute()}
                      className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1dc071] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px] my-2 text-center cursor-pointer"
                    >
                      Execute
                    </button>
                  </div>
                </div>
              </div>
            )}

            {proposalStatus === "Active" && (
              <div className="flex-1">
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Vote
                </h4>

                <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                  <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                    Vote in Proposal
                  </p>
                  <div className="mt-[30px]">
                    <button
                      onClick={() => handleVote(0)}
                      className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1dc071] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px] my-2 text-center cursor-pointer"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => handleVote(1)}
                      className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#ec3434ca] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px] my-2 text-center cursor-pointer"
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProposalDetail;
