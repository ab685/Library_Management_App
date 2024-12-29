import "./App.css";
import AppProvider from "./Context/AppContext";
import BorrowBookContainer from "./Component/BorrowBookContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppProvider>
        <ToastContainer></ToastContainer>
        <BorrowBookContainer></BorrowBookContainer>
      </AppProvider>
    </>
  );
}

export default App;
