import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import logo from '../../assets/login/aqua-university.svg';
import campus from '../../assets/login/campus.png';
import './login.css';

export function LoginPage() {
  const [signingIn, setSigningIn] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Log in · Aqua University';
    return () => {
      window.clearTimeout(timer.current);
      document.title = previousTitle;
    };
  }, []);

  function signIn() {
    if (signingIn) return;
    setSigningIn(true);
    // Local demonstration only: no credentials, authentication, or network request.
    timer.current = window.setTimeout(() => { window.location.hash = '/connecting'; }, 700);
  }

  return <main className="login-page">
    <img className="login-campus" src={campus} alt="" />
    <section className="login-panel" aria-labelledby="login-heading">
      <img className="login-logo" src={logo} alt="Aqua University" width="205" height="79" />
      <h1 id="login-heading">Log in to AI portal</h1>
      <Button className="login-submit" variant="default" onClick={signIn} disabled={signingIn}
        aria-busy={signingIn}>
        <svg className="login-microsoft" width="21" height="21" viewBox="0 0 21 21" aria-hidden="true">
          <path fill="#f25022" d="M0 0h10v10H0z" />
          <path fill="#7fba00" d="M11 0h10v10H11z" />
          <path fill="#00a4ef" d="M0 11h10v10H0z" />
          <path fill="#ffb900" d="M11 11h10v10H11z" />
        </svg>
        {signingIn ? 'Opening demo…' : 'Sign in with Microsoft'}
      </Button>
    </section>
  </main>;
}
