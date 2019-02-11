import React from 'react';
import firebase from "../../firebase";
import {connect} from "react-redux";
import {Button, Grid, Icon,ListItemText,ListItem, List} from '@material-ui/core'
import Check from  '@material-ui/icons/CheckCircleSharp'
import Cancel from  '@material-ui/icons/Cancel'
import Header from '../../containers/Header'

class Notifications extends React.Component {
    state = {
       loading: false,
        notifications: []
    }

    componentDidMount(){

        if(this.props.currentUser) {
            let loadUsers = [];
            let notifications = []
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')


                loadUsers = []

                firebase.database().ref(collection).child('users').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these

                    if (snap.val().id === Number(this.props.currentUser.uid)) {
                        console.log('yes');
                        firebase.database().ref(collection).child('users').child(snap.val().id ).child('notifications').on('child_added', snap => {

                            notifications.push([snap.key, snap.val()]);
                            this.setState({notifications: notifications})
                        })
                        firebase.database().ref(collection).child('users').child(snap.val().id ).child('notifications').on('child_removed', snap => {

                            notifications.pop([snap.key, snap.val()]);
                            this.setState({notifications: notifications})
                        })

                    }


                });


        }
    }

    displayNotifications = notifications => {
        return notifications.map((notif, i)=>  {
            let key = notif[0];
            let userId =  Object.keys(notif[1])
            console.log(userId);
            return Object.values(notif[1]).map(res => (
                <ListItem key={i} alignItems="flex-start" className="event_wrapper">
                    <ListItemText
                        className="event_content"
                        primary={(<span className="notif_wrapper">
                               <span><strong>{res[1]}</strong></span>
                               <strong>({res[4]} days)</strong>
                               <span>from: {res[2]} to: {res[3]}</span>
                                      <span className="notif_wrapper_btn">
                                          <Button onClick={()=>this.approveHoliday(key,userId, res, res[5])}><Check/></Button>
                                      <Button onClick={()=>this.cancelHoliday(key,userId, res, res[5])}><Cancel/></Button></span>
                           </span>)}

                    />
                </ListItem>
            ))
        })
    }
    approveHoliday = (key,userId, res, index) => {
        let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')

        firebase.database().ref(collection)
            .child('users')
            .child(this.props.currentUser.uid )
            .child('notifications')
            .child(key)
            .child(Number(userId[0]))
            .remove(err=> {
                console.log(err);
            })
            .then(()=> {
                firebase.database().ref(collection).child('users')
                    .child(Number(userId[0]))
                    .child('holiday')
                    .child('range')
                    .child(index)
                    .child(3)
                    .set('approved')

        }).then(()=> {
            this.sendEmail(res,'Holiday approved', 'Your holiday request has been approved')
        })
    }
    cancelHoliday = (key,userId, res, index) => {
        let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')

        firebase.database().ref(collection)
            .child('users')
            .child(this.props.currentUser.uid )
            .child('notifications')
            .child(key)
            .child(Number(userId[0]))
            .remove(err=> {
                console.log(err);
            }).then(()=> {
            firebase.database().ref(collection).child('users')
                .child(Number(userId[0]))
                .child('holiday')
                .child('range')
                .child(index)
                .child(3)
                .set( 'declined')
        }).then(()=> {
            this.sendEmail(res,'Holiday Declined', 'Your holiday request has been declined')
        })
    }

    sendEmail = (res, subject, message) => {
        fetch('http://localhost/mail/mailswift/notifications.php', {
            method: "POST",
            body: "from="+subject+"&email="+res[0]+"&name="+res[1]+"&message="+message,
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

    render() {
        const { users, notifications} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <h2>Notifications: </h2>
                    <Grid container spacing={24}>

                        <Grid item xs={6}>

                            { notifications.length > 0 && this.displayNotifications(notifications)}
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                    </Grid>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    allGroups: state.groups.allGroups
});


export default connect(mapStateToProps)(Notifications);