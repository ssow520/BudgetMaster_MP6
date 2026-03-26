 import TransactionService from '../services/transactionService.js';
 import { HTTP_STATUS } from '../utils/constants.js';

export const create = (req, answer) => {
try {
const result = TransactionService.create(req.user.userId, req.body);

 if (!result.success) {
return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
  }

return answer.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
message: 'Erreur lors de la création de la transaction',
    });
  }
    };

    export const getAll = (req, answer) => {
  try {
const result = TransactionService.getAll(req.user.userId);

return answer.status(HTTP_STATUS.OK).json(result);
 } catch (error) {
 return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
  message: 'Erreur lors de la récupération des transactions',
    });
}
    };

      export const getIncome = (req, answer) => {
      try {
    const result = TransactionService.getIncome(req.user.userId);

return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
 message: 'Erreur lors de la récupération des revenus',
});
  }
    };

  export const getExpense = (req, answer) => {
    try {
      const result = TransactionService.getExpense(req.user.userId);

    return answer.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
message: 'Erreur lors de la récupération des dépenses',
 });
 }
};

export const update = (req, answer) => {
    try {
  const { id } = req.params;
    const result = TransactionService.update(id, req.user.userId, req.body);

      if (!result.success) {
    return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
  }

return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
 return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
message: 'Erreur lors de la mise à jour de la transaction',
  });
    }
    };

      export const delete_ = (req, answer) => {
    try {
const { id } = req.params;
    const result = TransactionService.delete(id, req.user.userId);

    if (!result.success) {
      return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
      }

  return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
 message: 'Erreur lors de la suppression de la transaction',
 });
}
  };

export const filter = (req, answer) => {
    try {
      const result = TransactionService.filter(req.user.userId, req.query);

return answer.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
  return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
      message: 'Erreur lors du filtrage des transactions',
      });
    }
  };