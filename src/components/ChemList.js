import React, { useState, useEffect } from 'react';
import Chemical from './Chemical';
import ReactPaginate from 'react-paginate';

const ChemList = (props) => {

    const data = props.data.info.slice();

    data.sort((a, b) => {
        return a.price - b.price;
    });


    const [filter, setFilter] = useState('ascending');

    const perPage = 10;

    const chemData = data.map(chemical => (
        <Chemical key={chemical._id} {...chemical} />
    ));


    const pageCount = Math.ceil(chemData.length / perPage);

    const [displayedChemlist, setDisplayedChemlist] = useState(10 > chemData.length ? chemData.slice(0, chemData.length): chemData.slice(0, 10));
    const [chemList, setChemlist] = useState(chemData);
    const [offset, setOffset] = useState(0);

    const changeOption = (e) => {
        e.preventDefault();
        setFilter(e.target.value.trim());
        console.log(filter)
    }

    useEffect(()=>{
       setDisplayedChemlist(10 >= chemList.length ? chemList.slice(offset, chemList.length) : chemList.slice(offset, offset+10))
    }, [chemList,offset])
 

    useEffect(() => {
        switch (filter) {
            case 'ascending':
                let ascArr = chemList.slice().sort((a, b) => {
                    return a.props.price - b.props.price;
                });

                setChemlist(ascArr)       
          
                break;

            case 'descending':
                console.log('desc')
                let descArr = chemList.slice().sort((a, b) => {
                    return b.props.price - a.props.price;
                });

                setChemlist(descArr)  
                break;
        }
    }, [filter])


    const handlePageClick = (d) => {
        let selected = d.selected;
        console.log(selected)
        setOffset(Math.ceil(selected * perPage));

    try {
     window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }

        
    }



    return (
        <div>
            <div id="searchContainer">
                <select name="filter" id="filter" value={filter} onChange={changeOption}>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>
            <h1 id="searchedFor">You searched for "<strong>{props.data.query}</strong>" with {chemList.length} results</h1>

            <div id="chemListContainer">{ displayedChemlist.length!=0 ? displayedChemlist : <strong className="small-text">NO RESULTS</strong>}</div>
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination text-center'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
            />
        </div>
    )
}
export default ChemList;