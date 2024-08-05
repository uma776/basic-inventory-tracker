'use client'
import Image from "next/image";
import { useState, useEffect} from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button} from "@mui/material"
import { 
  collection, 
  deleteDoc, 
  getDocs,
  doc,
  query, 
  getDoc, 
  setDoc
} from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('') //variable for inputted item name, initalized as empty string 

  const updateInventory = async() => {   //async: freezes website while fetching data
    const snapshot = query(collection(firestore, 'inventory'))  //connect a variable to the collection 'inventory'
    const docs = await getDocs(snapshot);  //fetches boxes/items from 'inventory' using snapshot
    const inventoryList = []
    
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    
    setInventory(inventoryList)
  } 

  useEffect(() =>{   //runs when dependency array changes(add & drop items)
    updateInventory()
  }, [])  //bc of one dependency array, this only load once when page loads(updates items when page loads)

  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})   //increment count of the existing item
    }
    else{
      await setDoc(docRef, {quantity: 1})   //if new item then set quantity to 1
    }

    await updateInventory()
  }

  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){    //delete item from list
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})   //decrement count of the item
      }
    }

    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return(
  <Box //making title box fit the whole screen
    width="100vw"    //100% of view width
    height="100vh"   //100% of view height
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}
    >
    <Modal open={open} onClose={handleClose} >
      <Box 
        position="absolute" 
        top="50%" 
        left="50%" 
        width={400} 
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{  //sx transforms characteristics for material ui componenets(mostly don't need but need for this one)
          transform:"translate(-50%, -50%)" ,
        }}
        >
        <Typography variant="h6"> Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}> 
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange = {(e) => {  //set name of new item added
              setItemName(e.target.value)
            }}
          />
          <Button 
            variant="outlined"
            onClick={() =>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          > Add </Button>
        </Stack>
      </Box>
    </Modal>
    
    <Box m={3} paddingTop={5}>
      <Typography variant="h1"> Inventory Tracker </Typography>
    </Box>
    
    <Button 
      color="secondary"
      variant="contained" 
      onClick={() => {
        handleOpen()
      }}
    > Add new item </Button>
    
    <Box border="1px solid #000">
      <Box width="800px" height="100px" bgcolor="#CBC3E3" display="felx" alignItem="center" justifyContent="center">
        <Typography variant="h2" color="#000"> Current inventory items: </Typography>
      </Box>  

      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({name, quantity}) =>(
            <Box
              key={name} 
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#000" textAlign="center ">
                {name.charAt(0).toUpperCase() + name.slice(1)}    
              </Typography> 
              <Typography variant="h3" color="#000" textAlign="center ">
                {quantity}    
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  color="success"
                  variant="contained" 
                  onClick={() => {
                    addItem(name)
                  }}
                > Add </Button>
                <Button
                  color="error"
                  variant="contained" 
                  onClick={() => {
                    removeItem(name)
                  }}
                > Remove </Button>
              </Stack>
            </Box>
        ))}
      </Stack> 
    </Box>
    
    {
      inventory.forEach((item) => {
        console.log(item)
        return(
          <Box>
          {item.name}
          {item.count}
          </Box>
        )
      })
    }
  </Box>
  );
}
