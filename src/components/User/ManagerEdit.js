import React from 'react';
import firebase from "../../firebase";
import {TextField, FormControl,FormControlLabel,Modal,  MenuItem, Checkbox, Button} from '@material-ui/core'
import UpdateUser from '../Admin/UpdateUser';


class ManagerEdit extends React.Component {
    state = {
        group: '',
        loading: false,
        open: false,
        firstName: '',
        lastName: '',
        email: '',
        holiday: '',
        isAdmin: false,
        phone: '',
        usersRef: firebase.database().ref('users'),
        groupsRef: firebase.database().ref('groups'),
        users: [],
        allGroups: [],
        profile:'',
        groupId: '',
        currentUser: this.props.currentUser,
        uploadState: "",
        percentUploaded: 0,
        storageRef: firebase.storage().ref(),
        errors: []


    };

    componentDidMount() {
        let allGroups = [],
            collection = this.props.collection.replace(/[^a-zA-Z0-9]/g, '');
        firebase.database().ref(collection).child('users').child(this.props.userId).on("value", snap => {
            this.setState({profile: snap.val(), isAdmin: snap.val().isAdmin})
        });

        firebase.database().ref(collection).child('groups').on('child_added', snap => {
            // whenever child added (message or anything else) execute these
            allGroups.push(snap.val());
            this.setState({allGroups: allGroups} )

        })

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
        });
    };
    handleChangeCheckbox = event => {
        this.setState(prevState => ({
            isAdmin: !prevState.isAdmin
        }));
    }

    handleSubmit = e => {
        e.preventDefault();
        let update = new UpdateUser();
        update.handleSubmit(this.state, this.props.collection.replace(/[^a-zA-Z0-9]/g, ''), this.props.userId)

    }

    displayGroups = groups => (
        groups && groups.map(group => (
            <MenuItem  key={group.id} value={[group.id, group.groupName]}>
                {group.groupName}
            </MenuItem>

        ))
    )

    render() {
        const {profile, loading} = this.state
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.modal}
                onClose={this.props.closeModal}

            >
                <div  className="paper_modal">
                <form noValidate autoComplete="off">
                    <FormControl margin="normal" className="input_row" required fullWidth>

                        <TextField
                            required
                            label={profile.firstName ? profile.firstName : 'First Name'}
                            type="text"
                            margin="normal"
                            onChange={this.handleChange('firstName')}
                        />
                        <TextField
                            required
                            type="text"
                            margin="normal"
                            label={profile.lastName ? profile.lastName : 'Last Name'}
                            onChange={this.handleChange('lastName')}
                        />
                    </FormControl>
                    <FormControl margin="normal" className="input_row"  required fullWidth>
                        <TextField
                            required
                            label={profile.email ? profile.email : 'Email'}
                            type="email"
                            
                            margin="normal"
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            required
                            id="standard-holiday-input"
                            label={profile.holiday && profile.holiday.remainingDays ? profile.holiday.remainingDays: 'Holiday'}
                            type="number"
                            autoComplete="current-holiday"
                            margin="normal"
                            onChange={this.handleChange('holiday')}
                        />
                    </FormControl>

                    <FormControl margin="normal" className="input_row"  required fullWidth>
                        <TextField
                            id="standard-number"
                            label={profile.phone ? profile.phone : 'Phone number' }
                            value={this.state.phone}
                            onChange={this.handleChange('phone')}
                            type="number"
                            
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ this.state.isAdmin }
                                    onChange={this.handleChangeCheckbox}
                                />
                            }
                            label="Admin"
                        />
                    </FormControl>
                    <FormControl className="input_row"  required fullWidth>
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
                            onClick={this.props.closeModal}
                        >
                            Cancel
                        </Button>
                    </FormControl>

                </form>
                </div>
            </Modal>
        )
    }
}

export default ManagerEdit;