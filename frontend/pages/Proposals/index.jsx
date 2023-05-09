import React from "react";
import { DisplayProposals, Layout } from "../../components";
import { useStateContext } from "../../context";

const Proposals = () => {
  
  const { proposals, isLoading } = useStateContext();

  return (
    <Layout>
      <DisplayProposals
        title="All Campaigns"
      />
    </Layout>
  );
};

Proposals.getLayout = (page) => <Layout>{page}</Layout>;

export default Proposals;
