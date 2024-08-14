import './App.css'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Navbar from './component/Navbar'
import StudentLogin from './component/StudentLogin'
import TeacherLogin from './component/TeacherLogin'
import PrincipalLogin from './component/PrincipalLogin'
import Home from './component/Home'
import ClassRoom from './component/ClassRoom'
import AllTeachers from './component/AllTeachers'
import AllStudents from './component/AllStudents'

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/classroom/:id" element={<ClassRoom/>}/>
          <Route path="/student/login" element={<StudentLogin/>}/>
          <Route path="/teacher/login" element={<TeacherLogin/>}/>
          <Route path="/principal/login" element={<PrincipalLogin/>}/>
          <Route path="/principal/allteachers" element={<AllTeachers/>}/>
          <Route path="/principal/allstudents" element={<AllStudents/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
