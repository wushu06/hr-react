import React from 'react';
import Header from '../../containers/Header'
import firebase from '../../firebase'
import {Avatar,Button, Modal, ListItemText, Typography,List, ListItem, ListItemAvatar} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
class Profile extends React.Component {
    state = {
        user: firebase.database().ref('users'),
        profile: '',
        open: false,
        currentUser: this.props.currentUser,
        companyName: this.props.currentUser.displayName

    }

    componentDidMount(){


        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');

        firebase.database().ref(collection).child('users').child(this.state.currentUser.uid).on("value", snap => {
           this.setState({profile: snap.val()})
        });
    }
    updateProfile = () => {
        this.setState({ open: true });

    }
    deleteProfile = () => {

    }

    handleClose = () => {
        this.setState({ open: false });
    }


    render() {
        const {profile, open} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <List>
                    <h1>profile</h1>
                    {profile && (
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={ profile.photoURL} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={profile.firstName +' '+ profile.lastName}
                                secondary={
                                    <React.Fragment>
                                        <Typography component="span" color="textPrimary">
                                           Email: {profile.email}
                                        </Typography>
                                        <Typography component="span" color="textPrimary">
                                            Phone Number: {profile.phone ? profile.phone : '(-- -- --)'}
                                        </Typography>
                                        <Typography component="span" color="textPrimary">
                                            Group: {profile.group}
                                        </Typography>
                                        <Typography component="span" color="textPrimary">
                                            Holiday: {profile.holiday.remainingDays}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>

                    )}
                    </List>
                    <Button><Link to="/update">Update Profile</Link></Button>
                    {/*<Button onClick={this.deleteProfile}>Delete Account</Button>*/}

                </div>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)( Profile );