import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Movie from './component/movie';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationName: '',
      locationData: {},
      locationImgUrl: '',
      locationWeather: '',
      movieInfo: [],
    }
  }

  handelLocationNameChange = (e) => { this.setState({ locationName: e.target.value }) }
  handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&q=${this.state.locationName}&format=json`;
      const response = await axios.get(url);//locationIQ      
      const wethearUrl = await `https://city-explorer-api-tamara.herokuapp.com/get-wethear?city_name=${this.state.locationName}`;
      const response2 = await axios.get(wethearUrl);//weather response      

      await this.setState({
        locationData: response.data[0],
        locationWeather: response2.data[0],
      });
      const centerKeyvalue = this.state.locationData.lat + "," + this.state.locationData.lon;
      this.getMovieData();
      this.setState({
        locationImgUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&center=${centerKeyvalue}&zoom="5"&format=jpg`,
      });
      console.log('imgurl', centerKeyvalue);
    } catch (error) {
      this.setState({
        error: true,
      });
    }
    
  }

  getMovieData = async () => {
    const url = `https://city-explorer-api-tamara.herokuapp.com/get-movies?city_name=${this.state.locationName}`;
    console.log(url);
    axios
      .get(url)
      .then(result => {
        this.setState({
          movieInfo: result.data,
        })
      })
      .catch(err => console.log(err))
  }
  render() {
    return (
      <body className='body'>
        <header className='header' >City Explorer</header>
        <div>
          <Form className='form' onSubmit={this.handelSubmit}>
            <Form.Group className="mb-3" controlId="place" >
              <Form.Control type="text" onChange={this.handelLocationNameChange} placeholder="enter city name" />
              <Button variant="primary" type="Explorer">
                Explorer
              </Button>
            </Form.Group>
          </Form>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" src={this.state.locationImgUrl} />
            <Card.Body>
              <Card.Title>{this.state.locationData.display_name}</Card.Title>
              <Card.Text>
                <p>lat: {this.state.locationData.lat}</p>
                <p>lon: {this.state.locationData.lon}</p>
              </Card.Text>
              <Card.Text>
                <p>Amman Weather: {this.state.locationWeather.date}</p>
                <p>location name : {this.state.locationWeather.description}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <Row className="justify-content-between" className='row'>
          {this.state.movieInfo.map(item => {
            return (
              <Movie
                title={item.title}
                overview={item.overview}
                average_votes={item.average_votes}
                total_votes={item.total_votes}
                image_url={item.image_url}
                popularity={item.popularity}
                released_on={item.released_on}
              />
            )
          })}
        </Row>
      </body>
    )
  }
}

export default App