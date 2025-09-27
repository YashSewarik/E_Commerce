import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

export default function Order({ token }) {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    // prefer prop token, fallback to localStorage (makes component resilient if App doesn't pass prop)
    const tok = token || localStorage.getItem('token')
    if (!tok) {
      console.log('Admin Orders -> no token available, abort fetch')
      return
    }
    try {
      console.log('Admin Orders -> fetchAllOrders', { url: `${backendUrl}/api/order/list` })
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: { Authorization: `Bearer ${tok}` },
          timeout: 10000
        }
      )
      console.log('Admin Orders -> response', res?.data)
      if (res.data.success) {
        setOrders(res.data.orders || [])
      } else {
        console.warn('Admin Orders -> API returned success:false', res.data)
        toast.error(res.data.message || 'Failed to load orders')
      }
    } catch (err) {
      // log details and show message
      console.error('Admin Orders -> fetch error', err?.response ?? err)
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        toast.error('Not authorised. Please login as admin.')
        // clear stale token so user must login again
        localStorage.removeItem('token')
        // don't call setOrders([]) here to avoid wiping existing UI unless desired
      } else if (err?.code === 'ECONNABORTED') {
        toast.error('Request timed out. Try again.')
      } else {
        toast.error(err?.response?.data?.message || err.message || 'Request failed')
      }
    }
  }

  const onSubmitHandler = async (e, orderId) => {
    try {
      const tok = token || localStorage.getItem('token')
      if (!tok) {
        toast.error('Not authorised. Please login.')
        return
      }
      const status = e.target.value
      console.log('Admin Orders -> updateStatus', { orderId, status })
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${tok}` }, timeout: 10000 }
      )
      console.log('Admin Orders -> updateStatus response', res?.data)
      if (res.data.success) {
        await fetchAllOrders()
        toast.success('Status Updated')
      } else {
        toast.error(res.data.message || 'Failed to update status')
      }
    } catch (err) {
      console.error('Admin Orders -> update error', err?.response ?? err)
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error('Not authorised. Please login as admin.')
        localStorage.removeItem('token')
      } else {
        toast.error(err?.response?.data?.message || err.message || 'Request failed')
      }
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <div className="text-[20px] text-gray-500">Order Page</div>

      <div className="flex flex-col gap-3 pt-2">
        {orders.map((order, idx) => (
          <div
            key={order._id || idx}
            className="flex p-6 justify-around border border-gray-200 text-gray-500"
          >
            <div>
              <img src={assets.parcel_icon} alt="parcel" />
            </div>

            <div>
              <div className="flex flex-col text-[13px] mb-3">
                {order.items?.map((item, i) => (
                  <div key={i}>
                    {item.name} <span>x</span> {item.quantity} {item.size}
                  </div>
                ))}
              </div>

              <div className="w-70">
                <div>{order.address?.street}</div>
                <div>
                  {order.address?.city}, {order.address?.state},{' '}
                  {order.address?.country}, {order.address?.zipcode}
                </div>
              </div>
            </div>

            <div>
              <div>Items: {order.items?.length || 0}</div>
              <div>Method: {order.paymentMethod}</div>
              <div>Payment: {order.payment ? 'Paid' : 'Unpaid'}</div>
              <div>
                Date:{' '}
                {order.date
                  ? new Date(order.date).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>

            <div>${order.amount}</div>

            <div>
              <select
                onChange={(e) => onSubmitHandler(e, order._id)}
                value={order.status || 'Order Placed'}
                className="border pr-5 border-gray-300 font-semibold p-2"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
