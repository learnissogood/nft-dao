import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/Dashboard",
  },
  {
    name: "CreateProposal",
    imgUrl: createCampaign,
    link: "/CreateProposal",
  },
  {
    name: "BuyNft",
    imgUrl: payment,
    link: "/BuyNft",
  },
  {
    name: "GetDaoToken",
    imgUrl: withdraw,
    link: "/GetDaoToken",
  },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/Profile",
    disabled: true,
  },
  {
    name: "Logout",
    imgUrl: logout,
    link: "/Dashboard",
    disabled: true,
  },
];
