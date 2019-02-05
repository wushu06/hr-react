import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {LinearProgress} from '@material-ui/core';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class ProgressBar extends React.Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 });
        } else {
            const diff = Math.random() * 10;
            this.setState({ completed: Math.min(completed + diff, 100) });
        }
    };

    render() {
        const { classes,  uploadState, percentUploaded  } = this.props;
        return (
            uploadState === "uploading" && (

                <div className={classes.root}>

                    <LinearProgress color="secondary" variant="determinate" value={percentUploaded} />
                </div>
            )
        );
    }
}

ProgressBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressBar);

