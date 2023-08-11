import './App.css';
import Home from './components/home/Home';
import MainPage from './pages/main/MainPage';
import PatientPage from './pages/PatientPage/PatientPage';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/dashboard'element={<MainPage/>}/>
      <Route path='/patients' element={<PatientPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
