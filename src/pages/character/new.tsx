import {
  Avatar,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core'
import { PersonAdd } from '@material-ui/icons'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import AuthService from '../../services/AuthService'
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(3),
  },
  fieldset: {
    display: 'flex',
  },
  radiogroup: {
    margin: 'auto',
  },
  radiogroupFormHelperText: {
    textAlign: 'center',
  },
}))

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required()
    .trim()
    .max(32)
    .matches(/^[\u00C0-\u017Fa-zA-Z-]+$/, 'Only letters and - is allowed'),
  lastName: yup
    .string()
    .required()
    .trim()
    .max(64)
    .matches(
      /^[\u00C0-\u017Fa-zA-Z- ]+$/,
      'Only letters, spaces and - is allowed'
    ),
  sex: yup.string().required().oneOf(['Male', 'Female']),
})

export const Home = (): JSX.Element => {
  const router = useRouter()
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const [error, setError] = useState('')

  const onSubmit = (data: any) => {
    const authService = AuthService.getInstance()
    authService.getUserOrLogin().then((user) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/mycharacter`, data, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((_) => {
          router.push('/')
        })
        .catch((e) => {
          // Error 409 Conflict means the user already has a character
          if (e.response.status == 409) router.push('/')

          if (e.message) setError(`${e.message}: ${e.response.statusText}`)
        })
    })
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAdd />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create a character
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="off"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!!errors.firstName}
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="off"
                name="lastName"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                error={!!errors.lastName}
                {...register('lastName')}
              />
              <FormHelperText>{errors.lastName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={!!errors.sex}
                defaultValue=""
                className={classes.fieldset}
              >
                <RadioGroup
                  row
                  aria-label="sex"
                  name="sex"
                  {...register('sex')}
                  className={classes.radiogroup}
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
                <FormHelperText className={classes.radiogroupFormHelperText}>
                  {errors.sex?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormHelperText error={!!error}>{error}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Create character!
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default Home
