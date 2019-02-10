import React from 'react';
import Header from '../../containers/Header'
import firebase from '../../firebase'
import {Button, Grid,ListItem, Icon, List, ListItemText} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import $ from 'jquery'
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
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


       // firebase.database().ref(collection).child('users').on("value", snap => {
            let loadUsers = []
            firebase.database().ref(collection).child('users').on('child_added', snap => {
                // whenever child added (message or anything else) execute these
                // dont execlue but hide


                  !snap.val().group && loadUsers.push(snap.val());
              //    loadUsers.push(snap.val());

                this.setState({users: loadUsers})


            })
       // });


    }



    jqueryF = i => {
        let _self = this
        let classes = []
        let check = false
        for (let x = 0; x <= i; x++) {
            classes.push('.droppable-area-head'+x)
        }
        classes.push('.droppable-area-staff, .droppable-area-users')
        $( document ).ready(function($) {
            $(init);

            function init() {
                $(classes.toString()).sortable({
                    connectWith: ".connected-sortable",
                    stack: '.connected-sortable ul',
                    start: function( event, ui ) {

                        if($(event.toElement.parentElement).hasClass('head')){
                             check = true

                        }
                        if($(event.toElement.parentElement).hasClass('users')){
                            console.log('staff start');

                        }
                    },
                    stop: function( event, ui ) {
                        let userId = $(ui.item[0]).attr('data-id')
                        let userName = $(ui.item[0]).attr('data-name')
                        let userEmail = $(ui.item[0]).attr('data-email')
                        let groupId = $(ui.item[0]).attr('data-group-id')
                        let groupIdParent = $(ui.item[0].parentElement).attr('data-group')
                        let groupNameParent = $(ui.item[0].parentElement).attr('data-groupName')

                        groupId = groupId ? groupId : groupIdParent



                        if(event.target.className === event.toElement.parentElement.className) {
                            console.log('same');
                           // return;
                        }
                        if($(event.toElement.parentElement).hasClass('staff')){
                            $(ui.item[0]).addClass('hide_el')
                            console.log('staff her');
                            _self.deleteGroupUser( groupId, userId, check)
                            _self.addUserToGroup(groupIdParent,groupNameParent, userId, userName, userEmail)

                        }
                        if($(event.toElement.parentElement).hasClass('head')){
                            _self.deleteGroupUser( groupId, userId, check)
                            _self.addToHead(userId,userName, groupIdParent, groupNameParent, userEmail)


                        }
                        if($(event.toElement.parentElement).hasClass('users')){
                            console.log('users her');
                           _self.deleteGroupUser(groupId, userId, check)

                        }

                    }
                }).disableSelection();
            }

        });
    }
    addToHead = (userId,userName, groupId, groupName, userEmail) => {
        console.log(userId, userName, groupId, groupName);
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        const newUser = {[userId]:{
                firstName: userName,
                id: userId,
                email: userEmail
            }}


        firebase.database().ref(collection).child('groups')
            .child(groupId)
            .child('head')
            .update(newUser)
            .then(()=> {

            })
            .catch(err=> {
                console.log(err);
            })
        firebase.database().ref(collection).child('users')
            .child(userId)
            .update({
                group: [groupId, groupName],
                head: groupName
            })
            .then(()=> {
                // this.props.getGroups(this.state.groups)
                // console.log('user added');

            })
            .catch(err=> {
                console.log(err);
            })

    }

    displaygroups = groups => {
        const rowLen = groups.length;
      return  groups.map((group, i) => {
          if (rowLen === i + 1) {
              {this.jqueryF(i)}
          }

         /* if(group.groupHead) {

          }*/
             return ( <List
                  key={i}
                  className="drag_box">
                     <strong> {group.groupName}</strong><Button onClick={() => this.deleteGroup(group.id)}><Icon>cancel_icon</Icon></Button>

                     <ul data-group={group.id}  data-groupName={group.groupName} className={'head connected-sortable droppable-area-head'+i}>
                         {group.head && this.displayGroupHeads(group.head, group.id)}

                     </ul>

                     <ul data-group={group.id} data-groupName={group.groupName} className="staff connected-sortable droppable-area-staff">
                        {group.users && this.displayGroupUsers(group.users, group.id)}
                     </ul>


                 </List>
             )
          }
        )

    }

    displayUsers = users => (
        users.map((user, i)=> (

                    <li
                        key={i}
                        data-id={user.id}
                        data-name={user.firstName}
                        data-email={user.email}
                        className="draggable-item" >{user.firstName}</li>


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
              <li
                  key={i}
                  data-id={user.id}
                  data-group-id={groupId}
                  data-name={user.firstName}
                  data-email={user.email}
                  className="draggable-item">{user.firstName}</li>

            )
        )
    )
    displayGroupHeads = (users, groupId) => (
        Object.values(users).map((user, i)=> (
                <li
                    key={i}
                    data-id={user.id}
                    data-group-id={groupId}
                    data-name={user.firstName}
                    data-email={user.email}
                    className="draggable-item">{user.firstName}</li>

            )
        )
    )

    deleteGroupUser = (groupId, userId, head = false) => {
        console.log(groupId);
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        this.setState({loading: true})
        //if(head) {
            // delete from staff from group table
            firebase.database().ref(collection).child('groups').child(groupId).child('users').child(userId)
                .remove(err => {
                    this.setState({loading: false})
                });
            // delete from other heads from group table
            firebase.database().ref(collection).child('groups').child(groupId).child('head')
                .remove(err => {
                    this.setState({loading: false})
                });
            // delete from users table
            firebase.database().ref(collection).child('users')
                .child(userId)
                .update({
                    group: ''
                })


       // }else {

            // delete from staff in group table
            /*firebase.database().ref(collection).child('groups').child(groupId).child('users').child(userId)
                .remove(err => {
                    this.setState({loading: false})

                });
            // delete from users table
            firebase.database().ref(collection).child('users')
                .child(userId)
                .update({
                    group: ''
                })*/


        //}

    }
    addUserToGroup = (groupId,groupName, userId, userName, userEmail) => {

        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        const newUser = {[userId]:{
                firstName: userName,
                id: userId,
                email: userEmail
            }}


        firebase.database().ref(collection).child('groups')
            .child(groupId)
            .child('users')
            .update(newUser)
            .then(()=> {


            })
            .catch(err=> {
                console.log(err);
            })
        firebase.database().ref(collection).child('users')
            .child(userId)
            .update({
                group: [groupId, groupName]
            })
            .then(()=> {
                // this.props.getGroups(this.state.groups)
               // console.log('user added');

            })
            .catch(err=> {
                console.log(err);
            })

    }


    render() {
        const {groups, users} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <h2>Drag and drop users</h2>
                    <div className="info">
                        <div><span></span>Head of department</div>
                        <div><span></span>Staff</div>
                    </div>


                    <Grid container spacing={24}>
                        <Grid item sm={8} xs={8}>
                        { groups && this.displaygroups(groups)}
                        </Grid>
                        <Grid item sm={4} xs={4}>
                            <ul className="users connected-sortable  droppable-area-users">
                            { users && this.displayUsers(users)}
                            </ul>
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