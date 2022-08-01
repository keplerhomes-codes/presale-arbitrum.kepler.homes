import React, { useMemo,useEffect} from "react";
import { useLocation } from 'react-router'
import { Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home'
import Market from './pages/Market'
import Origin from './pages/Origin'
import NFT from './pages/NFT'
import NFTdetail from './pages/NFTdetail'
import Mysterybox from './pages/Mysterybox'
import Mynft from './pages/Mynft'
import User from './pages/User'
import FarmOverview from './components/Farm/Overview'
import FarmFarm from './components/Farm/Farm'
import FarmRewards from './components/Farm/Rewards'
import Faq from './pages/Faq'
import Tokenomics from './pages/Tokenomics'
import ApplyVolunteer from './pages/ApplyVolunteer'
import ApplyPartner from './pages/ApplyPartner'
import Download from "./pages/Download";
import Whitelist from "./pages/Whitelist";
import Mint from "./pages/Mint";
import Mintest from "./pages/Mintest";
import News from './pages/News'
import Claim from './pages/Claim'
import Bridge from './components/Bridge/Bridge'
import Layout from './components/layouts/Layout'
import './i18n'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import Bus from './lib/eventBus'

import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import Private from "./pages/Private";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  let {pathname} = useLocation()

  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
        new SolletWalletAdapter({ network }),
        new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );
  useEffect(()=> {
    document.title = `KEPLER | ${pathname.replace('/', '')?pathname.replace('/', '').toUpperCase():'PRIVATE'}`
    if (window.innerWidth < 768) {
      Bus.emit('foldChange', false);
    }
  }, [pathname])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Private />} />
              {/* <Route path="/download" element={<Download />} />
              <Route path="/origin" element={<Origin />} />
              <Route path="/market" element={<Market />} />
              <Route path="/NFT" exact={true} element={<NFT />} /> */}
              {/* <Route path="/NFT/:nftId/:tokenId" exact={true} element={<NFT />} /> */}
              {/* <Route path="/NFTDETAIL/:id" exact={true} element={<NFTdetail />} />
              <Route path="/Mysterybox/:id" exact={true} element={<Mysterybox />} />
              <Route path="/mynft" element={<Mynft />} />
              <Route path="/profile" element={<User />} />
              <Route path="/farm/overview" element={<FarmOverview />} />
              <Route path="/farm/pools" element={<FarmFarm />} />
              <Route path="/farm/mystaking" element={<FarmFarm />} />
              <Route path="/farm/claim" element={<FarmRewards />} />
              <Route path="/farm/withdraw" element={<FarmRewards />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/apply-volunteer" element={<ApplyVolunteer />} />
              <Route path="/apply-partner" element={<ApplyPartner />} />
              <Route path="/news" element={<News />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/tokenomics" element={<Tokenomics />} /> */}
              <Route path="/nft-whitelist" element={ <Whitelist /> } />
              {/* <Route path="/nft-mint" element={ <Mint /> } />
              <Route path="/nft-mint-test" element={ <Mintest /> } />
              <Route path="/claim" element={ <Claim /> } /> */}
              {/* <Route path="/airdrop" element={ <Airdrop /> } /> */}
            </Routes>
          </Layout>
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
