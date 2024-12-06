import React from 'react';
import {ServiceLogForm} from "./components/ServiceLogForm";
import ServiceLogsTable from "./components/ServiceLogsTable";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<ServiceLogForm/>}/>
                <Route path='/tablelogs' element={<ServiceLogsTable/>}/>
            </Routes>
        </BrowserRouter>
)
    ;
}

export default App;
