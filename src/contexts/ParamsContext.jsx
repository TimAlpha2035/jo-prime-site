import { createContext, useContext, useEffect, useState } from 'react'
import { getParametres } from '../hooks/useSupabaseSite'

const DEFAULTS = {
  telephone: '+224 625 50 50 39',
  whatsapp: '224625505039',
  email: 'joprimeprint@gmail.com',
  adresse: 'Conakry, Guinée',
  horaires: 'Lun–Sam : 8h–18h',
  facebook: '',
  instagram: '',
  afficher_prix: 'true',
}

const ParamsContext = createContext(DEFAULTS)

export function ParamsProvider({ children }) {
  const [params, setParams] = useState(DEFAULTS)

  useEffect(() => {
    getParametres()
      .then(data => setParams({ ...DEFAULTS, ...data }))
      .catch(() => {})
  }, [])

  return <ParamsContext.Provider value={params}>{children}</ParamsContext.Provider>
}

export function useParametresSite() {
  return useContext(ParamsContext)
}
