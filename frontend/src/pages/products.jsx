import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
import EnhancedTable from "../components/productsTable";
import AddBtn from "../components/addProdBtn";
import EditBtn from "../components/editProdBtn";
import SellBtn from "../components/sellProdBtn";
import { BACKEND_API } from "../api";

function Products() {
    
    const [products, setProducts] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/products`, {method: "GET"});
        const data = await response.json();
        setProducts(data);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return (
        <>
            <Navbar/>
            <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Products</h1>
            <div style={{display: 'flex', marginLeft: '960px'}}>
                <div style={{marginRight: '10px'}}>
                    <EditBtn fetchData={fetchData}/>
                </div>
                <div style={{marginRight: '10px'}}>
                    <AddBtn fetchData={fetchData}/>
                </div>
                <SellBtn fetchData={fetchData}/>
            </div>
            <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '50px'}}>
                {products.length > 0 ? <EnhancedTable rows={products} fetchData={fetchData}/> : <p>Loading...</p>}
            </div>
        </>
    );
}
export default Products;

