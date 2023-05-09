import React, { useState } from "react";
import { Layout, FormField, CustomButton } from "../../components";
import { useStateContext } from "../../context";
import { useAccount, useSigner } from "wagmi";

import { ethers } from "ethers";
import { DAONFT_ABI } from "../../constants1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const CreateProposal = () => {
  const { isNftMemberOwner, isNftVipOwner } = useStateContext();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [form, setForm] = useState({
    creator: "",
    title: "",
    description: "",
    tokenId: "",
    deadline: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const submitProposal = async () => {
    try {
      const nftDAOContractInterface = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAO_NFT_ADDRESS,
        DAONFT_ABI,
        signer
      );
      await nftDAOContractInterface.createProposal(
        form.title,
        form.description,
        form.tokenId,
        form.deadline
      );

      toast.info("⏳ Submitting Proposal ⏳", {
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

  return (
    <>
      <ToastContainer />
      <Layout>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          {isNftMemberOwner || isNftVipOwner ? (
            <>
              <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[20px] leading-[38px] text-white text-center">
                  Create a Proposal
                </h1>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full mt-[65px] flex flex-col gap-[30px]"
              >
                <div className="flex flex-wrap gap-[40px]">
                  <FormField
                    labelName="Proposal Creator *"
                    placeholder={address}
                    inputType="text"
                    value={form.creator}
                    handleChange={(e) => handleFormFieldChange("creator", e)}
                    isDisabled={true}
                  />
                  <FormField
                    labelName="Proposal Title *"
                    placeholder="Write a title"
                    inputType="text"
                    value={form.title}
                    handleChange={(e) => handleFormFieldChange("title", e)}
                  />
                </div>

                <div className="flex flex-wrap gap-[40px]">
                  <FormField
                    labelName="NFT ID *"
                    placeholder="#1"
                    inputType="text"
                    value={form.tokenId}
                    handleChange={(e) => handleFormFieldChange("tokenId", e)}
                  />
                  <FormField
                    labelName="Duration *"
                    placeholder="Duration in minutes"
                    inputType="number"
                    value={form.deadline}
                    handleChange={(e) => handleFormFieldChange("deadline", e)}
                  />
                </div>

                <FormField
                  labelName="Description *"
                  placeholder="Write a description"
                  isTextArea
                  value={form.description}
                  handleChange={(e) => handleFormFieldChange("description", e)}
                />

                <div className="flex justify-center items-center mt-[20px]">
                  <CustomButton
                    btnType="submit"
                    title="Submit Proposal"
                    styles="bg-[#1dc071]"
                    onClick={() => submitProposal()}
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
              <h1 className="font-epilogue font-bold sm:text-[25px] text-[20px] leading-[38px] text-white text-center">
                You are not a member 😞
              </h1>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

CreateProposal.getLayout = (page) => <Layout>{page}</Layout>;

export default CreateProposal;
