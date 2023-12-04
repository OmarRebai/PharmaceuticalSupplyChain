import "./App.css";
import Register from "./Register";
import LandingPage from "./LandingPage";
import OrderMedicine from "./OrderMedicine";
import Supply from "./Supply";
import Track from "./Track";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
function App() {
  return (
    <div
      className={`${window?.location?.pathname === "/" ? "App" : "blurred"}`}
    >
      <Navbar className="navbar" variant="dark">
        <Container>
          <Navbar.Brand href="/"> MedSuiviChain</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              href="/register"
              className={
                window?.location?.pathname === "/register" ? "active-link" : ""
              }
            >
              Enregistrer
            </Nav.Link>
            <Nav.Link
              href="/order-medicine"
              className={
                window?.location?.pathname === "/order-medicine"
                  ? "active-link"
                  : ""
              }
            >
              Commander des médicaments
            </Nav.Link>
            <Nav.Link
              href="/control-supply-chain"
              className={
                window?.location?.pathname === "/control-supply-chain"
                  ? "active-link"
                  : ""
              }
            >
              Contrôler la chaîne d'approvisionnement
            </Nav.Link>
            <Nav.Link
              href="/track-medicine"
              className={
                window?.location?.pathname === "/track-medicine"
                  ? "active-link"
                  : ""
              }
            >
              Suivre les médicaments
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/register" component={Register} />
          <Route path="/order-medicine" component={OrderMedicine} />
          <Route path="/control-supply-chain" component={Supply} />
          <Route path="/track-medicine" component={Track} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
