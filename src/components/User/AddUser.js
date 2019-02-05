import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {TextField,SnackbarContent,FormControl, Checkbox,FormControlLabel, MenuItem, Icon, Button} from '@material-ui/core'
import firebase from '../../firebase';
import md5 from "md5";
import SaveUser from '../../Auth/SaveUser';
import {connect} from "react-redux";



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


class AddUser extends React.Component {
    state = {
        group: '',
        groupId: '',
        loading: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        usersRef: firebase.database().ref('users'),
        groupsRef: firebase.database().ref('groups'),
        companyName: this.props.currentUser.displayName,
        users: [],
        allGroups: [],
        isAdmin: false,
        errors: {message: 'test'}
    };
    /*
        * life cycle
     */

    componentDidMount() {
        let loadUsers = [],
            allGroups = [];
        let collection = this.state.companyName.replace(/[^a-zA-Z0-9]/g, '');
        firebase.database().ref(collection).child('users').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            loadUsers.push(snap.val());
            this.setState({users: loadUsers, firstName: '', lastName: '', email: '', password: '', phone: '',
                group: '', photoURL: '', loading: false})


        })

        firebase.database().ref(collection).child('groups').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            allGroups.push(snap.val());
            this.setState({allGroups: allGroups} )

        })
        firebase.database().ref(collection).child('groups').on('child_removed', snap => {
            // whenever child added (message or anything else) execute these
            allGroups.pop(snap.val());
            this.setState({allGroups: allGroups} )

        })
    }
    /*
        * from check
     */
    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: "Fill in all fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    isFormEmpty = ({ firstName, lastName, email, password }) => {
        return (
            !firstName.length ||
            !lastName.length ||
            !email.length ||
            !password.length
        );
    };

    isPasswordValid = ({ password }) => {
        if (password.length < 6 ) {
            return false;
        }  else {
            return true;
        }
    };
    /*
        * displays
     */

    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);

    displayGroups = groups => (
        groups && groups.map(group => (
            <MenuItem  key={group.id} value={[group.id, group.groupName]}>
                {group.groupName}
            </MenuItem>

        ))
    )

    /*
        * handlers
     */
    handleChangeCheckbox = event => {
        this.setState(prevState => ({
            isAdmin: !prevState.isAdmin
        }));
    }


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



    /*
        * main functions
     */
    handleSubmit = event => {
        event.preventDefault();
        let errors = []
        let save = new SaveUser()
        if(this.isFormValid() ) {
            let result =  save.handleSubmit(this.state, false, false);
            result.then(res => {
                console.log(res);
                this.setState({
                    loading: false,
                    errors:  errors.concat({message:  res[0]})

                }, ()=> console.log(this.state.errors));

            })

        }
    }



    render() {
        const { classes } = this.props;
        const {loading, users, errors, open} = this.state
        return (
            <div>
                <h1>Add user</h1>
                <form className={classes.container} noValidate autoComplete="off">
                    <FormControl margin="normal" required fullWidth>
                        <TextField
                            required
                            label="First Name"
                            type="text"
                            className={classes.textField}
                            value={this.state.firstName}
                            margin="normal"
                            onChange={this.handleChange('firstName')}
                        />
                        <TextField
                            required
                            label="Last Name"
                            type="text"
                            className={classes.textField}
                            value={this.state.lastName}
                            margin="normal"
                            onChange={this.handleChange('lastName')}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <TextField
                            required
                            label="Email"
                            type="email"
                            className={classes.textField}
                            value={this.state.email}
                            margin="normal"
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            required
                            id="standard-password-input"
                            label="Password"
                            className={classes.textField}
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                        />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <TextField
                            id="standard-number"
                            label="Phone Number"
                            value={this.state.phone}
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
                            helperText= "Please select a group"
                            margin="normal"
                        >
                            { this.displayGroups(this.state.allGroups)}
                        </TextField>

                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isAdmin}
                                onChange={this.handleChangeCheckbox}
                            />
                        }
                        label="Admin"
                    />

                    <br/>
                    <FormControl margin="normal" required fullWidth>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            disabled={loading}

                        >
                            Add User
                        </Button>
                    </FormControl>

                </form>
                {errors.length > 0 && (
                    <SnackbarContent
                        className={classes.snackbar}
                        message={this.displayErrors(errors)}
                       
                    />

                )}

            </div>
        );
    }
}

AddUser.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});


export default connect(mapStateToProps)(withStyles(styles)(AddUser));