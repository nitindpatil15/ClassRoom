import './App.css'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Navbar from './component/Navbar'
import StudentLogin from './component/StudentLogin'
import TeacherLogin from './component/TeacherLogin'
import PrincipalLogin from './component/PrincipalLogin'

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/student/login" element={<StudentLogin/>}/>
          <Route path="/teacher/login" element={<TeacherLogin/>}/>
          <Route path="/principal/login" element={<PrincipalLogin/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
