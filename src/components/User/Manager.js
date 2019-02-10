import React from 'react';
import Header from '../../containers/Header'
import firebase from '../../firebase'
import {Button, Grid, Icon,Snackbar, List, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import $ from 'jquery'
import ManagerEdit from './ManagerEdit';
import AddUser from './AddUser';




class Manager extends React.Component {
    state = {
        groups: [],
        users: [],
        open: false,
        alert: false,
        delete: false,
        openNote: false,
        groupId: '',
        id: '',
        errors: []


    }


    componentDidMount(){

        if(this.props.currentUser) {
            let loadUsers = [];
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')

           /* firebase.database().ref(collection).child('users').on('child_added', snap => {
                // whenever child added (message or anything else) execute these

                loadUsers.push(snap.val());

                this.setState({users: loadUsers})


            })

            firebase.database().ref(collection).child('users').on('child_removed', snap => {
                // whenever child added (message or anything else) execute these

                loadUsers.pop(snap.val());

                this.setState({users: loadUsers})


            })*/

            firebase.database().ref(collection).child('users').on("value", snap => {
                loadUsers = []
                firebase.database().ref(collection).child('users').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    loadUsers.push(snap.val());
                    this.setState({users: loadUsers})

                });
            });
        }
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
    deleteUser= (id, gId) => {
        this.handleClickOpen()
        this.setState({id: id, groupId: gId})

    }

    handleAgree = () => {
        this.setState({ alert: false, delete: true });
        let id = this.state.id
        let groupId = this.state.groupId
        let errors = []
        if(id) {
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')
            firebase.database().ref(collection).child('users')
                .child(id)
                .remove(err => {

                    if (err !== null) {
                        console.error(err);
                        this.setState({
                            loading: false,
                            openNote:true,
                            errors:   errors.concat({message:  err.message })
                        });
                    } else {
                        console.log('no error');
                        this.deleteWPaccount(id)
                        this.setState({
                            loading: false,
                            openNote:true,
                            errors:   errors.concat({message:  'Account has been deleted.' })
                        })
                    }
                }).then(()=> {
                    firebase.database().ref(collection)
                        .child('groups')
                        .child(groupId)
                        .child('users')
                        .child(id)
                        .remove(err => {

                        });
                    //remove from head
                    firebase.database().ref(collection).child('groups').child(groupId).child('head')
                        .remove(err => {

                        });
            })


        }else{
            console.log('NO ID');
        }
    }


    displayUsers = users => (
        users.map((user, i)=> (
                <List key={i} >
                    {user.firstName}<Button  onClick={()=>this.deleteUser(user.id, user.group[0])}><Icon >cancel_icon</Icon></Button>
                    <Button  onClick={()=>this.updateUser(user.id)}><Icon >edit_icon</Icon></Button>
                </List>
            )
        )

    )
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

    updateUser = userId => {

        this.setState({id: userId}, ()=> this.handleOpen())
    }


    handleNoteClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openNote: false });
    };
    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);





    deleteWPaccount = id => {

        // delete from wp
        let menuURL =  "http://react.nourdigital.com/wp-json/wp/v2/users/"+id+"?reassign=1&force=true";
        fetch(menuURL, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9yZWFjdC5ub3VyZGlnaXRhbC5jb20iLCJpYXQiOjE1NDkyMTE0MzMsIm5iZiI6MTU0OTIxMTQzMywiZXhwIjoxNTQ5ODE2MjMzLCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.6NlTjVNliJ_pBzwLFyy2pknEJ8AY5sxf3ziTc_yR7sw",

            },

        }).then(res => res.json())
            .then(res => {
                console.log('user deleted');
            })
    }


    render() {
        const { users, errors, openNote} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            { users && this.displayUsers(users)}
                        </Grid>
                        <Grid item xs={6}>
                            <AddUser groups={this.props.allGroups}/>
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
                             userId={this.state.id}
                             collection={this.props.currentUser.displayName }/>
                }
                {errors.length > 0 && (
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        className="snackbar"
                        open={openNote}
                        autoHideDuration={3000}
                        onClose={this.handleNoteClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={this.displayErrors(errors)}

                    />



                )}

            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    allGroups: state.groups.allGroups
});


export default connect(mapStateToProps)( Manager );