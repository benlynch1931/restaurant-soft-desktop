import React, { useContext, useState, useEffect } from 'react';

import '../styles/BarScreen.css'
import BottomNavigation from '../components/BottomNavigation.js';

import { orderStore } from '../contexts/OrderStore.js'
import { AppContext } from '../contexts/AppContext.js'

// const DOMAIN = "92.16.101.121"
const DOMAIN = "192.168.1.213"

const BarScreen = () => {
  
  const { setScreen } = useContext(AppContext);
  const [orders, setOrders] = useState([])
  

  
  const fetchOrders = () => {
    fetch(`http://${DOMAIN}:6030/api/orders`, {
      method: 'GET', 
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => formatOrders(data.orders))
    
    // Continually check database for new orders. 60000 = 1 minute
    setTimeout(() => {
      fetchOrders()
    }, 60000)
  }
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const formatOrders = (orders) => {
    let formattedOrders = []
    
    orders.forEach((order, idx) => {
      order.total = convertValue(['total', order.total])
      order.orders = extractBasketInfo(order.orders)
      // from 2021-06-26 17:10:00.142392 TO 17:10
      const time = order.order_time.split('T')[1].split('.')[0].split(':')
      order.order_time = `${time[0]}:${time[1]}`
      order.is_paid = convertValue('is_paid', [order.is_paid])
      formattedOrders.push(order)
    })
    
    setOrders(formattedOrders)
  }
  
  const extractBasketInfo = (orderBasket) => {
    const formattedBasket = []
    const separateItems = orderBasket.split(';')
    separateItems.forEach((item, idx) => {
      const itemInfoSplit = item.split(',')
      formattedBasket.push({
          [itemInfoSplit[0].split(':')[0]]: convertValue(itemInfoSplit[0].split(':')),
          [itemInfoSplit[1].split(':')[0]]: convertValue(itemInfoSplit[1].split(':')),
          [itemInfoSplit[2].split(':')[0]]: convertValue(itemInfoSplit[2].split(':')),
          [itemInfoSplit[3].split(':')[0]]: convertValue(itemInfoSplit[3].split(':')),
          [itemInfoSplit[4].split(':')[0]]: convertValue(itemInfoSplit[4].split(':'))
        })
    });

    return formattedBasket;
      
  }
  
  const convertValue = ([key, value]) => {
     if (key === 'displayBar' || key === 'displayKitchen' || key === 'is_paid') {
      return stringToBoolean(value)
    } else if (key === 'price' || key === 'total') {
      return stringToFloat(value)
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

  const stringToFloat = (string) => {
    return parseFloat(string)
  }

  const stringToInteger = (string) => {
    return parseInt(string)
  }
  
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
            <h1 className='bar-tickets-header-table'>Table { order.table_number }</h1>
            <h1 className='bar-tickets-header-time'>{ order.order_time }</h1>
          </div>
          
          <div className='bar-tickets-main'>
            <ul className='bar-tickets-main-order-items'>
              { renderOrderItems(order.orders) }
            </ul>
          </div>
          
          <div className='bar-tickets-footer'>
            <button className='bar-tickets-footer-print'>Print</button>
            <button className='bar-tickets-footer-complete' onClick={() => { completeOrder(order.id) }}>| Complete</button>
            <h1 className='bar-tickets-footer-price'>£ { order.total.toFixed(2) }</h1>
          </div>
        </div>
    )
    return ticketRendering;
  }
  
  const renderOrderItems = (basket) => {
    let orderItemsRendering = []
    basket.forEach((item, idx) => {
      if (item.displayBar === true) {
        orderItemsRendering.push(
          <li className='bar-tickets-main-order-items-each'>
            <p style={{ width: "15%", textAlign: "right", marginRight: "2%" }}>{ item.quantity } x</p>
            <p style={{ width: "55%" }}>{ item.label }</p>
            <p style={{ width: "30%", textAlign: "right" }}>£ { (item.price * item.quantity).toFixed(2) }</p>
          </li>
        )
      }
    })
      
    
    return orderItemsRendering;
  }
  
  const completeOrder = (orderId) => {
    const body = {
      'order_id': orderId
    }
    fetch(`http://${DOMAIN}:6030/api/previous_orders`, {
      method: 'POST', 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => fetchOrders())
  }
  
  
  return (
    <div style={{ position: 'fixed', width: '100%', minHeight: '100%', backgroundColor: '#E9E9E9' }}>
      <div className='bar-navbar'>
        <h1 className='bar-navbar-title'>Bar</h1>
        <button className='bar-back-button' onClick={() => { console.log("Working"); setScreen('main') }}>
          <h1>Back</h1>
        </button>
      </div>
      
      <div className='bar-main-display'>

        { iterateOrders() }
        

        
      </div>
      
      <BottomNavigation />
    </div>
  )
}

export default BarScreen;