import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sage_secret_key';

export interface AuthRequest extends Request {
  userId?: number;
  userPerfil?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; perfil: string };
    req.userId = payload.id;
    req.userPerfil = payload.perfil;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export const requireGestor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userPerfil !== 'gestor') return res.status(403).json({ message: 'Acesso restrito a gestores' });
  next();
};
