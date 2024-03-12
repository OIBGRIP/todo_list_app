import './App.css';
import { CreatePost } from './components/CreatePost';
import { Header } from './components/Header';



function App() {
  

  return (
    <div className="App">
      <Header />
      <div>
        <CreatePost />
      </div>
    </div>
  );
}

export default App;
