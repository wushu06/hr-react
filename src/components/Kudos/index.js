import React from 'react';
import Header from '../../containers/Header'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../firebase'
import {Button,Modal, TextField,FormControl, Grid, List, ListItemText, ListItemAvatar, ListItem, Icon, Avatar, Typography} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import moment from 'moment';


const styles = theme => ({
    root: {
        width: '100%',

        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
});

class Kudos extends React.Component {
    state = {

        users: [],
        open: false,
        kudosTitle: '',
        kudosText: '',
        oldKudos: '',
        loading: false,
        errors: []


    }

    componentDidMount(){

        if(this.props.currentUser) {
            let loadUsers = [];
            let collection = this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '')

            firebase.database().ref(collection).child('users').on("value", snap => {
                loadUsers = []
                firebase.database().ref(collection).child('users').on('child_added', snap => {
                    // whenever child added (message or anything else) execute these
                    loadUsers.push(snap.val());
                    this.setState({users: loadUsers})

                });
            });
        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    displayUsers = users => (
        users.map((user, i)=> (

            <Grid key={i} item sm={6} xs={12}>
                <ListItem alignItems="flex-start"  className="kudos" >
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.firstName + ' '+ user.lastName}
                        secondary={
                            <React.Fragment>

                                    {user.kudos ? Object.values(user.kudos).map((k, x)=>(
                                        <Typography key={x} component="span" className="kudos_wrapper"  color="textPrimary">
                                            <span>{this.getTheKudosAuthor(Object.keys(user.kudos)[x])}</span>

                                            <span>{k.today}</span>
                                            <span>{k.kudosTitle}</span>
                                            <span className="kudos_wrapper_like">
                                                {k.kudosText}
                                                {/*Object.keys(user.kudos)[x] === this.props.currentUser.uid*/}

                                                {k.liked && (k.liked).includes(this.props.currentUser.uid) ?
                                                     <span><Icon>favorite</Icon></span> :
                                                     <span onClick={()=>this.likeKudos(user.id, Object.keys(user.kudos)[x], k.liked)}><Icon>favorite_border</Icon></span>}

                                            </span>
                                            <span className="kudos_star">
                                                {Object.keys(user.kudos)[x] === this.props.currentUser.uid ?
                                                    <Icon>grade</Icon> :
                                                    <StarBorderRounded onClick={() => this.handleOpen(user.id,user.kudos )}/>

                                                }
                                            </span>
                                        </Typography>
                                        )

                                    ) :  <span className="kudos_star">
                                            <StarBorderRounded onClick={() => this.handleOpen(user.id, user.kudos)}/>
                                          </span>}



                            </React.Fragment>
                        }
                    />


                </ListItem>
            </Grid>
            )
        )

    )

    getTheKudosAuthor = authorId => {
        let users = this.state.users

        return users.map(user => {
             return  user.id === authorId ? user.firstName : ''
        })
    }

    handleOpen = (userId, oldKudos) => {
        console.log('open');
        this.setState({ open: true, id: userId, oldKudos: oldKudos });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    giveKudos = userId => {
            let errors = []
            const {kudosTitle, kudosText, oldKudos}= this.state;
                let d = new Date();
                let n = d.getMonth();

             if(kudosText === '' || kudosTitle === ''){
                 errors.push({message: 'All fields are required'})
                 this.setState({errors: errors})
                 return;
             }

            const addKudos = {

                kudos: {
                    ...oldKudos,
                    [this.props.currentUser.uid]: {
                        kudosTitle: kudosTitle,
                        kudosText: kudosText,
                        month: n,
                        today: moment().format('MMM D, YYYY'),
                        liked: ''
                    }
                }
            }


            let  collection =  this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '');
            this.setState({loading: true})
            firebase.database().ref(collection).child('users')
                .child(userId)
                .update(addKudos)
                .then(()=> {
                    this.setState({kudosTitle: '', kudosText: '', loading: false, errors: []})
                   console.log('kudos added');
                })
                .catch(err=> {
                    console.log(err);
                    this.setState({loading: false})
                })

    }
    handleSubmit = e => {
        e.preventDefault();
       this.giveKudos(this.state.id)

    }

    likeKudos = (userId, starUserId, oldLiked) => {
        let liked = [...oldLiked]
        liked.push(this.props.currentUser.uid)
        const addLike = {
            liked: liked
        }


        let  collection =  this.props.currentUser.displayName.replace(/[^a-zA-Z0-9]/g, '');
        this.setState({loading: true})
        firebase.database().ref(collection).child('users')
            .child(userId)
            .child('kudos')
            .child(starUserId)
            .update(addLike)
            .then(()=> {
                this.setState({loading: false})
                console.log('Like added');
            })
            .catch(err=> {
                console.log(err);
                this.setState({loading: false})
            })
    }

    render() {
        const {users, loading, open, errors} = this.state
        const { classes } = this.props;
        return (
            <div>
                <Header/>
                <div className="block_container">

                             <h2>Kudos Table</h2>
                    <Link to="/kudos-board"><h2>Board</h2></Link>

                            <List className={classes.root}>
                                <Grid container spacing={24}>
                                { users && this.displayUsers(users)}
                                </Grid>
                            </List>

                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={open}
                    onClose={this.handleClose}

                >
                    <div  className="paper_modal">
                        <form noValidate autoComplete="off">
                            <FormControl margin="normal"  required fullWidth>

                                <TextField
                                    required
                                    label= 'Kudos Title'
                                    type="text"
                                    margin="normal"
                                    onChange={this.handleChange('kudosTitle')}
                                />
                                <TextField
                                    required

                                    multiline
                                    rowsMax="4"
                                    margin="normal"
                                    label='Kudos Text'
                                    onChange={this.handleChange('kudosText')}
                                />
                            </FormControl>

                            <br/>
                            <FormControl margin="normal" className="submit_row"  required fullWidth>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    disabled={loading}

                                >
                                    Update User
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={this.handleClose}
                                >
                                    Cancel
                                </Button>
                            </FormControl>

                        </form>
                        {errors.length > 0 && errors.map(error => (<div style={{color: 'red'}}>{error.message}</div>))}

                    </div>
                </Modal>
                
            </div>
        )
    }
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
});
Kudos.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Kudos));