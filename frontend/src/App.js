import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import PayResultScreen from './screens/PayResultScreen'
import PrivateComponent from './components/PrivateComponent'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />

            <Route path='/cart' element={<CartScreen />} />

            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />


            <Route path='/profile' element={
              <PrivateComponent component={ProfileScreen} />
            } />

            <Route path='/shipping' element={
              <PrivateComponent component={ShippingScreen} />
            } />

            <Route path='/payment' element={
              <PrivateComponent component={PaymentScreen} />
            } />

            <Route path='/placeorder' element={
              <PrivateComponent component={PlaceOrderScreen} />
            } />

            <Route path='/order/:orderId' element={
              <PrivateComponent component={OrderScreen} />
            } />

            <Route path='/pay-result/:token' element={
              <PrivateComponent component={PayResultScreen} />
            } />

          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
