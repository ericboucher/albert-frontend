import { userUrl } from '@api'
import { InitialUserAuth, type UserAuth } from '@utils/auth'
import { isMFSContext } from '@utils/context/isMFSContext'
import { checkConnexion } from '@utils/localStorage'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Error404 from '../../pages/404'
import { Chatbot } from '../../pages/Chatbot'
import { Contact } from '../../pages/Contact'
import { FAQ } from '../../pages/FAQ'
import { History } from '../../pages/History'
import { Login } from '../../pages/Login'
import { Meeting } from '../../pages/Meeting'
import { NewPassword } from '../../pages/NewPassword'
import { ResetPassword } from '../../pages/ResetPassword'
import { Signup } from '../../pages/Signup'
import { Tools } from '../../pages/Tools'
import Footer from './Footer'
import Header from './Header'

export const Root = () => {
  const [userAuth, setUserAuth] = useState<UserAuth>(InitialUserAuth)
  const [authFailed, setAuthFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMFS = useContext(isMFSContext)
  const location = useLocation()
  const meetingPathRegex = /^\/meeting(\/.*)?$/
  useEffect(() => {
    checkConnexion(setUserAuth, userUrl).finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="h-screen w-screen flex-col justify-between" id="screen">
      <Header username={userAuth.username} setUserAuth={setUserAuth} />
      <Routes>
        <Route
          path="/login"
          element={
            !userAuth.isLogin ? (
              <Login
                authFailed={authFailed}
                setAuthFailed={setAuthFailed}
                setUserAuth={setUserAuth}
              />
            ) : (
              <Navigate to="/meeting" />
            )
          }
        />
        {isMFS ? (
          <Route path="/FAQ" element={<FAQ />} />
        ) : (
          <Route
            path={'/FAQ'}
            element={
              !userAuth.isLogin ? <Navigate to="/login" /> : <Navigate to="/404" />
            }
          />
        )}
        {isMFS && (
          <>
            <Route
              path="/meeting"
              element={!userAuth.isLogin ? <Navigate to="/login" /> : <Meeting />}
            />
            <Route
              path="/meeting/:id"
              element={!userAuth.isLogin ? <Navigate to="/login" /> : <Meeting />}
            />
            <Route
              path="/outils"
              element={!userAuth.isLogin ? <Navigate to="/login" /> : <Tools />}
            />
          </>
        )}
        <Route
          path="/meeting"
          element={!userAuth.isLogin ? <Navigate to="/login" /> : <Meeting />}
        />
        <Route
          path="/history"
          element={!userAuth.isLogin ? <Navigate to="/login" /> : <History />}
        />
        <Route
          path="/"
          element={
            !userAuth.isLogin ? <Navigate to="/login" /> : <Navigate to="/meeting" />
          }
        />
        <Route path="/404" element={<Error404 />} />
        {!isMFS ? (
          <Route
            path="/chat"
            element={!userAuth.isLogin ? <Navigate to="/login" /> : <Chatbot />}
          />
        ) : (
          <Route
            path={'/chat'}
            element={
              !userAuth.isLogin ? <Navigate to="/login" /> : <Navigate to="/404" />
            }
          />
        )}
        <Route
          path="/contact"
          element={
            !userAuth.isLogin ? (
              <Navigate to="/login" />
            ) : (
              <Contact setUserAuth={setUserAuth} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              authFailed={authFailed}
              setAuthFailed={setAuthFailed}
              userAuth={userAuth}
              setUserAuth={setUserAuth}
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPassword
              setAuthFailed={setAuthFailed}
              userAuth={userAuth}
              setUserAuth={setUserAuth}
            />
          }
        />
        <Route
          path="/new-password"
          element={<NewPassword authFailed={authFailed} setAuthFailed={setAuthFailed} />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
      {!meetingPathRegex.test(location.pathname) &&
        location.pathname !== '/chat' &&
        location.pathname !== '/' && <Footer />}{' '}
    </div>
  )
}
