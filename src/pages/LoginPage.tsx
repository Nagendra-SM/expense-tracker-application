import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { AuthForm } from '../components/AuthForm';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User is logged in, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      const user = await signIn(email, password);
      console.log('Login successful, user:', user);
      // The useEffect will handle the navigation when user state updates
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      const user = await signUp(email, password);
      console.log('Signup successful, user:', user);
      // The useEffect will handle the navigation when user state updates
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <AuthForm 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        loading={isSubmitting} 
      />
    </div>
  );
}
