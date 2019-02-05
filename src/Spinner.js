import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({

    myCustom: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translare(-50%, -50%)',
        width: '80px !important',
        height: '80px !important'
    },
    loader: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        opacity: '0.5'
    }

});
class Spinner extends React.Component {

    render(){
        const {classes}= this.props
        return(
            <div className={classes.loader}>
                <CircularProgress className={classes.myCustom} />
            </div>
        )
    }
}

Spinner.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Spinner);