import {jwtDecode} from 'jwt-decode';


type JwtPayload = {
  user_id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
};

export function getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}