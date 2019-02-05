import React from 'react';
import {Link} from 'react-router-dom';
import { SnackbarContent,  Grid, Button, FormControl, FormControlLabel, Checkbox, Input, InputLabel} from '@material-ui/core';
import firebase from '../firebase';
import md5 from 'md5';
import logo from '../logo.svg'
import SaveUser from './SaveUser';
import {  withRouter} from 'react-router-dom';

class Register extends React.Component {
    state = {
        firstName : '',
        lastName: '',
        companyName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        loading: false,
        errors: [],
        userRef: firebase.database().ref('users'),
        isAdmin: true

    }
    componentWillUpdate() {
        let userId = window.localStorage.getItem('userId');
        console.log('did');
            if(userId && typeof userId !== "undefined"){
            this.props.history.push('/')
        }

    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit = event => {
        event.preventDefault();
        let save = new SaveUser()


        let errors = [];
        this.setState({loading: true, errors: []}, ()=>console.log(this.state.errors))
        if(!this.isFormEmpty()) {
            this.setState({loading: false, errors: errors.concat({message: 'Please fill the form.'}) })


        }else if(!this.isPasswordValid()) {
            this.setState({loading: false, errors: errors.concat({message: 'Passwords not matching or too short.'})});

        }else{
            this.setState({
                loading: false
            });
           let result =  save.handleSubmit(this.state, true);
           console.log(result);
            this.setState({result}, ()=>console.log(this.state.result));

        }


    };
    companyCheck = () => {
        let ref = firebase.database().ref(this.state.companyName);
        ref.once("value")
            .then(snap => {
                console.log(this.state.companyName);
                return snap.exists();
            });
    }


    isPasswordValid = () => {
        const { password, passwordConfirmation} = this.state
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };
    isFormEmpty = () => {
        const {firstName, email, password, passwordConfirmation, errors} = this.state
        if(firstName === '' || email === '' || password === '' || passwordConfirmation === ''){
            return false;
        }else  {
            return true;
        }
    }

    handleInputError = (errors, inputName) => {
        errors.some(error => {
            console.log(error);
            // error.message.toLowerCase().includes(inputName) ? 'error' : '';
        })
    }

    render() {
        const {loading, errors} = this.state;
        return (
            <div>
                <main className="app-form block_container">
                    <Grid container spacing={24} center="true">
                        <Grid item xs={12}>
                            <div style={{textAlign : 'center', width: '100%'}}>
                                <img src={logo} alt="" width={80}/>
                            </div>

                            <h2 style={{textAlign: 'center'}} >Register</h2>
                            <form style={{margin: 'auto'}} >
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                                    <Input
                                        required
                                        onChange={this.handleChange}
                                        id="firstName" name="firstName" autoComplete="First Name" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="firstName">Last Name</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        id="lastName" name="lastName" autoComplete="Last Name" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="companyName">Company Name</InputLabel>
                                    <Input
                                        required
                                        onChange={this.handleChange}
                                        id="companyName" name="companyName" autoComplete="Company Name" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        id="email" name="email" autoComplete="email" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        name="password" type="password" id="password" autoComplete="current-password" />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="passwordConfirmation">Password Confirmation</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        name="passwordConfirmation" type="password" id="passwordConfirmation" autoComplete="current-password" />
                                </FormControl>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <br/>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    disabled={loading}

                                >
                                    Register
                                </Button>
                            </form>
                            <div>
                                {errors.length > 0 &&
                                errors.map((error, key)=> {
                                    return (
                                        <div key={key} style={{marginTop: '30px'}}>
                                            < SnackbarContent
                                                className="msg_error"
                                                color="error"
                                                message={error.message}

                                            />

                                        </div>

                                    )
                                })  }

                            </div>
                            <div style={{marginTop: '30px'}}>
                                Already have an account? {' '}
                                <Link to="/login">Login</Link>
                            </div>

                        </Grid>
                    </Grid>

                </main>

            </div>
        )
    }
}

export default withRouter(Register);