import React from 'react';
import {Link} from 'react-router-dom';
import { SnackbarContent, Grid, Button,  FormControl, FormControlLabel, Checkbox, Input, InputLabel} from '@material-ui/core';
import logo from '../assets/hr.png'
import firebase from "../firebase";
import {  withRouter} from 'react-router-dom';
import {setUser} from "../action";
import {connect} from "react-redux";

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


            let authURL =  "http://react.nourdigital.com/wp-json/jwt-auth/v1/token";

            fetch(authURL, {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({username:this.state.email, password: this.state.password})
            }).then(res=>res.json())
            .then(res => {
                console.log(res);
                if(res.message) {
                    this.setState({loading: false, errors: errors.concat({message: res.message}) })
                    return;
                }
                window.localStorage.setItem('userId', res.user_id);
                window.localStorage.setItem('userCompanyName',res.user_display_name  );
                let user = {
                    uid: res.user_id,
                    displayName: res.user_display_name
                }
                this.props.setUser(user);

                this.setState({
                    loading: false
                })
                this.props.history.push('/')

            })
                .catch(err=> {
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
                            <img src={logo} alt="" width={150}/>
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

export default withRouter(connect(null, {setUser} )(Login));
