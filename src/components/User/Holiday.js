import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {Button,Icon, ListItem, ListItemText} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import Header from '../../containers/Header'
import {connect} from 'react-redux'
import firebase from "../../firebase";
import moment from 'moment';

const styles = {
    grid: {
        width: '60%',
    },
};

class Holiday extends React.Component {
    state = {
        // The first commit of Material-UI
        selectedDate: new Date(),
        selectedDateEnd : new Date(),
        start: '',
        end: '',
        companyName: this.props.currentUser.displayName,
        errors: [],
        holiday: '',
        range: [],
        head: '',
        headEmail: '',
        name: '',
        currentUserEmail : ''
    };

    componentDidMount() {

        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        firebase.database().ref(collection).child('users').on("value", snap => {


            firebase.database().ref(collection).child('users').on('child_added', snap => {

                if (snap.val().id === Number(this.props.currentUser.uid)) {

                    snap.val().holiday && this.setState({
                        holiday: snap.val().holiday.remainingDays,
                        name: snap.val().firstName,
                        groupId: snap.val().group[0] ? snap.val().group[0]  : '' ,
                        currentUserEmail: snap.val().email,
                        range: snap.val().holiday.range ? snap.val().holiday.range : []
                    })
                }
            })
        });
    }

    handleDateChange = date => {
        let start = this.formatDate(date)
        this.setState({ selectedDate: date, start: start });
    };
    handleDateChangeEnd = date => {
        let end = this.formatDate(date)
        this.setState({ selectedDateEnd: date, end: end });
    }


     formatDate = (date) => {


        let day = date.getDate();
        let month= date.getMonth();
        let year = date.getFullYear();

        return {
            day: day,
            month:  month ,
            year: year
        };
    }

    handleRequest = (start, end) => {
        if(start.year <= end.year && start.month <= end.month && start.day <= end.day)
        {

            let first = new Date(start.year, start.month-1, start.day);
            let second = new Date(end.year, end.month-1, end.day);
            let remainDays = this.state.holiday - this.datediff(first, second);

            this.sendRequest(remainDays,moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), this.datediff(first, second))
        }else{
            console.log('not valid');
        }

    }
    datediff = (first, second) =>{
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }

    sendRequest =(remainDays, start, end, num) => {
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        let range = this.state.range
        range.push([start, end, num, 'false'])

        this.state.groupId && firebase.database().ref(collection).child('groups').child(this.state.groupId).child('head').on('child_added', snap => {
            // whenever child added (message or anything else) execute these

            this.setState({head: snap.val().id, headEmail: snap.val().email}, () => {

              //  snap.val().id && this.sendEmail()


            })
        });


        firebase.database().ref(collection).child('users')
            .child(this.props.currentUser.uid)
            .update({
                holiday: {
                    range:range,
                    remainingDays: remainDays
                }
            })
            .then(()=> {
                this.setState({holiday: remainDays})
                console.log('holiday added');
                this.state.head && this.addNotifications(start, end, num)

            })
            .catch(err=> {
                console.log(err);
            })
    }

    displayHolidays = () => {
        return this.state.range.length > 0 && this.state.range.map((range, i) => {
            return (<ListItem key={i} alignItems="flex-start" className="event_wrapper">
                        <ListItemText
                            className="event_content"
                            primary={(<span>from: <strong>{range[0]}</strong> to: <strong>{range[1]}</strong>  ({range[2]} days)
                                      <Button onClick={()=>this.deleteHoliday(i, range[2])}><Icon >cancel_icon</Icon></Button></span>)}
                            secondary='awaiting approval'
                            />
                    </ListItem>)

        })
    }

    deleteHoliday = (i, num) => {
        console.log(i);
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        let range = this.state.range
        let remainDays = this.state.holiday
        remainDays = num+remainDays


        // removing item by index
        range = range.filter((item, x) => {
            return x !== i
        })



        firebase.database().ref(collection).child('users')
            .child(this.props.currentUser.uid)
            .update({
                holiday: {
                    range:range,
                    remainingDays: remainDays
                }
            }).then(()=> {

                this.sendEmail()
        })
    }
    sendEmail = () => {
        console.log(this.state.headEmail);
        console.log(this.state.head);

        fetch('http://localhost/mail/mailswift/holiday.php', {
            method: "POST",
            body: "from=Holiday request&email="+this.state.headEmail+"&name="+this.state.name,
            headers:
                {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
        }).then( response => {
            console.log(response);
        })
        .catch( error => {
            console.log(error);

        })

    }

    addNotifications = (start, end, num) => {
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        const key =  firebase.database().ref(collection).push().key

        firebase.database().ref(collection).child('users')
            .child(this.state.head)
            .child('notifications')
            .child(key)
            .update({[this.props.currentUser.uid] :[ this.state.currentUserEmail,this.state.name, start, end, num] } )
            .then(()=> {
                console.log('notifications added');
            })
            .catch(err=> {
                console.log(err);
            })
    }

    render() {
        const { classes } = this.props;
        const { selectedDate, selectedDateEnd , start, end, holiday, range } = this.state;

        return (
            <div>
                <Header/>
                <div className="block_container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <span>Number of holidays: {holiday ? holiday : '--'}</span>
                <h2>Start of holiday</h2>
                <Grid container className={classes.grid} justify="space-around">
                    <DatePicker
                        margin="normal"
                        label="Date picker"
                        value={selectedDate}
                        onChange={this.handleDateChange}
                    />
                </Grid>
                <h2>End of holiday</h2>
                <Grid container className={classes.grid} justify="space-around">
                    <DatePicker
                        margin="normal"
                        label="Date picker"
                        minDate={selectedDate}
                        value={selectedDateEnd}
                        onChange={this.handleDateChangeEnd}
                    />
                </Grid>

                 </MuiPickersUtilsProvider>
                    <Button variant="contained" color="primary" disabled={!(start && end ) || !holiday} onClick={()=>this.handleRequest(start, end)}>{holiday ? 'Request Holiday' : 'No holidays left'}</Button>

                    <Grid item sm={12} xs={12}>
                        <h4>Booked Holidays</h4>
                        {range  && this.displayHolidays()}
                    </Grid>
                </div>

            </div>
        );
    }
}

Holiday.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)(withStyles(styles)(Holiday));