 import authService from '../services/authService.js';
 import { HTTP_STATUS } from '../utils/constants.js';

export const register = async (req, result) => {
try {
const result = await authService.register(req.body);

 if (!result.success) {
return result.status(HTTP_STATUS.BAD_REQUEST).json(result);
  }

return result.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
message: 'Erreur lors de l\'enregistrement',
    });
  }
    };

    export const login = async (req, result) => {
  try {
const { email, password } = req.body;

const result = await authService.login(email, password);

 if (!result.success) {
return result.status(HTTP_STATUS.UNAUTHORIZED).json(result);
  }

return result.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
      message: 'Erreur lors de la connexion',
    });
}
    };

      export const logout = (req, result) => {
      try {

return result.status(HTTP_STATUS.OK).json({
success: true,
message: 'Déconnexion réussie',
 });
 } catch (error) {
return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
  success: false,
    message: 'Erreur lors de la déconnexion',
    });
    }
      };

  export const verifyToken = (req, result) => {
    try {
      return result.status(HTTP_STATUS.OK).json({
      success: true,
    user: req.user,
  message: 'Token valide',
});
} catch (error) {
return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
 message: 'Erreur lors de la vérification',
});
  }
    };