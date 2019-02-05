import React from 'react';
import md5 from "md5";
import firebase from "../firebase";

class SaveUser extends React.Component {


    handleSubmit = (state, collection) => {
        let errors = [];
        let loading = false;
        let result;

        firebase
            .auth()
            .createUserWithEmailAndPassword(state.email, state.password)
            .then(createdUser => {
                /* this.setState({
                     loading: false
                 });*/
                createdUser.user
                    .updateProfile({
                        displayName: state.companyName,
                        photoURL: `http://gravatar.com/avatar/${md5(
                            createdUser.user.email
                        )}?d=identicon`
                    })
                    .then(() => {
                        if(collection){
                            this.addCollection(createdUser, state)
                        }else{
                            this.saveUser(createdUser, state)
                        }
                        result = true;

                    })
                    .catch(err => {
                        console.error(err);
                        result = false;

                    });
            })
            .catch(err=> {
                return {loading: false, errors: errors.concat({message: 'Something went wrong, Please contact the team.'})};
            })
        return result;
    };


    saveUser = (createdUser,  state) => {
        let collection = state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        // for the rest of users + admin

        // for admins only (companies)
        firebase.database().ref(collection)
            .child('users')
            .child(createdUser.user.uid)
            .set({
                firstName: state.firstName,
                lastName: state.lastName,
                companyName: state.companyName,
                email: state.email,
                avatar: createdUser.user.photoURL,
                id: createdUser.user.uid,
                isAdmin: state.isAdmin,
                holiday: {
                    remainingDays: 0,
                    range: []
                }
            })
    }
    addCollection = (createdUser, state) => {
        let collection = state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        // const key = firebase.database().ref(collection).push().key
        const key = createdUser.user.uid
        const newUser = {
            id: key,
            firstName: state.firstName,
            lastName: state.lastName,
            companyName: state.companyName,
            email: state.email,
            avatar: createdUser.user.photoURL,
            isAdmin: state.isAdmin,
            holiday: {
                remainingDays: 0,
                range: []
            }

        }
        firebase.database().ref(collection)
            .child(key)
            .update(newUser)
            .then(()=> {
                console.log('company created');
                this.saveUser(createdUser, state )

            })
            .catch(err=> {
                console.log(err);
            })
    }
}

export default SaveUser;