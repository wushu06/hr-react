import React from 'react';
import Header from '../../containers/Header';
import $ from 'jquery';
import 'fullcalendar';
import 'moment'
import '../../assets/fullcalendar.min.css'
import firebase from "../../firebase";
import {connect} from "react-redux";
import moment from 'moment';
import {Dialog, DialogTitle,DialogContent, DialogActions, Button, FormControl, TextField} from '@material-ui/core'

class Calendar extends React.Component {
    state = {
        ranges: [],
        companyName: this.props.currentUser.displayName,
        alert: false,
        eventTitle: '',
        eventComment: '',
        events: [],
        eventDate: '',
        exist: false,
        index: '',
        start: ''

    }
    componentDidMount() {
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        let ranges = [];
       let events = []

        firebase.database().ref(collection).child('users').on('child_added', snap => {
            if (snap.val().holiday && 'range' in snap.val().holiday) {
                ranges.push({date: snap.val().holiday.range, name: snap.val().firstName});
                this.setState({ranges: ranges}, () => this.showCalendar())
            }
            if (snap.val().events) {


                events.push(snap.val().events);
                this.setState({events}, () => this.showCalendar())
            }else{
               this.showCalendar()
            }

        })






    }

    showCalendar = () => {
      $('#calendar').fullCalendar('destroy');
        let _self = this
        let holidays = [];
        let eventData = []
        this.state.ranges.length > 0 && this.state.ranges.map((date, i) => {
            date.date.map(item => {
                 holidays = [...holidays]
                return  holidays.push({title: date.name, start: item[0], end: item[1]})

            })
        })
        this.state.events.length > 0 && this.state.events.map((ev, i) => {
            ev.length > 0 && ev.map(single => {

                return  eventData.push({title: single.eventTitle, start:single.eventDate, end: moment(single.eventDate).format('YYYY-MM-DD') , backgroundColor: '#850986' })

            })


        })


        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: '2019-01-12',
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectHelper: true,
            select: function(start, end) {


                _self.handleClickOpen()
                _self.setState({eventDate: start, exist: false, eventTitle: '', index: '', start: ''})




            },
            eventClick: function(event,  jsEvent, view){
                _self.handleClickOpen()

                let index = _self.state.events[0].findIndex(x => x.eventTitle ===event.title);
                _self.setState({eventTitle: event.title, index: index, start: event.start, exist: true})
                //console.log(index);
               // console.log(view);

            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: holidays

        });
        if (eventData.length > 0) {

            eventData.map(e => {

                $('#calendar').fullCalendar('renderEvent', e, true); // stick? = true

            })
        }
        $('#calendar').fullCalendar('unselect');

    }
    handleClickOpen = () => {
        this.setState({ alert: true });
    };

    handleAlertClose = () => {
        this.setState({ alert: false });
    }
    handleAgree = () => {
        this.setState({alert: false});
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');



       let newEvent =  {
                        eventTitle: this.state.eventTitle,
                        eventComment: this.state.eventComment,
                        eventDate : this.state.eventDate
                     };
        let events =  this.state.events;
        if(events.length > 0) {
            let arrToConvert =  events
            let newArr = [];


            for(let i = 0; i < arrToConvert.length; i++)
            {
                newArr = newArr.concat(arrToConvert[i]);
            }
           events =  newArr
            events.push(newEvent)
        }else {
            events = [newEvent]
        }



        firebase.database().ref(collection).child('users')
            .child(this.props.currentUser.uid)
            .update({
                events: events
            })
            .then(()=> {
                this.setState({
                    events: [events],
                    eventTitle: '',
                    eventComment: ''}, () => this.showCalendar())

            })
            .catch(err=> {
                console.log(err);
            })
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleAgreeUpdate = () => {
        this.setState({alert: false});
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');


        let eventData = []
        this.state.events.length > 0 && this.state.events.map((ev, i) => {

            ev.length > 0 && ev.map((single, x) => {
                if(x === this.state.index) {
                    return eventData.push({
                        eventTitle: this.state.eventTitle,
                        eventComment: '',
                        eventDate:  moment(single.eventDate).format('YYYY-MM-DD')

                    })
                }else{
                    return eventData.push(single)
                }
            })


        })



        firebase.database().ref(collection).child('users')
            .child(this.props.currentUser.uid)
            .update({
                events: eventData
            })
            .then(()=> {
                this.setState({
                    events: [eventData],
                    eventTitle: '',
                    eventComment: ''}, () => this.showCalendar())

            })
            .catch(err=> {
                console.log(err);
            })

    }
    handleDelete = () => {
        this.setState({alert: false});
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');


        let eventData = []
        this.state.events.length > 0 && this.state.events.map((ev, i) => {

            ev.length > 0 && ev.map((single, x) => {
                if(x !== this.state.index) {
                    return eventData.push(single)
                }
            })


        })


        firebase.database().ref(collection).child('users')
            .child(this.props.currentUser.uid)
            .update({
                events: eventData
            })
            .then(()=> {
                this.setState({
                    events: [eventData],
                    eventTitle: '',
                    eventComment: ''}, () => this.showCalendar())

            })
            .catch(err=> {
                console.log(err);
            })

    }
    render() {
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <div id='calendar'></div>

                </div>
                <Dialog
                    open={this.state.alert}
                    onClose={this.handleAlertClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.state.exist ? 'Update Event' : 'Add Event' }</DialogTitle>
                    <DialogContent>
                        <form  noValidate autoComplete="off">
                            <FormControl margin="normal" required fullWidth>
                                <TextField
                                    required
                                    label="Event Title"
                                    type="text"
                                    value={this.state.eventTitle}
                                    margin="normal"
                                    onChange={this.handleChange('eventTitle')}
                                />
                                <TextField
                                   
                                    label="Comment"
                                    type="text"
                                    value={this.state.eventComment}
                                    margin="normal"
                                    onChange={this.handleChange('eventComment')}
                                />
                            </FormControl>
                        </form>

                    </DialogContent>
                    <DialogActions>
                        {this.state.exist ?  <Button onClick={this.handleAgreeUpdate} color="primary">
                            Update
                        </Button> :
                            <Button onClick={this.handleAgree} color="primary">
                                Add
                            </Button>}
                        {this.state.exist ?
                            <Button onClick={this.handleDelete} color="primary" autoFocus>
                            Delete
                        </Button>
                            :
                            <Button onClick={this.handleAlertClose} color="primary" autoFocus>
                                Cancel
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
                
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)(Calendar);