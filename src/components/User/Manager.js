import React from 'react';
import Header from '../../containers/Header'
import firebase from '../../firebase'
import {Button, Grid, Icon, List, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
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
        id: ''


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
    deleteUser= id => {
        this.handleClickOpen()
        this.setState({id: id})

    }

    handleAgree = () => {
        this.setState({ alert: false, delete: true });
        let id = this.state.id
        if(id) {
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')
            firebase.database().ref(collection).child('users')
                .child(id)
                .remove(err => {
                    this.setState({loading: false})
                    if (err !== null) {
                        console.error(err);
                    } else {
                        console.log('no error');
                        this.deleteFirebaseAccount(id)
                    }
                });
        }else{
            console.log('NO ID');
        }
    }


    displayUsers = users => (
        users.map((user, i)=> (
                <List key={i} >
                    {user.firstName}<Button  onClick={()=>this.deleteUser(user.id)}><Icon >cancel_icon</Icon></Button>
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







    deleteFirebaseAccount = id => {

        fetch('http://localhost/mail/delete.php', {
            method: "POST",
            body: "delete="+id,
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
        const { users} = this.state
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

            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    allGroups: state.groups.allGroups
});


export default connect(mapStateToProps)( Manager );