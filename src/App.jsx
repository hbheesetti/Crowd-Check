import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import React from "react";
import AboutMe from "./About";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/about" element={<AboutMe />} />
			</Routes>
		</Router>
	);
}

export default App;
