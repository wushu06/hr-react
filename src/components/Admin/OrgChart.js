import React from 'react';
import firebase from "../../firebase";
import {connect} from "react-redux";
import {Button, Grid, Icon, List} from '@material-ui/core'
import Header from '../../containers/Header'
import $ from 'jquery'
import orgchart from 'orgchart'

class OrgChart extends React.Component {
    state = {
        groups: [],
        users: [],
        open: false,
        alert: false,
        delete: false,
        id: '',
        parents: []


    }

    componentDidMount(){




        if(this.props.currentUser) {
            let loadUsers = [];
            let loadgroups = [];
            let p = [];
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')


            firebase.database().ref(collection).child('users').on("value", snap => {
                loadUsers = []
                firebase.database().ref(collection).child('users').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    loadUsers.push(snap.val());
                    this.setState({users: loadUsers})

                });
            });
            firebase.database().ref(collection).child('groups').on("value", snap => {
                loadgroups = [];

                firebase.database().ref(collection).child('groups').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    loadgroups.push(snap.val());
                    p.push( {'name': 'some' , 'title': snap.val().groupName})
                    this.setState({groups: loadgroups, parents: p})


                });
            });





        }
    }
    showChart = () => {





        let self = this

        $(window).on('load', function () {

           setTimeout(() => {
               let ds = {
                   'name': 'Lao Lao',
                   'title': 'general manager',
                   'children': self.state.parents
               };
               console.log(self.state.parents);
            $('#chart-container').orgchart({
                'data' : ds,
                'nodeContent': 'title'
            })
           }, 3000);
        })

    }
    displayUsers = users => (
        users.map((user, i)=> (
                <List key={i} >
                    {user.firstName}

                </List>
            )
        )

    )


    displaygroups = groups => {




    }


    render() {
        const { users, groups} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <Grid container spacing={24}>
                        {groups && this.showChart()}
                        <div id="chart-container"></div>
                        <Grid item xs={6}>

                            { users && this.displayUsers(users)}
                        </Grid>
                        <Grid item xs={6}>
                            {groups && this.displaygroups(groups)}
                        </Grid>
                    </Grid>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    allGroups: state.groups.allGroups
});


export default connect(mapStateToProps)(OrgChart);