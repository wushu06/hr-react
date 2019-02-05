import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';

class RightMenu extends React.Component {
    render() {
        return (
                <div>
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
export default RightMenu;