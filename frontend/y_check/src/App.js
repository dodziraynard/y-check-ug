import './App.css';
import Nav from './components/nav/Nav';
import Sidebar from './components/sidebar/Sidebar';
import MainPage from './pages/main/MainPage';
import AuthRoute from './AuthRoute';
function App() {
  const isAppRoute = 
    window.location.pathname.startsWith('/dashboard') ||
    window.location.pathname.startsWith('/patients') ||
    window.location.pathname.startsWith('/patient-view');
  return (
    <>
      {isAppRoute ? (
      <div>
      <Nav />
        <div className='main'>
          <Sidebar />
          <MainPage />
        </div>
      </div>
      ) : (
        <>
        <AuthRoute/>
        </>
      )}
    </>
  ) ;
}

export default App;
