import './App.css';
import Home from './components/home/Home';
import MainPage from './pages/main/MainPage';
import PatientPage from './pages/PatientPage/PatientPage';
import PatientViewPage from './pages/PatientViewPage/PatientViewPage';
import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/registrationPage/Register';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/'element={<Register/>}/>
      <Route path='/login'element={<LoginPage/>}/>
      <Route path='/dashboard'element={<MainPage/>}/>
      <Route path='/patients' element={<PatientPage/>}/>
      <Route path='/patient-view' element={<PatientViewPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
