import * as React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
// components
import {Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// service
// context
// notification
import {toast} from 'react-toastify';
import {validateEmail, validatePassword} from "../lib/common";
import {useContext} from "react";
import {UserAuthContext} from "../lib/user-auth-context";


export default function LogInPage() {
    const navigate = useNavigate()
    const {loginUser} = useContext(UserAuthContext)
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onBlur"});

    const onSubmit = ({email, password}) => {
        if (validateEmail(email) && validatePassword(password))
            loginUser({email, password})
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoFocus
                        {...register("email", {required: "Email is required."})}
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register("password", {
                            required: "Password  is required.",
                            minLength: {value: 6, message: 'Password should be at-least of 6 char'}
                        })}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                    />
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to='/signup'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
