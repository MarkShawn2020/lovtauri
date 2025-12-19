import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/theme-provider";
import Nav from "./components/nav";
import Home from "./pages/home";
import About from "./pages/about";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
