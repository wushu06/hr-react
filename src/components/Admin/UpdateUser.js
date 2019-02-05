import React from 'react';
import firebase from "../../firebase";

class UpdateUser extends React.Component {


    handleSubmit = (state, collection, userId) => {

        let errors = [];
        let loading = false;
        let result;
        const {firstName, lastName, email, password, group, holiday,isAdmin, phone, usersRef,profile , currentUser}= state;

        const updateUser = {
            firstName: firstName ? firstName : profile.firstName,
            lastName: lastName ? lastName: profile.lastName,
            email: email ? email : profile.email ,
            phone: phone ? phone : '' ,
            // password:  password ?  password : profile.password ,
            group:  group  ?  group : profile.group ? profile.group : '',
            holiday:{
               remainingDays:  holiday ? holiday : profile.holiday.remainingDays,

            },
            isAdmin:  isAdmin ? isAdmin : profile.isAdmin
        }



        firebase.database().ref(collection).child('users')
            .child(userId)
            .update(updateUser)
            .then(()=> {
                // reset password maybe
            })
            .catch(err=> {
                console.log(err);
            })


        /*
         * add user to the group
         */

        if(!group ) {
            console.log('nop');
            return;
        }





        const newUser = {[userId]:{
                firstName: firstName ? firstName : profile.firstName,
                id: userId
            }}
        firebase.database().ref(collection)
            .child('groups')
            .child(group[0])
            .child('users')
            .child(userId)
            .remove(err => {
                if (err !== null) {
                    console.error(err);
                }else{
                    firebase.database().ref(collection).child('groups')
                        .child(group[0])
                        .child('users')
                        .update(newUser)
                        .then(()=> {
                        })
                        .catch(err=> {
                            console.log(err);
                        })
                }
            });
        console.log(profile.group);
        if(profile.group) {

            firebase.database().ref(collection)
                .child('groups')
                .child(profile.group[0])
                .child('users')
                .child(userId)
                .remove(err => {

                });
        }



    };

    isPasswordValid = (password) => {
        console.log(password);
        return password.length > 6;
    };


}

export default UpdateUser;
