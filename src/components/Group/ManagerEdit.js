import React from 'react';
import firebase from "../../firebase";
import {TextField, FormControl,FormControlLabel,Modal,  MenuItem, Checkbox, Button} from '@material-ui/core'
import UpdateUser from '../Admin/UpdateUser';


class ManagerEdit extends React.Component {
    state = {
        group: '',
        loading: false,
        open: false,
        groupName: '',
        groupDescription: '',

        groupsRef: firebase.database().ref('groups'),
        id: '',
        allGroups: [],

        currentUser: this.props.currentUser,

        errors: []


    };

    componentDidMount() {
        let collection = this.props.collection.replace(/[^a-zA-Z0-9]/g, ''),
            allGroups= [];

        firebase.database().ref(collection).child('groups').child(this.props.groupId).on("value", snap => {
            this.setState({group: snap.val(), id: this.props.groupId})
        });

    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    handleSubmit = e => {
        e.preventDefault();

        let collection = this.props.collection.replace(/[^a-zA-Z0-9]/g, '');
        const {groupName, groupDescription, group, id}= this.state;
        if(!id){
            return;
        }
        const updateGroup = {
            groupName: groupName ? groupName : group.groupName,
            groupDescription: groupDescription ? groupDescription: group.groupDescription,
        }


        firebase.database().ref(collection).child('groups')
            .child(id)
            .update(updateGroup)
            .then(()=> {
                console.log('group updated');
            })
            .catch(err=> {
                console.log(err);
            })
    }


    render() {
        const {group, loading} = this.state
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
                            label={group.groupName ? group.groupName : 'Group Name'}
                            type="text"
                            margin="normal"
                            onChange={this.handleChange('groupName')}
                        />
                        <TextField
                            required
                            type="text"
                            margin="normal"
                            label={group.groupDescription ? group.groupDescription : 'Description'}
                            onChange={this.handleChange('groupDescription')}
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
                            Update Group
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