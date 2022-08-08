import {createContext, useReducer} from 'react'
import Cookies from "js-cookie";

export const Store = createContext();


const initialState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [], shippingAddress: {} },
  
}

function reducerfn(state, action){
    switch (action.type) {
      case "CART_ADD_ITEM": {
        const newItem = action.payload;
        const existItem = state.cart.cartItems.find(
          (item) => item.slug === newItem.slug
        );
        // update cart item will new cart value
        const cartItems = existItem
          ? state.cart.cartItems.map((item) =>
              item.name === existItem.name ? newItem : item
            )
          : [...state.cart.cartItems, newItem];
        Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
        return { ...state, cart: { ...state.cart, cartItems } };
      }
      case "CART_REMOVE_ITEM": {
        const cartItems = state.cart.cartItems.filter(
          (item) => item.slug !== action.payload.slug
        );
        Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }))
        return { ...state, cart: { ...state.cart, cartItems } };
      }

      case 'CART_RESET' :{
        return {
          ...state,
          cart: {
            cartItem: [],
            shippingAddress: {location: {}},
            paymentMethod: ''
          }
        }
      }

      case 'SAVE_SHIPPING_ADDRESS' :{
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress:{
              ...state.cart.shippingAddress,
              ...action.payload
            }
          }
        }
      }
      default:
        return state;
    }
}
// the provider is a wrapper for all component in the application
export function StoreProvider({children}) {
    const [state, dispatch] = useReducer(reducerfn, initialState);
    const value = {state, dispatch}
    return <Store.Provider value={value}>{children}</Store.Provider>
}