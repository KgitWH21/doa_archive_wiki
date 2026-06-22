import { AppShell } from '../components/layout/AppShell'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center flex-1 py-xl">
        <div className="w-full max-w-96">
          <LoginForm />
        </div>
      </div>
    </AppShell>
  )
}
