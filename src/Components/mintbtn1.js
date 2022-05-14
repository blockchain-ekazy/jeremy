import React, { useState, useEffect } from "react";
import abi from "./abi.json";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import loading from "../images/loading.gif";
import one from "../images/jeremy.png";

const REACT_APP_CONTRACT_ADDRESS = "0xf10DF7cA16F64eFf8D296EEf324e5426C298353F"; // here goes the new contract address
const SELECTEDNETWORK = "4"; // 1 for mainnet //4 for rinkeby testnet
const SELECTEDNETWORKNAME = "Ethereum";
const nftquantity = 100000;
const tokenId = 1;

function Mintbtn1() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [supply, setSupply] = useState(0);
  const [price, setPrice] = useState(<img className="loading" src={loading} />);
  const [walletConnected, setWalletConnected] = useState(0);

  function showprice() {
    return price / 10 ** 18;
  }

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let total = await ct.methods.totalSupply().call();
        setSupply(total);
        setPrice(await ct.methods.PRICE().call());
        if (nftquantity - total <= 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
        if ((await ct.methods.status().call()) == 0) {
          setErrorMsg("Minting Paused");
          return;
        }
      } else {
        setErrorMsg('Select "' + SELECTEDNETWORKNAME + '" network in Metamask');
      }
    } else {
      setErrorMsg("MetaMask not found!");
    }
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 10000);
    }

    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum) {
        console.log("Ethereum successfully detected!");
      }
    }
  }, []);

  async function loadWeb3() {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        setErrorMsg(<img className="loading" src={loading} />);

        let price = await ct.methods.PRICE().call();
        try {
          await ct.methods
            .mint(quantity)
            .send({ from: metaMaskAccount, value: price * quantity });
        } catch (error) {
          console.log(error);
        }

        setQuantity(1);
        setErrorMsg(false);
      }
    }
  }

  async function connectWallet() {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let total = await ct.methods.totalSupply().call();
        setSupply(total);

        setPrice(await ct.methods.PRICE().call());
        if (nftquantity - total <= 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      }
      setWalletConnected(1);
    }
  }

  return (
    <>
      <div className="Box pt-5 ">
        <div className="px-4">
          <h3>Jeremy Knows Collection</h3>
          <h6 className="pb-3">
            Minted: {Number(supply)}/{nftquantity} <br />
            {/* Burned: {burned} */}
          </h6>
          <div className="row align-items-center">
            <div className="col-sm-6">
              <img src={one} className="w-100 rounded" />
            </div>
            <div className="col-sm-6 text-center text-sm-right">
              <h6 style={{ fontSize: "14px" }}>Price Per NFT</h6>
              <h5 className="font-weight-bold">{showprice()} + GAS</h5>
              <p className="" style={{ fontSize: "13px" }}>
                {/* First 1000 Bronze Passes are Free to mint
                <br />
                <small>(MAX 2 PER WALLET)</small> */}
              </p>
            </div>
          </div>

          <div className="row align-items-center Mint my-4 pt-0 px-2">
            <div className="col-7">
              <button
                className="btn Btnn"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity == 1}
                style={{ cursor: "pointer" }}
              >
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button
                className="btn Btnn"
                onClick={() => setQuantity(quantity + 1)}
                style={{ cursor: "pointer" }}
              >
                +
              </button>
            </div>
            <div className="col-5 text-right">
              {/* <h6 className="m-0" onClick={() => setQuantity(maxAllowed)}>
                {maxAllowed} Max
              </h6> */}
            </div>
          </div>

          <div
            className="row TotelROw py-3"
            style={{
              borderTop: "1px solid white",
              borderBottom: "1px solid white",
            }}
          >
            <div className="col-6">Total</div>
            <div className="col-6 text-right">
              {showprice() * quantity} + GAS
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          {!errormsg ? (
            walletConnected == 0 ? (
              <button className="btn Cbtn " onClick={() => connectWallet()}>
                Connect
              </button>
            ) : (
              <button className="btn Cbtn " onClick={() => loadWeb3()}>
                Mint
              </button>
            )
          ) : (
            <p className="my-2 text-white">
              <b>{errormsg}</b>
            </p>
          )}
          {/* <i class="fa-solid fa-square-arrow-up-right"></i> */}
        </div>
      </div>
    </>
  );
}

export default Mintbtn1;
