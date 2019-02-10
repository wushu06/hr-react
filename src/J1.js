import React from 'react';
import {Link} from 'react-router-dom'
import {Button,AppBar,Toolbar, List, Typography,IconButton,  InputBase, Grid} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios'


const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
});

let div = '';
let count = 0
let num = 6;
class J1 extends React.Component {
    state = {
        posts: [],
        postName: [],
        loading: false,
        store_category: [],
        type: [],
        terms: [],
        search: '',
        result: [],
        taxResult: [],
        termName: [],
        acf: {},
        category: [],
        categories: [],
        locations: [],
        count: '',
        showMe : true,
        num: 0,
        data: []
    }

    componentDidMount() {
        let documentURL = "http://phpstack-214959-744649.cloudwaysapps.com/document.php";
        let categoryURL =  "http://phpstack-214959-744649.cloudwaysapps.com/category.php";
        let categoriesURL =  "http://phpstack-214959-744649.cloudwaysapps.com/categories.php";
        let locationURL =  "http://phpstack-214959-744649.cloudwaysapps.com/location.php";
        let searchURL =  "http://phpstack-214959-744649.cloudwaysapps.com/json.php";

        let acfURL = 'http://wordpress-222461-676549.cloudwaysapps.com/wp-json/acf/v3/wpsl_stores'

       let doc =  axios.get(documentURL);
        let cat = axios.get(categoryURL);
        let caties = axios.get(categoriesURL);
        let all = []


        Promise.all([doc, cat, caties])
            .then(res => {

                this.setState({data: res}, ()=>console.log(res))
            })
        /*fetch(categoryURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    category: res,
                    loading: true

                })

            })
        fetch(categoriesURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    categories: res,


                })

            })*/
        /*fetch(searchURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Bad response");
                }
                return response.json();
            })
            .then(data =>   this.setState({
                locations: data,

                    })
            )
            .catch(error => console.error(error));*/
      /*    .then(()=> {
              fetch( locationURL)
                  .then(res => res.json())
                  .then(res => {
                      this.setState({
                          locations: res,

                      })

                  })
          })*/
            /*
          .then(()=> {
              fetch(documentURL)
                  .then(res => res.json())
                  .then(res => {
                      this.setState({
                          posts: res,

                      })

                  })
          })*/





    }



    handleChange = event => {

        this.setState({search: event.target.value})



    }

    manualSearch = () => {
        if (this.searchTerm(this.state.search, this.state.postName).length > 0) {
            this.setState({result: this.searchTerm(this.state.search, this.state.posts)})

        }
    }

    searchTerm = (val, obj) => {

       let arr = [];
        const regex = new RegExp(val, "gi");
        let result = []



         this.state.data.forEach((item, index) => {

             item.data.forEach(cat => {
                console.log(cat.name);

            if ((cat.name && cat.name.match(regex))) {

               // if(arr.indexOf(item) === -1) {
                    console.log(cat.parent_category_idp );


                      result.push({
                          id : item.id,
                          loc_title: item.location_title,
                          img: item.file_name,
                          name: item.name + ' > ' + item.parent_category_path_names,
                          mime: item.mime,
                          category_name: item.category_name

                      })
                 // }



            }
             })
        });


        return result

    }


    showMore =  () => {
        this.setState({showMe: false})


    }

    displayResult = (result, num = 6) => {
        console.log(result);
        return  result.length > 0 && result.map((name, i)=> {
            if(i > 6) {
                count = i - 6;
            }else {
                count = i
            }



            while(i < num) {

                let path = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img
                return  (<div className="result_list">

                    <img width="290" src={path}/>
                    <h4>Image tag: {name.name} {name.id}</h4>
                    <h4>Category: {name.category_name}</h4>
                    <h4>Location: {name.loc_title}</h4>
                </div>)
            }


        })
    }

    displayTaxResult = (result) => {

        return  result.map(name=> (
            <div>

                <Link to={'/post/'}> <h4>{name}</h4></Link>
            </div>

        ))
    }
    render() {
        const {search, result, taxResult, loading} = this.state
        const { classes } = this.props;
        if( result.length > 0 ) {
            div = this.displayResult(result)





        }else if(this.state.posts.length > 0){
            div = ''
        }else{
            div = ''
        }
        if(!this.state.showMe ) {
            num += 6
            div =  this.displayResult(result, num)
        }
        return (
            <div>

                <div className="container_wrapper">
                    <AppBar position="static">
                        <Toolbar>


                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    onChange={this.handleChange}
                                    name="search"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                                <Button onClick={()=> this.manualSearch()}>Search</Button>

                            </div>

                        </Toolbar>
                    </AppBar>

                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <List className="result">
                                {div}
                            </List>
                            <div className="show_more">
                                {(count > 0 && num <= count ) ? <Button variant="contained" color="primary"  onClick={()=>this.showMore()}>See  <span className="number"> {count - num} </span>more  </Button> : '' }

                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            {taxResult.length > 0 && this.displayTaxResult(taxResult)}
                        </Grid>


                    </Grid>
                </div>




            </div>
        )
    }
}

J1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(J1);