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


// The App component serves as the root component of the application.
// It defines the structure, routes, and navigation for the app using React Router.

function App() {
  return (
    <Router> {/* Wraps the application with the Router component to enable routing */}
      <Header /> {/* Includes the Header component for navigation and branding */}
      <main>
        <Container> {/* Provides a Bootstrap container for consistent spacing */}
          <Routes> {/* Defines the app's routes and corresponding components */}

            {/* Home Route */}
            <Route path='/' element={<HomeScreen />} /> 
            {/* Displays the HomeScreen component when the user visits the root URL */}

            {/* Product Details Route */}
            <Route path='/product/:id' element={<ProductScreen />} /> 
            {/* Displays the ProductScreen component for a specific product based on its ID */}

            {/* Cart Route */}
            <Route path='/cart' element={<CartScreen />} /> 
            {/* Displays the CartScreen component for managing the user's cart */}

            {/* Authentication Routes */}
            <Route path='/login' element={<LoginScreen />} /> 
            {/* Displays the LoginScreen component for user login */}
            <Route path='/register' element={<RegisterScreen />} /> 
            {/* Displays the RegisterScreen component for user registration */}

            {/* Profile Route (protected) */}
            <Route path='/profile' element={
              <PrivateComponent component={ProfileScreen} />
            } /> 
            {/* Displays the ProfileScreen component only if the user is authenticated (wrapped in PrivateComponent) */}

            {/* Shipping Route (protected) */}
            <Route path='/shipping' element={
              <PrivateComponent component={ShippingScreen} />
            } /> 
            {/* Displays the ShippingScreen component for entering shipping details */}

            {/* Payment Route (protected) */}
            <Route path='/payment' element={
              <PrivateComponent component={PaymentScreen} />
            } /> 
            {/* Displays the PaymentScreen component for selecting payment method */}

            {/* Place Order Route (protected) */}
            <Route path='/placeorder' element={
              <PrivateComponent component={PlaceOrderScreen} />
            } /> 
            {/* Displays the PlaceOrderScreen component for confirming the order */}

            {/* Order Details Route (protected) */}
            <Route path='/order/:orderId' element={
              <PrivateComponent component={OrderScreen} />
            } /> 
            {/* Displays the OrderScreen component for a specific order based on its ID */}

            {/* Payment Result Route (protected) */}
            <Route path='/pay-result/:token' element={
              <PrivateComponent component={PayResultScreen} />
            } /> 
            {/* Displays the PayResultScreen component for showing the payment result based on the token */}

          </Routes>
        </Container>
      </main>
      <Footer /> {/* Includes the Footer component for branding or additional links */}
    </Router>
  );
}


export default App;
