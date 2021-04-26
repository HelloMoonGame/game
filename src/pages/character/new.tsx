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
import { useRouter } from 'next/router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state/store'
import {
  characterSelectors,
  characterOperations,
} from '../../state/ducks/character'
import {
  ApiError,
  CreateCharacterRequest,
} from '../../state/ducks/character/models'
import { unwrapResult } from '@reduxjs/toolkit'

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
    .required('Required')
    .trim()
    .max(32, 'Max. 32 characters')
    .matches(/^[\u00C0-\u017Fa-zA-Z-]+$/, 'Only letters and - is allowed'),
  lastName: yup
    .string()
    .required('Required')
    .trim()
    .max(64, 'Max. 64 characters')
    .matches(
      /^[\u00C0-\u017Fa-zA-Z- ]+$/,
      'Only letters, spaces and - is allowed'
    ),
  sex: yup.string().required('Required').oneOf(['Male', 'Female']),
})

export const Home = (): JSX.Element => {
  const router = useRouter()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
  const myCharacter = useAppSelector(characterSelectors.getMyCharacter)

  if (myCharacter != null) router.push('/')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCharacterRequest>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const [error, setError] = useState('')

  const onSubmit = (data: CreateCharacterRequest) => {
    dispatch(characterOperations.createMyCharacterAsync(data))
      .then(unwrapResult)
      .catch((rejectedValueOrSerializedError: ApiError<any>) => {
        setError(rejectedValueOrSerializedError.errorMessage)
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
                helperText={errors.firstName?.message}
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
                helperText={errors.lastName?.message}
                {...register('lastName')}
              />
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
