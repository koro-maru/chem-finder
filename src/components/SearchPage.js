import React, {useState, useEffect} from 'react';
import Chemical from './Chemical';
import SearchBar from './SearchBar';
import {NavLink, useHistory} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
const SearchPage = (props) => {
    const [data, setData] = useState(props.data)
    const [loading, setLoading] = useState("idle");
    const [filter, setFilter] = useState('ascending');
    
    useEffect(()=>{console.log(" NEW DATA : " , data)}, [data])

    useEffect(()=>{
        switch(filter) {
            case 'ascending':
                 let ascArr = displayedChemList.chemList.slice().sort((a,b) => {
                    return a.props.price - b.props.price;
                });

                
                setDisplayedChemList({
                    offset: displayedChemList.offset,
                    displayedChemList: displayedChemList.displayedChemList,
                    chemList: ascArr
                })
                break;

            case 'descending':
                console.log('desc')
                let descArr = displayedChemList.chemList.slice().sort((a,b) => {
                    return b.props.price - a.props.price;
                });

                setDisplayedChemList({
                    offset: displayedChemList.offset,
                    displayedChemList: displayedChemList.displayedChemList,
                    chemList: descArr
                })
                break;
        }
    }, [filter])

    console.log(loading)
    // if(loading=='done'){
    //     return <SearchPage data = {data}/>
    //  }

     const chemList =  data.map(chemical => (
        <Chemical key={chemical._id} {...chemical} />
        ));

       chemList.sort((a,b) => {
            return a.props.price - b.props.price;
        });


    const perPage = 10;
    const pageCount = Math.ceil(chemList.length / perPage );

    let chemArr;

    if(10 > chemList.length){
        chemArr = chemList.slice(0, chemList.length)
    }
    else{
       chemArr = chemList.slice(0, 10);
    }

    const [displayedChemList, setDisplayedChemList] = useState({
        offset: 0,
        displayedChemList: chemArr,
        chemList: chemList
    })

    const handlePageClick = (d) => {
        let selected = d.selected;
        console.log(selected)
        let newOffset =  Math.ceil(selected * perPage);

        if(newOffset + 10 > chemList.length){
            setDisplayedChemList({
               offset: newOffset,
               displayedChemList: displayedChemList.chemList.slice(newOffset, chemList.length),
               chemList: displayedChemList.chemList
            })
        }
        else{
            setDisplayedChemList({
                offset: newOffset,
                displayedChemList: displayedChemList.chemList.slice(newOffset, newOffset + 10),
                chemList: displayedChemList.chemList
            });
        }
    }


        const changeOption = (e) => {
            e.preventDefault();
            setFilter(e.target.value.trim());
            console.log(filter)
        }

        


        return (
            <div>
                <SearchBar setLoading = {setLoading} data = {data} setData = {setData} />
                <NavLink className ="navlink" exact to = "/" activeClassName="selected">HOME</NavLink>
                <div id="searchContainer">
                    <select name="filter" id="filter" value={filter} onChange={changeOption}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>
                </div>
                    <h1>You searched for "<strong>{"thinkg"}</strong>"</h1>
                
               { displayedChemList.displayedChemList }
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                 />
            </div>
        )
            }
export default SearchPage;