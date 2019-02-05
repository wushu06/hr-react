import React from 'react';
import {Link} from 'react-router-dom';
import { SnackbarContent, Grid, Button,  FormControl, FormControlLabel, Checkbox, Input, InputLabel} from '@material-ui/core';
import logo from '../logo.svg';
import firebase from "../firebase";


class Login extends React.Component {

    state = {
        email: '',
        password: '',
        loading: false,
        errors: [],
        userRef: firebase.database().ref('users')

    }
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit = event => {
        event.preventDefault();
        let errors = [];

        this.setState({loading: true, errors: []})
        if(!this.isFormEmpty()) {
            this.setState({loading: false, errors: errors.concat({message: 'Please fill the form.'}) })

        }else{
            this.setState({loading: true, errors: []})
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(singedInUser => {
                    //console.log(singedInUser);
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                    console.log(err);
                })
        }


    };



    isFormEmpty = () => {
        const { email, password} = this.state
        if( email === '' || password === ''){
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
        const {username, password, loading, errors}= this.state
        return (
            <main className="app-form block_container">
                <Grid container spacing={24} center="true">
                    <Grid item xs={12}>
                        <div style={{textAlign : 'center', width: '100%'}}>
                            <img src={logo} alt="" width={80}/>
                        </div>

                        <h2 style={{textAlign: 'center'}} >Login</h2>
                        <form style={{margin: 'auto'}}>
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
                                Login
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
                            Don't have an account? {' '}
                            <Link to="/register">Register</Link>
                        </div>

                    </Grid>
                </Grid>

            </main>
        )
    }
}

export default Login;