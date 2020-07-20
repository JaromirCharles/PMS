import React from 'react'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import TextField from '@material-ui/core/TextField';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    popup: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        marginTop: 100,
        marginLeft: 0,
        right: 0,
        bottom: 0,

    },
    popup_inner: {

        left: '25%',
        right: '25%',
        top: '15%',
        bottom: '5%',
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    root: {
        flexGrow: 1,
        display: "flex",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    textfield: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    buttons: {
        margin: theme.spacing(0.3),

    },
}));



export default function CreateJobPopup() {
    const classes = useStyles();


    return (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>
                <div className={classes.root}>
                    <AppBar position="relative">
                        <Toolbar >
                            <Typography variant="h6" color="inherit">
                                Job Title
                            </Typography>
                            <IconButton>
                                <CancelOutlinedIcon fontSize="large" />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                </div>
                <form className={classes.textfield} noValidate autoComplete="off">
                    <TextField
                        id="outlined-helperText"
                        label="Title"
                        defaultValue="Job title"
                        variant="outlined"
                        size='small'
                    /><br></br>
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        variant="outlined"
                    /><br></br>
                    <TextField
                        id="filled-full-width"
                        label="Description"
                        style={{ margin: 8 }}
                        multiline
                        rows={4}
                        placeholder="Description"
                        helperText="Full width!"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                    /><br></br>
                    <TextField
                        id="outlined-helperText"
                        label="Location"
                        variant="outlined"
                        size='small'
                    /><br></br>
                    <TextField
                        id="outlined-helperText"
                        label="Start & End Time"
                        variant="outlined"
                        size='small'
                    /><br></br>
                    <TextField
                        id="outlined-number"
                        label="# Workers"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size='small'
                    /><br></br>

                    <Button
                        className={classes.textfield}
                        variant="contained"
                        color="default"
                        size="small"
                        startIcon={<AttachFileIcon color="inherit" />}

                    >
                        Attach Files
                    </Button><br></br>
                    <Button className={classes.buttons} variant="contained" color="primary">Save</Button>
                    <Button className={classes.buttons} variant="contained" color="secondary">Cancel</Button>



                </form>
            </div>
        </div>
    )
}
