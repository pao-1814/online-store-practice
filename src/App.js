import './App.css';
import { Header } from './components/Header/header.component';
import { Content } from './components/Content/content.component';
import { Footer } from './components/Footer/footer.component';
import { Loader } from './components/Loader/loader.component';
import { useEffect } from 'react';
import { setUser, selectUser, checkIfUserLogined, toggleLoginCheck } from './features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged, auth } from './firebase';
import { login, logout } from './features/user/userSlice';
import { initCart } from './features/cart/cartSlice';
import { selectRegisterPage } from './features/registerPage/registerPageSlice';

function App() {
  const dispatch = useDispatch();
  const userLogined = useSelector(selectUser).loggedIn;
  const user = useSelector(selectUser).user;
  const loading = useSelector(selectUser).loading;
  const checkedLogin = useSelector(selectUser).checkedLogin;
  const registeredUser = useSelector(selectRegisterPage).registeredUser;
  useEffect(() => {
    dispatch(login(registeredUser));
  }, [registeredUser])
  useEffect(() => {
    onAuthStateChanged(auth, async (userAuth) => {
        if(userAuth) {
          dispatch(checkIfUserLogined(userAuth.uid));
          dispatch(initCart(userAuth.uid));
        }
        else {
          dispatch(toggleLoginCheck(true));
          dispatch(logout());
        }
      })
  }, [])
  return (
    checkedLogin && 
      <>
      <Header/>
      <Content/>
      <Footer/>
      {loading ? <Loader/> : <></>}
      </>
  );
}

export default App;
