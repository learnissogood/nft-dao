import React from "react";
import { DisplayProposals, Layout } from "../../components";
import { useStateContext } from "../../context";

const Dashboard = () => {
  
  const { proposals, isLoading } = useStateContext();

  return (
    <Layout>
      <DisplayProposals
        title="All Campaigns"
        proposals={proposals}
        isLoading={isLoading}
      />
    </Layout>
  );
};

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;

export default Dashboard;
