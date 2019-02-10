import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import Info from '@material-ui/icons/Info';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import firebase from "../firebase";
import {connect} from "react-redux";

class RightMenu extends React.Component {
    state = {
        notifications: []
    }
    componentDidMount() {
        let loadUsers = [];
        let notifications = []
        let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')
        firebase.database().ref(collection).child('users').on('child_added', snap => {
            // whenever child added (message or anything else) execute these

            if (snap.val().id === Number(this.props.currentUser.uid)) {
                loadUsers.push(snap.val());
                snap.val().notifications &&  notifications.push(snap.val().notifications);
                snap.val().notifications && this.setState({users: loadUsers, notifications: notifications})
            }


        });
    }
    render() {
        return (
                <div>

                    {this.state.notifications.length > 0 &&
                    <IconButton
                        aria-haspopup="true"
                        color="inherit"
                        className="profile_btn"
                    >
                    <Tooltip title="notifications" aria-label="Notifications">
                        <Link to="/notifications">
                            <Badge badgeContent={Object.keys(this.state.notifications[0]).length} color="secondary">
                              <NotificationsIcon/>
                            </Badge>
                        </Link>
                    </Tooltip>


                    </IconButton>
                    }
                    <IconButton color="inherit"  className="profile_btn">
                        <Tooltip title="kudos" aria-label="Kudos">
                        <Badge badgeContent={4} color="secondary">

                            <Link to="/kudos" >
                              <StarBorderRounded />
                            </Link>
                        </Badge>
                        </Tooltip>
                    </IconButton>

                    <IconButton
                        aria-haspopup="true"
                        color="inherit"
                        className="profile_btn"
                    >
                        <Tooltip title="profile" aria-label="Profile">
                        <Link to="/profile" >
                            <AccountCircle />
                        </Link>
                        </Tooltip>

                    </IconButton>
                </div>


        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    allGroups: state.groups.allGroups
});


export default connect(mapStateToProps)(RightMenu);