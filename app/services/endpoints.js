const apis = {
  patient: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api',
  vtb: import.meta.env.VITE_APP_VTB_URL || '
  .',
  chat: import.meta.env.VITE_APP_CHAT_URL || 'http://localhost:11434/api'
}

export default apis;