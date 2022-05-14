import React from "react";
import "./Home.css";
import { useState } from "react";
import Mintbtn1 from "./mintbtn1";
import jeremy from "../images/jeremy.png";

export default function Home() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="Sara">
      <div className="container text-center text-white">
        <img src={jeremy} className="w-100 topvid" />
        <h1>Jeremy Knows Collection</h1>
        <h4>By Jeremy Knows</h4>
        <a href="https://twitter.com/jeremyknowsVF" target="_blank">
          <i className="fab fa-twitter mx-2 color-white"></i>
        </a>
        <a
          href="https://instagram.com/wannabeaveefriend?igshid=YmMyMTA2M2Y="
          target="_blank"
        >
          <i className="fab fa-instagram mx-2 color-white"></i>
        </a>
        <h6 className="pb-3">Total supply: 100,000 NFTs</h6>
      </div>

      <div className="container DivB">
        <div className="row justify-content-center">
          <div className="col-md-6 my-2">
            <Mintbtn1 />
          </div>
        </div>
      </div>
    </div>
  );
}
