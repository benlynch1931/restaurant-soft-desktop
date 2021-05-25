import React, { useContext } from 'react';

import '../styles/BarScreen.css'

import { AppContext } from '../contexts/AppContext.js'


const BarScreen = () => {
  
  const { setScreen } = useContext(AppContext);
  
  const orders = [
    {
      name: '',
      number: 3,
      time: '19:23',
      total: 7.55,
      basket: [
        {
          label: 'Tribute',
          price: 3.75,
          displayBar: true,
          displayKitchen: false
        },
        {
          label: 'Haze',
          price: 3.80,
          displayBar: true,
          displayKitchen: false
        },
        {
          label: 'KITCHEN',
          price: 0,
          displayBar: false,
          displayKitchen: true
        }
      ]
    }
  ]
  
  const iterateOrders = () => {
    let orderRendering = []
    
    orders.forEach((order, idx) => {
      orderRendering.push(renderTicket(order))
    });
    
    return orderRendering;
  }
  
  const renderTicket = (order) => {
    let ticketRendering = []
    ticketRendering.push(
        <div className='bar-tickets'>
        
          <div className='bar-tickets-header'>
            <h1 className='bar-tickets-header-table'>Table { order.number }</h1>
            <h1 className='bar-tickets-header-time'>{ order.time }</h1>
          </div>
          
          <div className='bar-tickets-main'>
            <ul className='bar-tickets-main-order-items'>
              { renderOrderItems(order.basket) }
            </ul>
          </div>
          
          <div className='bar-tickets-footer'>
            <button className='bar-tickets-footer-print'>Print</button>
            <h1 className='bar-tickets-footer-price'>£ { order.total.toFixed(2) }</h1>
          </div>
        </div>
    )
    return ticketRendering;
  }
  
  const renderOrderItems = (basket) => {
    let orderItemsRendering = []
    let orderItemsObject = {}
    basket.forEach((item, i) => {
      if (item.displayBar) {
        // if the property/item isn't in the object yet, add it before adding to the number of items
        if (!(item.label in orderItemsObject)) {
          // create the item property
          orderItemsObject[item.label] = 0
        }
        // add to the property
        orderItemsObject[item.label] += 1
      }
    });
    for (let [key, value] of Object.entries(orderItemsObject)) {
      orderItemsRendering.push(
        <li>
          { value } x { key }
        </li>
      )
    }
    return orderItemsRendering;
  }
  
  
  return (
    <div style={{ position: 'fixed', width: '100%', minHeight: '100%', backgroundColor: '#E9E9E9' }}>
      <div className='bar-navbar'>
        <button className='bar-back-button' onClick={() => { setScreen('main') }}>
          <h1>Back</h1>
        </button>
      </div>
      
      <div className='bar-main-display'>
        {/*<div className='bar-tickets'>
        
          <div className='bar-tickets-header'>
            <h1 className='bar-tickets-header-table'>Table 1</h1>
            <h1 className='bar-tickets-header-time'>20:23</h1>
          </div>
          
          <div className='bar-tickets-main'>
            <ul></ul>
          </div>
          
          <div className='bar-tickets-footer'>
            <button className='bar-tickets-footer-print'>Print</button>
            <h1 className='bar-tickets-footer-price'>£100.00</h1>
          </div>
        </div>*/}
        { iterateOrders() }
        
        {/*<div className='bar-tickets'></div>
        
        <div className='bar-tickets'></div>
        
        <div className='bar-tickets'></div>
        
        <div className='bar-tickets'></div>
        <div className='bar-tickets'></div>
        <div className='bar-tickets'></div>
        <div className='bar-tickets'></div>
        
        <div className='bar-tickets'></div>*/}
        
      </div>
    </div>
  )
}

export default BarScreen;