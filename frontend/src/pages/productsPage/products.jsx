import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import EnhancedTable from "../../components/productsComps/productsTable";
import AddBtn from "../../components/productsComps/addProdBtn";
import EditBtn from "../../components/productsComps/editProdBtn";
import SellBtn from "../../components/productsComps/sellProdBtn";
import { BACKEND_API } from "../../api";
import { SearchBar } from '../../components/SearchBar';
import '../../components/Searchbar.css';
import { useSelector } from 'react-redux';

function Products() {
    
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    // const state = useSelector(state => state);
    

    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/products`, {method: "GET"});
        const data = await response.json();
        setProducts(data);
        console.log("products data: ", data);
    }, []);

    const filterData = (query, products) => {
        if (!query) {
          return products;
        } else {
          return products.filter((d) => d['name'].toLowerCase().includes(query.toLowerCase()));
        }
    };

    useEffect(() => {
        fetchData();
    }, [products.length]);

    const dataFiltered = filterData(searchQuery, products);
    return (
        <>
            <Navbar/>
            <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Products</h1>
            
            <div className="container-search">
                <div className="tools-2">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <div className='edit-btn-product'>
                    <EditBtn fetchData={fetchData}/>
                </div>
                <div className='add-btn-product' >
                    <AddBtn fetchData={fetchData} setProducts={setProducts}/>
                </div>
            </div>
            <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '80px'}}>
                {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData}/> : <p>The inventory is empty</p>}
            </div>
        </>
    );
}
export default Products;

