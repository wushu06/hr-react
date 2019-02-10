import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router , Route,  Switch, withRouter} from 'react-router-dom';
import Admin from './components/Admin'
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {getGroups, setUser, clearUser} from './action';
import {Provider, connect} from 'react-redux';
import Profile from './components/User/Profile'
import UpdateProfile from './components/User/UpdateProfile'
import Login from './Auth/WPLogin'
import Register from './Auth/WPRegister'
import firebase from "./firebase";
import Spinner from './Spinner';
import Groups from './components/Group/Manager';
import User from './components/User/Manager';
import Holiday from './components/User/Holiday'
import Calendar from './components/User/Calendar'
import Nomatch from './containers/404';
import Kudos from './components/Kudos'
import Board from './components/Kudos/Board'
import OrgChart from './components/Admin/OrgChart'
import Notifications from './components/Admin/Notifications'
import J1 from './J1'

const store = createStore(rootReducer, composeWithDevTools());



class Root extends React.Component {

    componentDidMount(){


     /*   firebase.auth().onAuthStateChanged(user => {

            if(user){
                //we have user obj lets pass it to a global function (action function) which is in props
                // to add action function to props we use connect
                this.props.setUser(user);
                if(this.props.history.location.pathname === '/login' ||
                    this.props.history.location.pathname === '/register' ) {

                    this.props.history.push('/')
                }

            }else{


                this.props.history.push('/login')
                this.props.clearUser(user);
            }

        });*/

        let userId = window.localStorage.getItem('userId');
        let companyName = window.localStorage.getItem('userCompanyName');
        let user = {}

        if(userId &&  userId !== "undefined"){
            console.log(companyName);
            console.log(userId);
             user = {
                uid: userId,
                displayName: companyName
            }
            this.props.setUser(user);
            if(this.props.history.location.pathname === '/login' ||
                this.props.history.location.pathname === '/register' ) {

                this.props.history.push('/')
            }
        }else{
            console.log('no');
            this.props.history.push('/login')
            this.props.clearUser(user);
        }

    }
    render() {
        return this.props.isLoading ? <Spinner /> : (

            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/admin" component={Admin} />
                <Route path="/profile" component={Profile} />
                <Route path="/update" component={UpdateProfile} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/groups" component={Groups} />
                <Route path="/holiday" component={Holiday} />
                <Route path="/users" component={User} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/kudos" component={Kudos} />
                <Route path="/kudos-board" component={Board} />
                <Route path="/organisation-chart" component={OrgChart} />
                <Route path="/j1" component={J1} />
                <Route path="/notifications" component={Notifications} />
                <Route component={Nomatch} />
            </Switch>

        )
    }
}

const mapStateFromProps = state => ({
    isLoading: state.user.isLoading,
    currentUser: state.user.currentUser
})

const RootWithAuth = withRouter(connect(mapStateFromProps, {setUser, clearUser, getGroups} )(Root))

ReactDOM.render( <Provider store={store}>
                    <Router>
                        <RootWithAuth />
                    </Router>
                </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
