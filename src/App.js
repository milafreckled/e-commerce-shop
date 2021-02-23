import React, { useState, useEffect }  from 'react';
import { commerce } from './lib/commerce';
import  Navbar from './components/Navbar/Navbar';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');


  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  }
  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  }
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, {quantity});
    setCart(cart);
  }
  const handleRemoveCart = async(productId) => {
  const { cart } = await commerce.cart.remove(productId);
  setCart(cart);
}
const handleEmptyCart = async() => {
const {cart } = await commerce.cart.empty();
setCart(cart);
}
const handleAddToCart = async(productId, quantity) => {
  const {cart} = await commerce.cart.add(productId, quantity);
  setCart(cart);
}
const refreshCart = async () => {
  const newCart = await commerce.car.refresh();
  setCart(newCart);
}
const handleCaptureCheckout = async(checkoutTokenId, newOrder) =>{
  try{
    const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
    setOrder(incomingOrder);
    refreshCart();
  }catch(error){
    setErrorMessage(error.data.error.message);
  }
}
 const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  return (
    <div>
    <Router>
    <Navbar />
    <Switch>
    <Route exact path="/">
     <Products products={products} onAddToCart={handleAddToCart} />
    </Route>
    <Route exact path="/cart">
        <Cart
        cart={cart}
        handleUpdateCartQty = {handleUpdateCartQty}
        handleRemoveCart = {handleRemoveCart}
        handleEmptyCart = {handleEmptyCart}

         />
    </Route>
    <Route exact path="/checkout">
     <Checkout
       cart={cart}
       order={order}
       onCaptureCheckout={handleCaptureCheckout}
       error = {errorMessage}
     />
    </Route>
    </Switch>
    </Router>
    </div>
  )
}
export default App;
