import React from 'react';
import Header from '../../containers/Header'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../firebase'
import {Button,Modal, TextField,FormControl, Grid, List, ListItemText, ListItemAvatar, ListItem, Icon, Avatar, Typography} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';

class Board extends React.Component {
    state = {

        users: [],
        loading: false,




    }

    componentDidMount(){

        if(this.props.currentUser) {
            let loadUsers = [];
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')

            firebase.database().ref(collection).child('users').on("value", snap => {
                loadUsers = [];


                firebase.database().ref(collection).child('users').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    if(snap.val().kudos) {
                        Object.values(snap.val().kudos).map(item => {
                            console.log(item.liked.length)
                        });
                        loadUsers.push({
                            all: snap.val(),
                            count: Object.keys(snap.val().kudos).length,
                            likes: Object.values(snap.val().kudos).map(item => {
                                return item.liked.length
                            })
                        });

                        this.setState({users: loadUsers}, () => this.sortArray(this.state.users))
                    }
                    // sorting

                });
            })
        }
    }
    sortArray = users => {

        users.map((user, i) => {
            users.sort(function(a, b){return b.likes[0] -  a.likes[0];});
            users.sort(function(a, b){return b.count -  a.count;});

        })
        this.setState({users: users})
        console.log(users);

    }
    displayUsers = users => {
        let num = ''

       return users.map((user, i) => (

                <Grid key={i} item sm={6} xs={12}>
                    <ListItem alignItems="flex-start" className="kudos kudos_result_wrapper">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={user.all.avatar}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.all.firstName + ' ' + user.all.lastName}
                        />
                        <ListItemText
                            className="kudos_result"
                            primary={
                                <React.Fragment>
                                    <StarBorderRounded/>{user.count && <span>({user.count})</span>}
                                    <Icon>favorite</Icon> {user.all.kudos && Object.values(user.all.kudos).map((k, x) => {
                                     num = k.liked.length
                                })}
                                   <span> {(num) && num}</span>


                                </React.Fragment>
                            }
                        />


                    </ListItem>
                </Grid>
            )
        )

    }
    render() {
        const {users, loading} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">

                    <h2>Kudos Board</h2>
                    { users && this.displayUsers(users)}
                </div>

                
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)( Board);