import React from 'react';
import Header from '../../containers/Header'
import firebase from '../../firebase'
import {Button, Grid,ListItem, Icon, List, ListItemText} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import $ from 'jquery'

class Admin extends React.Component {
    state = {
        groupsRef: firebase.database().ref('groups'),
        usersRef: firebase.database().ref('users'),
        groups: [],
        users: [],
        companyName: this.props.currentUser.displayName

    }

    componentDidMount(){
        let loadgroups = [],

            collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        firebase.database().ref(collection).child('groups').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            loadgroups.push(snap.val());
            this.setState({groups: loadgroups}, ()=> {

            } )
        });
        firebase.database().ref(collection).child('groups').on('child_removed', snap => {
            // whenever child added (message or anything else) execute these

            loadgroups.pop(snap.val());
            this.setState({groups: loadgroups} )


        });


        firebase.database().ref(collection).child('users').on("value", snap => {
            let loadUsers = []
            firebase.database().ref(collection).child('users').on('child_added', snap => {
                // whenever child added (message or anything else) execute these
                // dont execlue but hide
                // !snap.val().group && loadUsers.push(snap.val());
                loadUsers.push(snap.val());

                this.setState({users: loadUsers})


            })
        });
    }

    displaygroups = groups => {

        return  groups.map((group, i) => {
                /* if(group.groupHead) {

                 }*/
                return ( <List
                        key={i}
                        className="drag_box">
                        <strong> {group.groupName}</strong><Button onClick={() => this.deleteGroup(group.id)}><Icon>cancel_icon</Icon></Button>
                        <div
                            id={'head' + i}
                            onDrop={this.drop(group)}
                            onDragOver={this.allowDrop}
                            data-head="true"
                            className="head_drag">
                            <span>Name</span>
                        </div>

                        <div
                            id={'div' + i}
                            onDrop={this.drop(group)}
                            onDragOver={this.allowDrop}
                            data-head="false"
                            className="staff_drag">

                            <span>{group.users && this.displayGroupUsers(group.users, group.id)}</span>
                        </div>
                    </List>
                )
            }
        )

    }

    displayUsers = users => (
        users.map((user, i)=> (
                <List key={i}
                      id={'drag'+i}
                      data-name={user.firstName}
                      data-id={user.id}
                      draggable={user.group && user.group.length > 0 ? 'false' : 'true'}
                      onDragStart={this.drag}
                      className={user.group && user.group.length > 0 ? 'disable_user' : 'enable_user'}
                >

                    {user.firstName}


                </List>
            )
        )

    )
    deleteGroup = id => {
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
    }
    displayGroupUsers = (users, groupId) => (
        Object.values(users).map((user, i)=> (
                <ListItemText  key={i} >
                    {user.firstName}<Button onClick={()=>this.deleteGroupUser(groupId, user.id)}><Icon >cancel_icon</Icon></Button>
                </ListItemText>
            )
        )
    )

    deleteGroupUser = (groupId, userId) => {
        $('[data-id='+userId+']').show();
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        this.setState({loading: true})
        firebase.database().ref(collection).child('groups').child(groupId).child('users').child(userId)
            .remove(err => {
                this.setState({loading: false})
                if (err !== null) {
                    console.error(err);
                }else{
                    let loadgroups= []
                    firebase.database().ref(collection).child('groups').on('child_added', snap => {
                        // whenever child added (message or anything else) execute these
                        loadgroups.push(snap.val());
                        this.setState({groups: loadgroups}, () => {

                        })
                    })
                    firebase.database().ref(collection).child('users')
                        .child(userId)
                        .update({
                            group: ''
                        })



                }
            });
    }
    addUserToGroup = (group, userId, userName) => {

        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        const newUser = {[userId]:{
                firstName: userName,
                id: userId
            }}


        firebase.database().ref(collection).child('groups')
            .child(group.id)
            .child('users')
            .update(newUser)
            .then(()=> {
                // this.props.getGroups(this.state.groups)
                console.log('user added');
                let loadgroups = []
                firebase.database().ref(collection).child('groups').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    loadgroups.push(snap.val());
                    this.setState({groups: loadgroups})
                })

            })
            .catch(err=> {
                console.log(err);
            })
        firebase.database().ref(collection).child('users')
            .child(userId)
            .update({
                group: [group.id, group.groupName]
            })
            .then(()=> {
                // this.props.getGroups(this.state.groups)
                // console.log('user added');

            })
            .catch(err=> {
                console.log(err);
            })

    }

    /*
        * drag and drop
     */
    allowDrop = (ev) => {
        ev.preventDefault();
    }

    drag = (ev) => {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    drop =  group => ev => {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        let el = document.getElementById(data)
        console.log($(el).attr('data-head'))
        $(el).addClass('disable_user')
        // ev.target.appendChild(el);
        let userId = el.getAttribute("data-id");
        let userName = el.getAttribute("data-name");
        let head = el.getAttribute("data-head");
        //$(el).append('<button id="test">x</button>')

        this.addUserToGroup(group, userId, userName);
        /* let self = this
         $('#test').on('click', function () {
             self.deleteGroupUser(group.id, userId);
         })*/


    }

    render() {
        const {groups, users} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <h2>Drag and drop users</h2>
                    <Grid container spacing={24}>
                        <Grid item sm={8} xs={8}>
                            { groups && this.displaygroups(groups)}
                        </Grid>
                        <Grid item sm={4} xs={4}>
                            { users && this.displayUsers(users)}
                        </Grid>
                    </Grid>
                </div>

            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)( Admin );