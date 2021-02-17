import React, { useState, useEffect, } from 'react';
const fetch = require('node-fetch')

const SearchBar = (props) => {
    const [search, setSearch] = useState('')


    const handleSearch = async (e) => {
        e.preventDefault();
        setSearch(e.target.elements.searchValue.value.trim());
        //console.log('setting')
    }

//     useEffect(()=>{
// console.log('first mount')
//     }, [])


    useEffect(() => {
        const fetchData = async () => {
            let res = await fetch(`http://localhost:3000/chemicals?search=${search}`)
            let json = await res.json();
            let info = await json;
            props.setData({info: await info, query: search});
            }

        if(search){
            props.setLoading('fetching');
            fetchData()
            .then(()=>{
                props.setLoading('done')
            })
    }

    }, [search])


    return (
        <div id="flexContainer">
            {props.error ? <span id="formError">{props.error}</span> : ''}
            <form onSubmit={handleSearch}>
                <input className="searchInput" type='text' name="searchValue" />
                <button className="button" type='submit'>Search</button>
            </form>
        </div>
    )


}

export default SearchBar;