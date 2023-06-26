import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
import EnhancedTable from "../components/productsTable";
import FormDialog from "../components/addProdBtn";
import { BACKEND_API } from "../api";

function Products() {
    
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        const response = await fetch(`${BACKEND_API}/products`, {method: "GET"});
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <>
            <Navbar/>
            <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Products</h1>
            <div style={{marginLeft: '1200px'}}>
                <FormDialog fetchData={fetchData}/>
            </div>
            <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '50px'}}>
                {products.length > 0 ? <EnhancedTable rows={products} fetchData={fetchData}/> : <p>Loading...</p>}
            </div>
        </>
    );
}
export default Products;

