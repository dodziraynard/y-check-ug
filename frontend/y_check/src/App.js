import './App.css';
import Home from './components/home/Home';
import MainPage from './pages/main/MainPage';
import PatientPage from './pages/PatientPage/PatientPage';
import PatientViewPage from './pages/PatientViewPage/PatientViewPage';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/'element={<PatientViewPage/>}/>
      <Route path='/dashboard'element={<MainPage/>}/>
      <Route path='/patients' element={<PatientPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
