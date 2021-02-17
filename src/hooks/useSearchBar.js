import {useState, useRef, useEffect} from 'react';
import "regenerator-runtime/runtime.js";
const fetch = require('node-fetch')

let useSearchBar = (search) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState('idle');

    useEffect(()=>{
        if(!search) return; 

        const fetchData = async () => {
            setLoading('fetching')
            let res = await fetch(`http://localhost:3000/chemicals?search=${search}`)
            let json = await res.json();
            let info = await json;
            setData(await info);
            setLoading('fetched')
        }
         fetchData();
    }, [search])


 return data;
}
export default useSearchBar;


