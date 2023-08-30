import Nav from "../../components/nav/Nav"
import Sidebar from "../../components/sidebar/Sidebar"
import Main from "./Main"
function Dashboard() {
  return (
    <div>
      <Nav />
      <div className='main'>
          <Sidebar />
          <Main />
      </div>
    </div>
  )
}

export default Dashboard
