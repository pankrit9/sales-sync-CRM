import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
import EnhancedTable from "../components/productsTable";
import AddBtn from "../components/addProdBtn";
import EditBtn from "../components/editProdBtn";
import { BACKEND_API } from "../api";
import { SearchBar } from '../components/SearchBar';
import "../components/Searchbar.css"

function Products() {
    
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    

    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/products`, {method: "GET"});
        const data = await response.json();
        setProducts(data);
    }, []);

    const filterData = (query, products) => {
        if (!query) {
          return products;
        } else {
          return products.filter((d) => d['name'].toLowerCase().includes(query));
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const dataFiltered = filterData(searchQuery, products);
    return (
        <>
            <Navbar/>
            <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Products</h1>
            <div className="tools">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />
                <div className='product-buttoms'>
                    <EditBtn fetchData={fetchData} style={{right:'10%'}}/>
                    <AddBtn fetchData={fetchData}/>
                </div>
                
            </div>
            <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '50px'}}>
                {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData}/> : <p>The inventory is empty</p>}
            </div>
        </>
    );
}
export default Products;

