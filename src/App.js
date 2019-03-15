import React, { Component } from "react";

import Test from "react";

//Material-UI fields
import Grid from "@material-ui/core/Grid";
import Textfield from "@material-ui/core/TextField";
import { Checkbox } from "@material-ui/core";

//Library used to 2012-03-06T11:27:16Z ---> 06/03/2019
import Moment from "moment";

import "./App.css";

//Personal key obtained for data access
var LICENSE_KEY = "199d0739-184a-4942-af03-542438e7c1b8";
var QUERY_STRING = "https://content.guardianapis.com/search?"; //""

var API_KEY = "api-key=";

class App extends Component {
  resetState() {
    this.state = {
      items: [],
      favorites: [],
      isLoaded: false,
      searchString: ""
    };
  }
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    var QS = QUERY_STRING + "" + API_KEY + LICENSE_KEY;

    fetch(QS)
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json
        });
      });
  }

  onSearchInputTextChange = event => {
    if (event.target.value) {
      this.setState({ searchString: event.target.value });
    } else {
      this.setState({ searchString: "" });
    }

    var QS =
      QUERY_STRING + "q=" + event.target.value + "&" + API_KEY + LICENSE_KEY;

    console.log(QS);

    // Update state on every key press
    fetch(QS)
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json
        });
      });
  };

  //Indirect access to state preserving variable list of bookmarks
  AddItem(item) {
    //Check for the duplication
    this.state.favorites.forEach(element => {
      if (element.webTitle == item.webTitle) return;
      else console.log("Element #" + element.webTitle);
    });

    this.setState({
      favorites: this.state.favorites.concat(item)
    });
  }

  removeItem(item) {
    this.setState({
      favorites: this.state.favorites.filter(function(it) {
        return it.webTitle !== item.webTitle;
      })
    });
  }

  //Onclick checkbox handler for bookmark add / remove
  onClickAddFavorite = item => event => {
    console.log(item.webTitle);

    if (event.target.checked == true) {
      console.log("checkbox checked.. additem in favorites");

      this.AddItem(item);
    } else {
      console.log("checkbox Unchecked.. remove item in favorites");
      this.removeItem(item);
    }
  };

  render() {
    //copy to local variables
    var { items, favorites, isLoaded, searchString } = this.state;
    if (!isLoaded) {
      return <div>Loading... G U A R D I A N___A P I___D A T A...</div>;
    } else {
      return (
        <div className="App" style={{ textAlign: "centre" }}>
          <Textfield
            sytle={{ padding: 24 }}
            id="searchInput"
            placeholder="Search for keyword"
            margin="normal"
            justify="centre"
            onChange={this.onSearchInputTextChange}
          />
          <Grid
            container
            spacing={24}
            justify="flex-start"
            style={{ padding: 2 }}
          >
            {favorites.map(item => (
              <Grid item xs={12}>
                <b>BookMarked</b> <b>WebTitle:</b> {item.webTitle} <br />
              </Grid>
            ))}
            ;
          </Grid>

          <Grid
            container
            spacing={24}
            justify="flex-start"
            style={{ padding: 2 }}
          >
            {items.response.results.map(item => (
              <Grid item xs={12}>
                <b>WebTitle:</b> {item.webTitle} <br />
                <b>WebUrl:</b> {item.webUrl} <br />
                <b>WebPublication Date:</b>
                <mark>
                  {Moment(item.webPublicationDate).format("DD/MM/YYYY")}
                </mark>
                <Checkbox
                  sytle={{ padding: 24 }}
                  id="favorite"
                  placeholder="Add to favorites"
                  margin="normal"
                  onChange={this.onClickAddFavorite(item)}
                />
              </Grid>
            ))}
            ;
          </Grid>
        </div>
      );
    }
  }
}

export default App;
