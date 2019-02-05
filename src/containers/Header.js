import React from 'react';
import PropTypes from 'prop-types';
import {Typography, IconButton, Toolbar, AppBar} from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import RightMenu from "./RightMenu";
import LeftMenu from './LeftMenu'
import {connect} from 'react-redux'
import firebase from "../firebase";


const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

class Header extends React.Component {
    state = {
        left: false,
        userData: this.props.currentUser,
        company: ''
    };
    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };
    componentWillMount(){
        if(this.props.currentUser) {
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')
            firebase.database().ref(collection).child('users').child(this.state.userData.uid).on("value", snap => {
                //   this.setState({company: snap.val().companyName})

            });
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={this.toggleDrawer('left', true)} className={classes.menuButton} color="inherit" aria-label="Open drawer">
                            <MenuIcon  />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            {this.props.currentUser && this.props.currentUser.displayName}
                        </Typography>
                        <LeftMenu
                            left={this.state.left}
                            toggleDrawerFalse={this.toggleDrawer('left', false)}
                            toggleDrawerTrue={this.toggleDrawer('left', true)}/>
                        <div className={classes.grow} />
                        <RightMenu/>
                    </Toolbar>
                </AppBar>

            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)(withStyles(styles)(Header));
