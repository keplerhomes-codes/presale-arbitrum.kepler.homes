import React, { useMemo,useEffect} from "react";
import { useLocation } from 'react-router'
import { Routes, Route } from "react-router-dom";
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
import Presale from "./pages/Presale";

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
    document.title = `KEPLER | ${pathname.replace('/', '')?pathname.replace('/', '').toUpperCase():'PRESALE-ARBITRUM'}`
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
              <Route path="/" element={<Presale />} />
            </Routes>
          </Layout>
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
