import './App.css';
import Home from './components/home/Home';
import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/registrationPage/Register'
import LandingPage from './questionaire/landingPage/LandingPage';
import { BrowserRouter as Router, Routes,Route, Navigate} from 'react-router-dom';
import AddAdolescent from './questionaire/add_adolescent/AddAdolescent';
import Questionaire from './questionaire/home_questions/Questionaire';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import Dashboard from './pages/dashboard/Dashboard';
import PatientPage from './pages/PatientPage/PatientPage';
import AddSchool from './pages/addSchoolPage/basic/AddSchool';
import AddShS from './pages/addSchoolPage/shs/AddShS';
import AddCommunity from './pages/addSchoolPage/community/AddCommunity';
import Section_1_Search from './questionaire/search/Section_1_Search';
import SearchDetail from './questionaire/search/SearchDetail';
import Question1 from './components/practice_questions/Question1';
import Question2 from './components/practice_questions/Question2';
import WelcomePage from './pages/welcomePage/WelcomePage';
import AddQuestion from './pages/AddQuestion/AddQuestion';
import RecordPage from './pages/recordPage/RecordPage';
import AddOption from './pages/addOption/AddOption';
import PermissionPage from './pages/permissionPage/assign/PermissionPage';
import RevokePermissionPage from './pages/permissionPage/revoke/RevokePermissionPage';
import ProtectedRoute from './ProtectedRoute';
import Permissions from './permissions/Permissions';
function App() {


  return(
    <Router>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/add_adolescent'element={<AddAdolescent/>}/>
        <Route path='/landing'element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/questionaire' element={<Questionaire/>}/>
        <Route path='/patient_detail/:id/' element={<PatientDetailPage/>}/>
        <Route path='/dashboard' element={ 
          <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
            <Dashboard/> 
          </ProtectedRoute>
        }/>
        <Route path='/patients' element={<PatientPage/>}/>
        <Route path='/add_school' element={<AddSchool/>}/>
        <Route path='/add_shs'element={<AddShS/>}/>
        <Route path='/add_community'element={<AddCommunity/>}/>
        <Route path='/section_1_Search'element={<Section_1_Search/>}/>
        <Route path='/section-detail/:id/'element={<SearchDetail/>}/>
        <Route path='/practice-question-1'element={<Question1/>}/>
        <Route path='/practice-question-2'element={<Question2/>}/>
        <Route path='/welcome'element={<WelcomePage/>}/>
        <Route path='/add_question'element={<AddQuestion/>}/>
        <Route path='/add_option'element={<AddOption/>}/>
        <Route path='/permission-page'element={<PermissionPage/>}/>
        <Route path='/revoke-page'element={<RevokePermissionPage/>}/>
        <Route path='/adolescent-record/:id/'element={<RecordPage/>}/>
      </Routes>
  </Router>
  )
}

export default App;
