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

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <AuthCard>
            <h1>Create your Account</h1>
            <p>Start planning your next adventure</p>

            {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

            <Form
                onSubmit={async (event) => {
                    event.preventDefault();
                    setError(null);
                    setIsSubmitting(true);
                    try {
                        await register({ name: name.trim(), email: email.trim(), password });
                        navigate('/chat', { replace: true });
                    } catch (err) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : 'Unable to create account. Please try again.',
                        );
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
            >
                <Field>
                    <label htmlFor="register-name">Name</label>
                    <Input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={150}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Field>

                <Field>
                    <label htmlFor="register-email">Email</label>
                    <Input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={50}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Field>

                <Field>
                    <label htmlFor="register-password">Password</label>
                    <Input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={72}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Field>

                <SubmitButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </SubmitButton>
            </Form>

            <SwitchText>
                Already have an account? <Link to="/login">Login</Link>
            </SwitchText>
        </AuthCard>
    );
}
