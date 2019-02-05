import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {TextField,Grid,Button, FormControl,Icon,  Dialog,DialogActions, DialogTitle} from '@material-ui/core'
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {getGroups} from '../../action'
import Header from '../../containers/Header'
import ManagerEdit from './ManagerEdit'


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});

class Manager extends React.Component {
    state = {
        group: '',
        loading: false,
        groupName: '',
        groupDescription: '',
        groupsRef: firebase.database().ref('groups'),
        groups: [],
        checked:{},
        open: false,
        alert: false,
        companyName: this.props.currentUser.displayName
    };

    componentDidMount() {
        let loadgroups = [],
            nloadgroups = [],
            collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        /*firebase.database().ref(collection).child('groups').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            loadgroups.push(snap.val());
            this.setState({groups: loadgroups}, ()=> this.props.getGroups(loadgroups) )

        });
        firebase.database().ref(collection).child('groups').on('child_removed', snap => {
            // whenever child added (message or anything else) execute these
            loadgroups.pop(snap.val());
            this.setState({groups: loadgroups}, ()=> this.props.getGroups(loadgroups) )

        });*/
        firebase.database().ref(collection).child('groups').on("value", snap => {
            loadgroups = []
            firebase.database().ref(collection).child('groups').on('child_added', snap => {
                // whenever child added (message or anything else) execute these
                loadgroups.push(snap.val());
                this.setState({groups: loadgroups}, ()=> this.props.getGroups(loadgroups) )

            });
        });


    }

    /*
     * dialog
    */
    handleClickOpen = () => {
        this.setState({ alert: true });
    };

    handleAlertClose = () => {
        this.setState({ alert: false });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleAgree = () => {
        this.setState({ alert: false, delete: true });
        let id = this.state.id
        if(id) {
            let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
            this.setState({loading: true})
            firebase.database().ref(collection).child('groups').child(id)
                .remove(err => {
                    this.setState({loading: false})
                    if (err !== null) {
                        console.error(err);
                    }else{
                        console.log('no error');
                    }
                });
        }else{
            console.log('NO ID');
        }
    }
    /*
          * modal
       */
    handleOpen = () => {
        console.log('open');
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.AddGroup()
    }

    AddGroup = () => {
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        const {groupName, groupDescription}= this.state;
        const key =  firebase.database().ref(collection).push().key
        const newUser = {
            id: key,
            groupName: groupName,
            groupDescription: groupDescription,

        }
        firebase.database().ref(collection).child('groups')
            .child(key)
            .update(newUser)
            .then(()=> {
                this.setState({groupName: '', groupDescription: ''})
                // this.props.getGroups(this.state.groups)
                console.log('group created');

            })
            .catch(err=> {
                console.log(err);
            })
    }

    displaygroups = groups => (
        groups.map((group, i)=> (
                <div key={i} >
                    {group.groupName}<Button onClick={()=>this.deleteGroup(group.id)}><Icon >cancel_icon</Icon></Button>
                    <Button  onClick={()=>this.updateGroup(group.id)}><Icon >edit_icon</Icon></Button>

                </div>
            )
        )

    )
    updateGroup = (groupId) =>  {
        this.setState({id: groupId}, ()=> this.handleOpen())

    }

    deleteGroup = id => {
        this.handleClickOpen()
        this.setState({id: id})


    }


    render() {
        const { classes } = this.props;
        const {loading, groups} = this.state

        return (
            <div>
                <Header/>
                <div className="block_container">
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            {groups && this.displaygroups(groups)}

                        </Grid>
                        <Grid item xs={6}>

                            <h1>Add group</h1>
                            <form className={classes.container} noValidate autoComplete="off">
                                <FormControl margin="normal" required fullWidth>
                                    <TextField
                                        required
                                        label="Group Name"
                                        type="text"
                                        value={this.state.groupName}
                                        className={classes.textField}
                                        margin="normal"
                                        onChange={this.handleChange('groupName')}
                                    />
                                    <TextField
                                        label="Group Description"
                                        type="text"
                                        value={this.state.groupDescription}
                                        className={classes.textField}
                                        margin="normal"
                                        onChange={this.handleChange('groupDescription')}
                                    />
                                </FormControl>

                                {/*this.displayUsers(users)*/}

                                <FormControl margin="normal" required fullWidth>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleSubmit}
                                        disabled={loading}

                                    >
                                        Add Group
                                    </Button>
                                </FormControl>

                            </form>
                        </Grid>
                    </Grid>

                </div>
                <Dialog
                    open={this.state.alert}
                    onClose={this.handleAlertClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this user?"}</DialogTitle>

                    <DialogActions>
                        <Button onClick={this.handleAlertClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleAgree} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                {this.state.open &&
                <ManagerEdit modal={this.state.open}
                             closeModal={this.handleClose}
                             groupId={this.state.id}
                             collection={this.props.currentUser.displayName }/>
                }

            </div>

                );
    }
}

Manager.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps, {getGroups})(withStyles(styles)(Manager));