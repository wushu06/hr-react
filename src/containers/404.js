import React from 'react';
import Header from './Header';

class Nomatch extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <div className="block_container">
                <h1>404 - Page not found</h1>
                </div>
            </div>
        )
    }
}

export default Nomatch;