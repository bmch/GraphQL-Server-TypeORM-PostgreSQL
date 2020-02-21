import { verifyToken } from '../utils/authToken';

export const authenticateUser = (req: any, res: any, next: any) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken = verifyToken(token);
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.currentUser = decodedToken.userId;
  next();
};
