import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { adminCall } from '../hooks/useSupabaseSite'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Le mot de passe est vérifié côté serveur (secret ADMIN_KEY)
      await adminCall('login', {}, password)
      sessionStorage.setItem('admin_auth', 'true')
      sessionStorage.setItem('admin_key', password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const unauthorized = /autoris/i.test(err.message)
      setError(unauthorized
        ? 'Mot de passe incorrect. Veuillez réessayer.'
        : 'Connexion impossible pour le moment. Réessayez dans un instant.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-jp-graphite flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-nunito font-black text-jp-blue text-3xl">JO</span>
          <span className="font-nunito font-black text-jp-cyan text-3xl"> PRIME</span>
          <span className="font-nunito font-semibold text-jp-blue2 text-3xl"> Print</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-jp-blue flex items-center justify-center mb-3 shadow-lg">
              <Lock size={26} className="text-white" />
            </div>
            <h1 className="font-nunito font-bold text-xl text-jp-graphite">Espace Administration</h1>
            <p className="font-nunito text-jp-gray2 text-sm mt-1">Accès réservé au personnel autorisé</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 pr-11 font-nunito text-sm focus:outline-none focus:border-jp-blue transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-jp-gray2 hover:text-jp-graphite transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-nunito text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-jp-blue text-white font-nunito font-bold rounded-xl py-3 hover:bg-jp-blue2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center font-nunito text-white/30 text-xs mt-6">
          JO Prime Print — Panel Administration 2026
        </p>
      </div>
    </div>
  )
}
