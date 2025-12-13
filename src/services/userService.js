const API_BASE = import.meta.env.VITE_API_BASE 

class UserService {
  /**
   * Get the Clerk JWT token for API requests
   * @param {Object} clerkInstance - The Clerk instance from $clerk
   * @returns {Promise<string|null>} The JWT token or null
   */
  async getClerkToken(clerkInstance) {
    if (!clerkInstance?.session) {
      return null
    }
    try {
      const token = await clerkInstance.session.getToken()
      return token
    } catch (error) {
      console.error('❌ Error getting Clerk token:', error)
      return null
    }
  }

  /**
   * Make an authenticated API request with Clerk token
   * @param {string} url - The API endpoint
   * @param {Object} options - Fetch options
   * @param {Object} clerkInstance - The Clerk instance
   * @returns {Promise<Response>} The fetch response
   */
  async authenticatedFetch(url, options = {}, clerkInstance) {
    const token = await this.getClerkToken(clerkInstance)
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return fetch(url, {
      ...options,
      headers
    })
  }

  /**
   * Check if user is authenticated via Clerk
   * @param {Object} clerkInstance - The Clerk instance
   * @returns {boolean} True if authenticated
   */
  isAuthenticated(clerkInstance) {
    return clerkInstance?.user !== null
  }

  /**
   * Get current user from Clerk
   * @param {Object} clerkInstance - The Clerk instance
   * @returns {Object|null} The user object or null
   */
  getUser(clerkInstance) {
    if (!clerkInstance?.user) {
      return null
    }
    
    return {
      id: clerkInstance.user.id,
      email: clerkInstance.user.primaryEmailAddress?.emailAddress,
      name: clerkInstance.user.fullName || clerkInstance.user.firstName || 'User',
      firstName: clerkInstance.user.firstName,
      lastName: clerkInstance.user.lastName,
      imageUrl: clerkInstance.user.imageUrl,
      picture: clerkInstance.user.imageUrl
    }
  }

  /**
   * Sync Clerk user with backend via Google login endpoint
   * @param {Object} clerkInstance - The Clerk instance
   * @returns {Promise<{ token: string, user: Object } | null>} Auth payload or null
   */
  async googleLoginFromClerk(clerkInstance) {
    try {
      if (!API_BASE) return null
      if (!clerkInstance?.user) return null
      const email = clerkInstance.user.primaryEmailAddress?.emailAddress
      const name = clerkInstance.user.fullName || clerkInstance.user.firstName || 'No Name'
      const picture = clerkInstance.user.imageUrl || ''

      const payload = { Name: name, Email: email, Picture: picture }
      const url = `${API_BASE}/api/Auth/google-login`

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ Backend google-login failed:', res.status, text)
        return null
      }

      const data = await res.json()
      if (data?.token && data?.user) {
        try {
          localStorage.setItem('apiAuth', JSON.stringify(data))
        } catch {}
        console.log('✅ Backend user synced:', data.user)
        return data
      }

      return null
    } catch (err) {
      console.error('❌ googleLoginFromClerk error:', err)
      return null
    }
  }
}

export default new UserService()
