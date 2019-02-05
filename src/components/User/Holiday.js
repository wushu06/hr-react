import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {Button} from '@material-ui/core';
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
        range: []
    };

    componentDidMount() {

        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');

        firebase.database().ref(collection).child('users').on('child_added', snap => {

            if(snap.val().id === Number(this.props.currentUser.uid)) {
                console.log('yes');
                snap.val().holiday && this.setState({
                    holiday: snap.val().holiday.remainingDays,
                    range: snap.val().holiday.range ? snap.val().holiday.range : []
                } )
            }
        })
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
            console.log(remainDays);
            this.sendRequest(remainDays,moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'))
        }else{
            console.log('not valid');
        }

    }
    datediff = (first, second) =>{
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }

    sendRequest =(remainDays, start, end) => {
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        let range = this.state.range
        range.push([start, end])
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

            })
            .catch(err=> {
                console.log(err);
            })
    }

    render() {
        const { classes } = this.props;
        const { selectedDate, selectedDateEnd , start, end, holiday } = this.state;

        return (
            <div>
                <Header/>
                <div className="block_container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <span>Number of holidays: {holiday ? holiday : '--'}</span>
                <h1>Start of holiday</h1>
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
                    <Button disabled={!(start && end ) || !holiday} onClick={()=>this.handleRequest(start, end)}>{holiday ? 'Request Holiday' : 'No holidays left'}</Button>
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