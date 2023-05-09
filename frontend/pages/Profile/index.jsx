import React from 'react';
import { Layout } from "../../components";

const Profile = () => {

  return (
    <Layout>
      <div>Hola soy Profile</div>
    </Layout>
  )
}

Profile.getLayout = (page) => <Layout>{page}</Layout>;

export default Profile