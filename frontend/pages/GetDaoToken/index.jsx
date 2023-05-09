import React from "react";
import { Layout, Exchange } from "../../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const GetDaoToken = () => {
  return (
    <>
      <ToastContainer />
      <Layout>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[20px] leading-[38px] text-white text-center">
              Exchange your MATIC for DAO TOKEN
            </h1>
          </div>
          <h2 className="font-epilogue font-bold sm:text-[20px] text-[14px] leading-[20px] text-white pt-8 text-center">
            This will grant you more{" "}
            <span className="text-[#1dc071]">Voting Power</span> when voting in
            proposals
          </h2>
          <div className="mt-10 w-full flex justify-center">
            <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl">
              <div className="w-full min-h-full lg:min-h-[400px] bg-[#1c1c24] backdrop-blur-[4px] rounded-3xl shadow-card flex p-10">
                <Exchange />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

GetDaoToken.getLayout = (page) => <Layout>{page}</Layout>;

export default GetDaoToken;
