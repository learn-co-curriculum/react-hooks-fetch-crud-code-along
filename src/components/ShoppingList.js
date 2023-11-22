import React, { useState,useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";


function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/items').then((r) => r.json())
  .then((items) => setItems(items));
  }, []);
  
  function handleUpdateItem(updatedItem) {
  const updatedItems = items.map((item)=>{
    if(item.id === updatedItem) {
      return updatedItem;
    } else {
      return item;
    }
  });
  setItems(updatedItems);
  }
  function handleAddItem(newItem){
    console.log('In ShoppingList', newItem);
    setItems([...items, newItem]);
  }
  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">

      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
