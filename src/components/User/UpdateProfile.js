import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {TextField, FormControl,Grid,  MenuItem, Icon, Button} from '@material-ui/core'
import firebase from '../../firebase';
import Header from '../../containers/Header'
import {connect} from "react-redux";
import FileUpload from './FileUpload'
import uuidv4 from 'uuid/v4';
import ProgressBar from '../../containers/ProgressBar';
import UpdateUser from "../Admin/UpdateUser";


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



class UpdateProfile extends React.Component {
    state = {
        group: '',
        loading: false,
        open: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        usersRef: firebase.database().ref('users'),
        groupsRef: firebase.database().ref('groups'),
        users: [],
        allGroups: [],
        groupId: '',
        profile:'',
        currentUser: this.props.currentUser,
        companyName: this.props.currentUser.displayName,
        uploadState: "",
        percentUploaded: 0,
        storageRef: firebase.storage().ref(),
        errors: []


    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
               /* name = user.displayName;
                  email = user.email;
                  photoUrl = user.photoURL;
                  emailVerified = user.emailVerified;
                  uid = user.uid;
                  */
            } else {
                    console.log('not');
            }
        });

        let loadUsers = [],
            allGroups = [],
           collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');

        firebase.database().ref(collection).child('users').child(this.state.currentUser.uid).on("value", snap => {
            this.setState({profile: snap.val()})
        });

        firebase.database().ref(collection).child('groups').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            allGroups.push(snap.val());
            this.setState({allGroups: allGroups} )

        })
    }

    displayGroups = groups => (
        groups && groups.map(group => (
            <MenuItem  key={group.id} value={[group.id, group.groupName]}>
                {group.groupName}
            </MenuItem>

        ))
    )


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    handleChangeGroup = name => event => {
        this.setState({
            group: event.target.value,
            groupId: event.target
        }, ()=>console.log(this.state.group));
    };

    handleSubmit = event => {
        event.preventDefault();
       // this.UpdateUser()
        let update = new UpdateUser();
        update.handleSubmit(this.state, this.state.companyName.replace(/[^a-zA-Z0-9]/g, ''), this.props.currentUser.uid)
    }

    UpdateUser = () => {
        const {firstName, lastName, email, password, group, phone, usersRef, profile, currentUser}= this.state;
        const key = usersRef.push().key
        const updateUser = {
            firstName: firstName ? firstName : profile.firstName,
            lastName: lastName ? lastName: profile.lastName,
            email: email ? email : profile.email ,
            phone: phone ? phone : '' ,
           // password:  password ?  password : profile.password ,
            group:  group?  group : '' ,
        }

        let  collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        this.setState({loading: true})
        firebase.database().ref(collection).child('users')
            .child(currentUser.uid)
            .update(updateUser)
            .then(()=> {
                this.setState({loading: false})
                if(this.isPasswordValid(password)){
                    console.log('start');
                    currentUser.updatePassword(password).then(function() {
                        console.log('password changed');
                    }).catch(function(error) {
                        console.log('password ERROR');
                    });
                }
            })
            .catch(err=> {
                console.log(err);
                this.setState({loading: false})
            })
    }
    isPasswordValid = (password) => {
        console.log(password);
        return password.length > 6;
    };

    deleteUser= id => {
        this.setState({loading: true})
        this.state.usersRef.child(id)
            .remove(err => {
                this.setState({loading: false})
                if (err !== null) {
                    console.error(err);
                }else{
                    console.log('no error');
                }
            });
    }

    /*
     * Modal
     */

    // file upload
    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    getPath = () => {
       return `chat/private/${this.state.profile.id}`;
    };

    uploadFile = (file, metadata) => {
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
        this.setState(
            {
                uploadState: "uploading",
                uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
            },
            () => {
                this.state.uploadTask.on(
                    "state_changed",
                    snap => {
                        const percentUploaded = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        this.setState({ percentUploaded });
                    },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: "error",
                            uploadTask: null
                        });
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then(downloadUrl => {
                                this.updateAvatar(downloadUrl)

                            })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: "error",
                                    uploadTask: null
                                });
                            });
                    }
                );
            }
        );
    };

    updateAvatar = url => {
      let  collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');

        this.setState({loading: true})
        firebase.database().ref(collection).child('users')
            .child(this.state.currentUser.uid)
            .update({
                avatar: url
            })
            .then(()=> {
                this.setState({loading: false, uploadState: ''})
            })
            .catch(err=> {
                console.log(err);
                this.setState({loading: false, uploadState: ''})
            })
    }



    render() {
        const { classes } = this.props;
        const {loading,  profile, open, uploadState, percentUploaded} = this.state
        return (
            <div>
                <Header/>
                <div className="block_container">
                    <h1>Update profile</h1>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                        <form className={classes.container} noValidate autoComplete="off">
                            <FormControl margin="normal" required fullWidth>

                                <TextField
                                    required
                                    label={profile.firstName ? profile.firstName : 'First Name'}
                                    type="text"
                                    className={classes.textField}
                                    margin="normal"
                                    onChange={this.handleChange('firstName')}
                                />
                                <TextField
                                    required
                                    type="text"
                                    className={classes.textField}
                                    margin="normal"
                                    label={profile.lastName ? profile.lastName : 'Last Name'}
                                    onChange={this.handleChange('lastName')}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <TextField
                                    required
                                    label={profile.email ? profile.email : 'Email'}
                                    type="email"
                                    className={classes.textField}
                                    margin="normal"
                                    onChange={this.handleChange('email')}
                                />
                                <TextField
                                    required
                                    id="standard-password-input"
                                    label='Password'
                                    className={classes.textField}
                                    type="password"
                                    autoComplete="current-password"
                                    margin="normal"
                                    onChange={this.handleChange('password')}
                                />
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <TextField
                                    id="standard-number"
                                    label={profile.phone ? profile.phone : 'Phone number' }
                                    value={this.state.age}
                                    onChange={this.handleChange('phone')}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <TextField
                                    id="standard-select-currency"
                                    select
                                    label={ this.state.group[1] ? this.state.group[1] : 'Group' }
                                    name="group"
                                    value={this.state.group}
                                    onChange={this.handleChangeGroup('group')}
                                    helperText={profile.group ? <strong>{profile.group[1]}</strong> : "Please select a group" }
                                    margin="normal"
                                >
                                    { this.displayGroups(this.state.allGroups)}
                                </TextField>
                            </FormControl>
                            <br/>
                            <FormControl margin="normal" required fullWidth>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    disabled={loading}

                                >
                                    Update User
                                </Button>
                            </FormControl>

                        </form>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="profile_avatar">
                                <img src={profile.avatar} width="120" alt=""/>
                                <div className="profile_avatar_btn" onClick={this.handleOpen}><Icon>edit_icon</Icon></div>
                            </div>
                            <FileUpload modal={open} closeModal={this.handleClose} uploadFile={this.uploadFile}/>
                            <br/>
                            {uploadState &&
                            <ProgressBar uploadState={uploadState}
                                         percentUploaded={percentUploaded}
                            />
                            }
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

UpdateProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)(withStyles(styles)(UpdateProfile));