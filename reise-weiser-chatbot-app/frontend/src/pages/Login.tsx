import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import {
    AuthCard,
    ErrorBanner,
    Field,
    Form,
    Input,
    SubmitButton,
    SwitchText,
} from '../components/AuthFormStyles';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <AuthCard>
            <h1>Welcome back!</h1>
            <p>Sign in to continue.</p>

            {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

            <Form
                onSubmit={async (event) => {
                    event.preventDefault();
                    setError(null);
                    setIsSubmitting(true);
                    try {
                        await login({ email: email.trim(), password });
                        navigate('/chat', { replace: true });
                    } catch (err) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : 'Unable to sign in. Please try again.',
                        );
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
            >
                <Field>
                    <label htmlFor="login-email">Email</label>
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={50}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Field>

                <Field>
                    <label htmlFor="login-password">Password</label>
                    <Input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        maxLength={72}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Field>

                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </SubmitButton>
            </Form>

            <SwitchText>
                Don&apos;t have an account? <Link to="/register">Register</Link>
            </SwitchText>
        </AuthCard>
    );
}
