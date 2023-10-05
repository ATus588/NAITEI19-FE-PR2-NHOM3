import Axios from "axios";

const serverAPI = Axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const createOrder = async (orderData) => {
  try {
    const response = await serverAPI.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createReview = async (review) => {
  try {
    const response = await serverAPI.post('/reviews', review)
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateReview = async (newReview, id) => {
  try {
    const response = await serverAPI.put(`/reviews/${id}`, newReview)
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (user, id) => {
  try {
    const response = await serverAPI.put(`/users/${id}`, user)
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateUserRecentView = async (user, prodId) => {
  if(user) {
    if (!user.recentlyViewIds.includes(prodId)) {
      user.recentlyViewIds.unshift(prodId)
      if (user.recentlyViewIds.length > 4) user.recentlyViewIds.pop()
      console.log(user)
      try {
        const response = await serverAPI.put(`/users/${user.id}`, user)
        return true;
      } catch (error) {
        throw error;
      }
    }
  }
  return false;
}


export default serverAPI;

