import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

// Imports for Rainbowkit and Wagmi
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from "wagmi/chains";
import { StateContextProvider } from "../context";

// Setting Chains
const { chains, provider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

// Application Configs
const { connectors } = getDefaultWallets({
  appName: "NFT DAO APP",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains,
  provider,
});

// Wagmi Config
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <StateContextProvider>
          <Component {...pageProps} />
        </StateContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
