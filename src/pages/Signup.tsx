import { userUrl } from '@api'
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup'
import { initButtonsSignup } from '@constants/connexion'
import { signupFields } from '@constants/inputFields'
import { useContext, useState } from 'react'
import {
  custom,
  email,
  maxLength,
  minLength,
  object,
  parse,
  regex,
  string,
} from 'valibot'
import { LoginFields } from '../components/Auth/LoginFields'
import { ButtonInformation } from '../components/Global/ButtonInformation'
import { useNavigate } from 'react-router-dom'
import { isMFSContext } from '@utils/context/isMFSContext'

const SignupSchema = object(
  {
    username: string("Le nom d'utilisateur est invalide.", [
      custom(
        (username) => !username.includes('@'),
        "Le nom d'utilisateur ne doit pas contenir '@'.",
      ),
    ]),
    email: string('Adresse email valide', [email('Adresse email invalide.')]),
    password: string('Le mot de passe est invalide.', [
      minLength(8, 'Le mot de passe doit contenir au moins 8 charactères.'),
      maxLength(128, 'Le mot de passe doit contenir au plus 128 charactères.'),
      regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre.'),
      regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir un charactère spécial.'),
      regex(
        /[^A-Za-z0-9$!%*+-?&#_=.,:;@]{8,128}/,
        'Les charactères spéciaux autorisés sont $!%*+-?&#_=.,:;@',
      ),
    ]),
    confirmationPassword: string(
      'La confirmation du mot de passe doit être une chaîne valide.',
    ),
  },
  [
    custom(
      (data) => data.password === data.confirmationPassword,
      'Les deux mots de passe doivent etre identiques',
    ),
  ],
)
const SignupSchemaMFS = object(
  {
    username: string("Le nom d'utilisateur est invalide.", [
      custom(
        (username) => !username.includes('@'),
        "Le nom d'utilisateur ne doit pas contenir '@'.",
      ),
    ]),
    email: string('Adresse email valide', [email('Adresse email invalide.')]),
    password: string('Le mot de passe est invalide.', [
      minLength(8, 'Le mot de passe doit contenir au moins 8 charactères.'),
      maxLength(128, 'Le mot de passe doit contenir au plus 128 charactères.'),
      regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre.'),
      regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir un charactère spécial.'),
      regex(
        /[^A-Za-z0-9$!%*+-?&#_=.,:;@]{8,128}/,
        'Les charactères spéciaux autorisés sont $!%*+-?&#_=.,:;@',
      ),
    ]),
    confirmationPassword: string(
      'La confirmation du mot de passe doit être une chaîne valide.',
    ),
  },
  [
    custom(
      (data) => data.password === data.confirmationPassword,
      'Les deux mots de passe doivent etre identiques',
    ),
  ],
)
export function Signup({ authFailed, setAuthFailed, userAuth, setUserAuth }) {
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [errorMesage, setErrorMessage] = useState('')
  const [selectedMFS, setSelectedMFS] = useState('')
  const [selectedMatricule, setSelectedMatricule] = useState('')
  const [sent, setSent] = useState(false)
  const isMFS = useContext(isMFSContext)

  const navigate = useNavigate()
  const handleChange = (e) => {
    e.preventDefault()

    if (e.target.name === 'username')
      setUserAuth({
        ...userAuth,
        username: e.target.value,
      })
    else if (e.target.name === 'passwordSignup') setPassword(e.target.value)
    else if (e.target.name === 'confirmationPassword') setConfPassword(e.target.value)
    else if (e.target.name === 'email')
      setUserAuth({
        ...userAuth,
        email: e.target.value,
      })
  }

  const handleValidatePassword = (auth) => {
    return (
      userAuth.username &&
      userAuth.username.length &&
      userAuth.email.length &&
      userAuth.email.includes('@') &&
      password.length &&
      confPassword === password
    )
  }

  const handleClick = async () => {
    const data = isMFS
      ? {
          username: userAuth.username,
          email: userAuth.email,
          password: password,
          organization: selectedMFS,
          matricule: selectedMatricule,
        }
      : {
          username: userAuth.username,
          email: userAuth.email,
          password: password,
        }
    try {
      parse(isMFS ? SignupSchemaMFS : SignupSchema, {
        ...data,
        confirmationPassword: confPassword,
      })
    } catch (error) {
      console.error('Validation error:', error)
      setErrorMessage(error.message)
      setAuthFailed(true)
      return
    }

    try {
      const res = await useFetch(userUrl, 'POST', {
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.success) {
        switch (res.error.details.detail) {
          case 'Username already exists':
            setErrorMessage("Nom d'utilisateur déjà utilisé")
            break
          case 'Email already exists':
            setErrorMessage('Email déjà utilisé')
            break
          default:
            setErrorMessage('Une erreur est survenue')
            break
        }
        setAuthFailed(true)
      } else {
        setSent(true)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setAuthFailed(true)
    }
  }

  return (
    <div className="fr-container">
      <div className="fr-grid-row fr-mt-4w cursor-pointer" onClick={() => navigate(-1)}>
        <span className="fr-icon-arrow-go-back-fill fr-text-title--blue-france fr-mr-2v" />
        <p>Retour</p>
      </div>
      <div className="fr-grid-row">
        <div className="fr-col fr-col-md-6 fr-mt-1w">
          <h1 className="fr-text-title--blue-france fr-mt-5w fr-mb-2w">
            Créer votre compte
          </h1>
          <p className="fr-mb-4w">
            Créer votre compte en quelques instant pour utiliser Albert
            {isMFS ? ' France services' : ''}.
          </p>
          {!sent && (
            <div>
              <LoginFields
                fields={signupFields}
                handleChange={handleChange}
                selectedValue={selectedMFS}
                setSelectedValue={setSelectedMFS}
                matricule={selectedMatricule}
                setMatricule={setSelectedMatricule}
                handleSubmit={handleClick}
              />
              {authFailed && <ButtonInformation>{errorMesage}</ButtonInformation>}
              <ButtonsGroup
                buttons={initButtonsSignup(
                  handleValidatePassword,
                  handleClick,
                  'Créer un compte',
                )}
              />
            </div>
          )}
          {sent && (
            <div className="fr-container fr-grid-row fr-pb-5w">
              <span
                className="fr-icon-success-line fr-text-default--success flex flex-row gap-2"
                aria-hidden="true"
              >
                Votre compte a bien été créé. Il va être activé par un administrateur dans
                les plus brefs délais. Vous recevrez une confirmation de l’activation à
                l’adresse email que vous avez renseignée.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const useFetch = async (url, method, props) => {
  const { data, headers } = props
  try {
    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers,
      body: data === undefined ? null : data,
    })

    if (!response.ok) {
      // Parsing the response body to access detailed information
      const errorDetails = await response.json()
      return {
        success: false,
        error: {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
        },
      }
    }

    const responseData = url.includes('start') ? response : await response.json()
    return {
      success: true,
      data: responseData,
    }
  } catch (error) {
    console.error('An error occurred: ', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    }
  }
}
