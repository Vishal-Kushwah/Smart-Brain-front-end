import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 150
      }
    }
  }
}

const initialState= {
      input:'',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn:false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: '',
      }
    }

class App extends Component {
  constructor(){
    super();
    this.state=initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
      }
    })
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col *width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onRouteChange=(route) => {
    if(route ==='signout'){
      this.setState(initialState)
    }
    else if(route ==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route:route});
  }

  displayFaceBox=(box)=> {
    this.setState({box:box});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
    // console.log(this.state.input)
  }

  onButtonSubmit= () =>{
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imageurl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          })
          .catch(console.log); 
        } 
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} 
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route ==='home'
          ?<div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
            <ImageLinkForm 

              onButtonSubmit={this.onButtonSubmit} 
              onInputChange={this.onInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          : (
            route==='signin'||route==='signout'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        } 
      </div>
    );
  }
}

export default App;