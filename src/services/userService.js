const API_BASE = import.meta.env.VITE_API_BASE 

class UserService {

      async googleLogin(userCredentials) {
      try {
        console.log('🔹 Sending Google user info to backend...', userCredentials)

        const response = await fetch(`${API_BASE}/Auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userCredentials) 
        })

        if (!response.ok) {
          let message = 'Login failed'
          try {
            const errorData = await response.json()
            message = errorData.message || message
          } catch {
          }
          throw new Error(`${message} (status: ${response.status})`)
        }

        const data = await response.json()
        console.log('✅ Login successful:', data)

        if (data.token) localStorage.setItem('token', data.token)
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

        return data
      } catch (error) {
        console.error('❌ Google login error:', error.message)
        throw error
      }
    }


    async checkAuthStatus() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return null
        
        const response = await fetch(`${API_BASE}/Auth/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          return JSON.parse(localStorage.getItem('user'))
        } else {
          this.logout()
          return null
        }
      } catch (error) {
        console.error('❌ Auth check error:', error.message)
        this.logout()
        return null
      }
    }

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve()
  }

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new UserService()
