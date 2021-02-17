import React, { useState } from 'react';
import { useHistory, NavLink } from "react-router-dom";
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import ChemList from '../components/ChemList'
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const HomePage = () => {
    const [loading, setLoading] = useState("idle");
    const [data, setData] = useState({})
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    
  `;
    return (
        <div id="home">
            <Header />
            <SearchBar className="searchbar" setLoading={setLoading} data={data} setData={setData} />
            {
                loading=='done' || document.cookie ? <ChemList data={data} /> : loading=='fetching'? (<div className="sweet-loading">
                <ClipLoader
                    css={override}
                    size={150}
                    color={"#123abc"}
                    loading={loading == 'fetching'}
                />;
            </div>) : ''
            }
        </div>
    );
}
export default HomePage;