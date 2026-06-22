import { AppShell } from '../components/layout/AppShell'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center flex-1 py-xl">
        <div className="w-full max-w-96">
          <RegisterForm />
        </div>
      </div>
    </AppShell>
  )
}
