import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

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
        top: '25%',
        bottom: '25%',
        position: 'absolute',
        backgroundColor: 'rgba(6, 97, 248, 0.8)',
    },
    root: {
        flexGrow: 1,
        display: "flex",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));



export default function JobPopup() {
    const classes = useStyles();


    return (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>
                <div className={classes.root}>
                    <AppBar position="static">
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
            </div>
        </div>
    )
}
