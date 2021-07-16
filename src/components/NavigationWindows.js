import React, { useContext, useState, useEffect } from 'react';

import { AppContext } from '../contexts/AppContext.js';
import '../styles/NavigationWindow.css'

const DOMAIN = "192.168.1.213"


const NavigationWindows = () => {
  
  const { navigationWindow } = useContext(AppContext)
  const [tabs, setTabs] = useState([])
  const [tabToDelete, setTabToDelete] = useState(null)
  
  useEffect(() => {
    fetchTabs()
  }, [])
  
  const fetchTabs = () => {
    fetch(`http://${DOMAIN}:6030/api/tabs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => formatTabs(data.tabs))
    .then(tabs => setTabs(tabs))
    
  }
  
  const formatTabs = (tabs) => {
    let formattedTabs = []
    tabs.forEach((tab, i) => {
      tab.basket = extractBasketInfo(tab.basket)
      tab.total = parseFloat(tab.total)
      formattedTabs.push(tab)
    });
    return formattedTabs
  }
  
  const extractBasketInfo = (tabBasket) => {
    const formattedItems = []
    const itemsQuantities = {}
    const separateItems = tabBasket.split(';')
    separateItems.forEach((item, idx) => {
      const itemInfoSplit = item.split(',')
      itemsQuantities[itemInfoSplit[0].split(':')[1]] = {
          [itemInfoSplit[0].split(':')[0]]: convertValue(itemInfoSplit[0].split(':')),
          [itemInfoSplit[1].split(':')[0]]: convertValue(itemInfoSplit[1].split(':')),
          [itemInfoSplit[2].split(':')[0]]: convertValue(itemInfoSplit[2].split(':')),
          [itemInfoSplit[3].split(':')[0]]: convertValue(itemInfoSplit[3].split(':')),
          [itemInfoSplit[4].split(':')[0]]: convertValue(itemInfoSplit[4].split(':'))
        }
    });
    const itemsQuantitiesArray = Object.entries(itemsQuantities)
    itemsQuantitiesArray.forEach((item, idx) => {
      formattedItems.push(item[1])
    });

    return formattedItems;
    
    
  }
  
  const convertValue = ([key, value]) => {
    if (key === 'quantity') {
      return parseInt(value)
    } else if (key === 'displayBar' || key === 'displayKitchen') {
      return stringToBoolean(value)
    } else if (key === 'price') {
      return parseFloat(value)
    } else {
      return value
    }
  }
  
  const stringToBoolean = (string) => {
    if (string === 'true') {
      return true
    } else {
      return false
    }
  }
  
  const iterateTabs = () => {
    let tabRendering = []
    
    tabs.forEach((tab, idx) => {
      tabRendering.push(renderTab(tab))
    });
    
    return tabRendering;
  }
  
  const deleteTab = () => {
    console.log("invoked!")
    fetch(`http://${DOMAIN}:6030/api/tabs/${tabToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      setTabToDelete(null)
      fetchTabs()
    })
  }
  
  const renderTab = (tab) => {
    let ticketRendering = []
    let dateCreated = tab.date_created
    dateCreated = dateCreated.split("T")[0]
    dateCreated = dateCreated.split("-")
    dateCreated = `${dateCreated[1]}-${dateCreated[2]}`
    ticketRendering.push(
        <div className='tab-tickets'>
        
          <div className='tab-tickets-header'>
            <h1 className='tab-tickets-header-tab-id'>{ tab.id }</h1>
            <h1 className='tab-tickets-header-tab-name'>{ tab.name }</h1>
          </div>
          
          <div className='tab-tickets-mid'>
            <h1 className='tab-tickets-mid-tab-date'>{ dateCreated }</h1>
            <h1 className='tab-tickets-mid-tab-price'>£ { tab.total.toFixed(2) }</h1>
          </div>
          
          <div className="tab-tickets-print">
            <button className='tab-tickets-print-button'>Print</button>
          </div>
          
          <div className='tab-tickets-footer'>
            <button className='tab-tickets-footer-cash'>Cash</button>
            
            <button className='tab-tickets-footer-delete' onClick={() => { setTabToDelete(tab.id) }}>Del</button>
          </div>
        </div>
    )
    return ticketRendering;
  }
  
  const renderDeleteTabConfirmation = () => {
    return (
      <div className='delete-tab-confirmation-background' style={{ display: tabToDelete != null ? 'block' : 'none' }}>
        
        <div className='delete-tab-confirmation-main'>
          <div className='delete-tab-confirmation-label-div'>
            <h1 className='delete-tab-confirmation-label-h1'>Delete tab { tabToDelete }. Continue?</h1>
          </div>
          <div className='delete-tab-confirmation-option-div'>
            <button className='delete-tab-confirmation-option-button-left' onClick={() => { setTabToDelete(null) }}>Cancel</button>
            <button className='delete-tab-confirmation-option-button-right' onClick={() => { deleteTab() }}>Continue</button>
          </div>
        </div>
        
      </div>
    )
  }
  
  const renderNavigationWindows = () => {
    if (navigationWindow === "tabs") {
      return (
        <div className="navigation-window-background">
          <div className="navigation-window-main">
          { renderDeleteTabConfirmation() }
          <div className='navigation-window-main-display'>

            { iterateTabs() }
            
          </div>
          </div>
        </div>
      )
    }
  }
  
  return (
    <div className="bottomNav-display" style={{ display: navigationWindow === null ? 'none' : 'block' }}>
      { renderNavigationWindows() }
    </div>
  )
}

export default NavigationWindows;