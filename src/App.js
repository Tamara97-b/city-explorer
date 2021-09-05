import React, { Component } from 'react'
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationName: '',
      locationData: {},
      locationImgUrl: ''
    }
  }

  handelLocationNameChange = (e) => { this.setState({ locationName: e.target.value }) }
  handelSubmit = async (e) => {
    e.preventDefault();
    const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&q=${this.state.locationName}&format=json`;
    const response = await axios.get(url);

    await this.setState({
      locationData: response.data[0]
    });

    const centerKeyvalue = this.state.locationData.lat + "," + this.state.locationData.lon;
    this.setState({
      locationImgUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&center=${centerKeyvalue}&zoom="5"&format=json`
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handelSubmit} style={{ width: '18rem', margin: '10%' }}>
          <Form.Control type="text" onChange={this.handelLocationNameChange} placeholder="enter city name" />
          <Button variant="primary" type="Explorer">
            Explorer
          </Button>
        </Form>

        <Card style={{ width: '18rem', margin: '10%' }}>
          <Card.Img variant="top" src="holder.js/100px180" src={this.state.locationImgUrl} style={{ width: '80%', height: '80%' }} />
          <Card.Body>
            <Card.Title>{this.state.locationData.display_name}</Card.Title>
            <Card.Text>
              <p>lat: {this.state.locationData.lat}</p>
              <p>lon: {this.state.locationData.lon}</p>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default App