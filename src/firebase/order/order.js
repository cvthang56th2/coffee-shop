import {
  setDoc,
  doc,
  query,
  orderBy,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../config'
import { uid } from 'uid'
import { snapshotToArray } from '../../utils/utils'

const ORDER = 'orders'

class orderServices {
  async createOrder(data) {
    return new Promise(function(resolve, reject) {
      try {
        const id = data.id || uid(20)
        const today = new Date()
        const ref = doc(db, ORDER, id)
        data.id = id
        return resolve(setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error create order', err)
        reject(err)
      }
    });
  }

  async updateOrder(orderId, data) {
    return new Promise(function(resolve, reject) {
      try {
        const today = new Date()
        const ref = doc(db, ORDER, orderId)
        return resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error update order', err)
        reject(err)
      }
    })
  }

  async deleteOrder(orderId) {
    return new Promise(function(resolve, reject) {
      try {
        const ref = doc(db, ORDER, orderId)
        return resolve(deleteDoc(ref))
      } catch (err) {
        console.error('error delete order', err)
        reject(err)
      }
    })
  }

  getOrders(callback) {
    const q = query(collection(db, ORDER), orderBy("createdAt"))
    if (typeof this.unsubscribeOrders === 'function') {
      this.unsubscribeOrders()
    }
    this.unsubscribeOrders = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new orderServices()
