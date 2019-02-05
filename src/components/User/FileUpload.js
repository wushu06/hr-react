import React from 'react';
import {Typography,Icon, Modal,Button, InputLabel, Input, FormControl} from '@material-ui/core';
import mime from 'mime-types'
import {connect} from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';



class FileUpload extends React.Component {
    state = {
        file: null,
        authorized: ['image/jpg', 'image/jpeg', 'image/png']
    }

    addFile = event => {
        const file = event.target.files[0]
        if(file){
            this.setState({
                file: file
            })
        }


    };

    sendFile = () => {
        const {file}= this.state;
        const {uploadFile, closeModal }= this.props
        if(this.isAuthorized(file.name)) {
            const metadata = {contentType: mime.lookup(file.name)}
            uploadFile(file, metadata)
            closeModal();
            this.clearFile();
        }
    };
    clearFile = () => this.setState({file: null})

    isAuthorized = fileName => this.state.authorized.includes(mime.lookup(fileName));


    render() {
        const { classes, currentUser } = this.props;
        const {loading, channels} = this.state;

        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.modal}
                onClose={this.props.closeModal}
            >
                <div  className="paper_modal">
                    <Typography variant="h6" id="modal-title">
                        Add channel
                    </Typography>
                    <form style={{margin: 'auto'}}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="file">File</InputLabel>
                            <Input
                                onChange={this.addFile}
                                id="file" name="file" type="file" />
                        </FormControl>

                        <div  style={{marginTop: '15px'}}>
                        </div>

                        <Button
                            onClick={this.sendFile}
                            variant="contained" color="primary"   style={{marginRight: '15px'}} >

                            <CloudUploadIcon  />
                        </Button>
                        <Button

                            variant="contained"
                            color="primary"
                            onClick={this.props.closeModal}
                        >
                            <Icon>cancel_icon</Icon>
                        </Button>
                    </form>

                </div>
            </Modal>
        )
    }
}



export default FileUpload;