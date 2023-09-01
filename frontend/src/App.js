import "./App.css";
import { Route } from "react-router-dom";
import Home from "./pages/home";
import Chats from "./pages/chats";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ChatState } from "./context/chatProvider";
import { useEffect } from "react";
import ResetPassword from "./pages/resetPassword";
import NewPassword from "./pages/newPassword";


function App() {
  const { user, setUser } = ChatState();
  const history = useHistory();
  useEffect(() => {
    // Since during login and sign up we are storing the user's details in local storage under name
    // "userinfo" so every time we login we retrieve the details set the current logged user variable
    // to this info

    // JSON.parse() => json string to json object
    // JSON.stringify => json object to json string
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // we parse it since it is stored in stringify format
    setUser(userInfo);
    // if userInfo contains nothing it means user isn't logged in so redirect to home page "/"
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <div className="App">
      <Route path="/" component={Home} exact></Route>
      <Route path="/chats" component={Chats} exact></Route>
      <Route path="/reset-password" component={ResetPassword} exact></Route>
      <Route path="/new-password" component={NewPassword} exact></Route>
    </div>
  );
}

export default App;
