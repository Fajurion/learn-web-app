import type { GetSession } from '@sveltejs/kit'
import cookie from 'cookie'

export const getSession: GetSession = ({ request }) => {
    const parsed = cookie.parse(request.headers.get('cookie') || '')

    if (parsed.token) {
        return {
            user: {
                token: parsed.token 
            }
        }
    }

    return {}
}