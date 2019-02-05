import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Button, Grid, ListItem, ListItemText, List} from '@material-ui/core'
import './App.css';
import Header from './containers/Header';
import ContactForm from './containers/ContactForm'
import Mailjet from 'mailjet-sendemail'
import axios from "axios";
import $ from 'jquery'
import {clearUser, getGroups, setUser} from "./action";
import {connect} from "react-redux";
import firebase from "./firebase";
import moment from "moment/moment";


let Token = ''
class App extends Component {
    state = {
        loading: true,
        companyName: this.props.currentUser.displayName,
        events: [],
        ranges: []
    }
    componentDidMount(){
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        let ranges = [];
        let events = [];

        firebase.database().ref(collection).child('users').on('child_added', snap => {
            if (snap.val().holiday && 'range' in snap.val().holiday) {
                ranges.push({date: snap.val().holiday.range, name: snap.val().firstName});
                this.setState({ranges: ranges})
            }
            if (snap.val().events) {


                events.push(snap.val().events);
                this.setState({events})
            }

        })


    }

    displayEvents = () => {

        return this.state.events.length > 0 && this.state.events.map((ev, i) => {
            return ev.length > 0 && ev.map(single => {
                return  single.eventTitle &&
                  (
                    <ListItem alignItems="flex-start" className="event_wrapper">
                    <ListItemText
                        className="event_content"
                        primary= { <React.Fragment>{single.eventTitle}</React.Fragment>} />
                    </ListItem>
                )

            })


        })
    }


  render() {
        const {events, ranges} = this.state
    return (
      <div className="App">
        <Header/>
        <div className="block_container">
            <Grid container spacing={24}>
                <Grid item sm={4} xs={6}>
                    <h4>Top users</h4>
                </Grid>
                <Grid item sm={4} xs={6}>
                    <h4>Users on holiday this week</h4>
                </Grid>
                <Grid item sm={4} xs={6}>
                    <h4>Events</h4>
                    {events  && this.displayEvents()}

                </Grid>
            </Grid>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps, {setUser} )(App);
