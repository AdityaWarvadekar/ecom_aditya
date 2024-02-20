import React, { useState } from 'react';
import "./Homepage.css";

const HomePage = () => {
  const host = process.env.PORT;
  const [prodList, setProdList] = useState([]);
  const[username, setUsername] = useState("");
  const [transactions, setTransactions] = useState([]);

  const showPrices = async()=>{
    try{
    const response = await fetch(`${host}/transactions`);
    const json = await response.json();
    if(json.success){
        console.log(json.transactions);
        setTransactions(json.transactions);
    }
    else{console.log("khukhukhukhu")}
    }catch(error){
        console.log(error);
    }
  }

  const handlePriceChange = (productName, value) => {
    setProdList((prevProdList) => {
      const updatedProdList = [...prevProdList];
      const existingProductIndex = updatedProdList.findIndex(
        (item) => item.product === productName
      );

      if (existingProductIndex !== -1) {
        updatedProdList[existingProductIndex].price = value;
      } else {
        updatedProdList.push({ product: productName, price: value });
      }

      return updatedProdList;
    });
  };

  const handleAddPrices = async (e) => {
    e.preventDefault();
    if((username==="")){
        alert("Enter username!");
        return;
    }
    console.log('Product List:', prodList);
    const body = JSON.stringify({
        username: username,
        prodList: prodList
    });
    console.log(body);
    
   try{
    const response = await fetch(`${host}/saveTransaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: body
    });
    const json = await response.json();
    if(json.success){
        alert("Prices Added");
        setProdList([]);
        setUsername("");
        showPrices();
    }else{
        // alert("Internal Server error");
        console.log(json);
    }
   }catch(error){
    console.log(error);
   }
  };

  return (
    <div className='container'>
      <h1>Product Price Tracker</h1>
      <div style={{display: "flex", justifyContent: "space-evenly", width: "100%"}}>
      <form onSubmit={handleAddPrices}>
        <h3>Username: </h3>
        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
      {['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'].map(
        (productName) => (
          <div key={productName} className='list'>
            <h3>{productName}</h3>
            <input
              type="number"
              placeholder="Enter price"
              value={
                prodList.find((item) => item.product === productName)?.price ||
                ''
              }
              onChange={(e) => handlePriceChange(productName, e.target.value)}
            />
          </div>
        )
      )}
      <button type="submit" className="submitBtn" >Add Prices</button>
      </form>
      <div style={{display: transactions.length===0? "none" : "", padding: ""}} className='example'>
        <h2>All Prices:</h2>
        {
            transactions.map((item, index)=>(
               <>
               {/* <div style={{display: "flex", alignItems: "center"}}> */}
               <div style={{display: "flex", alignItems: "center"}}>
               <h3>Username: </h3>
               <p style={{margin: "0 10px"}}>{item.username}</p>
               </div>
               <ul>
               {item.prodList.map((t, index)=>(
                <>
                <li >
                    {t.product}: {t.price}
                </li>
                </>
               ))}
               </ul>
               </>
            ))
        }
        {/* <ul>
          {transactions.map((item, index) => (
            <li key={index}>
              {item.product}: ${item.price}
            </li>
          ))}
        </ul> */}
      </div>
      </div>
      <button className='submitBtn' style={{backgroundColor: "green"}} onClick={showPrices}>See All Prices</button>
    </div>
  );
};

export default HomePage;