import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary">Home</h1>
      <p className="lead">Bem-vindo ao projeto React + Vite + Bootstrap</p>
      <button className="btn btn-success">Clique aqui</button>
    </div>
  );
}

export default Home;