const { body, validationResult } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('username').trim().not().isEmpty().withMessage('Username is required.'),
    body('password').not().isEmpty().withMessage('password is required.'),
  ]
}

const addContactValidationRules = () => {
  return [
    body('firstName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('First Name should not be less than 3 characters.')
      //.isAlpha().withMessage('First Name should only be alphabetic.'),
      .matches(/^([A-Z' ]+)(?:[A-Z])$/i).withMessage('First Name should only be alphabetic.'),
    body('lastName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('Last Name should not be less than 3 characters.')
      .isAlpha().withMessage('Last Name should only be alphabetic.'),
    body('address').trim().not().isEmpty().withMessage('Address is required.'),
    body('areaCode').trim().isNumeric().withMessage('Area code should only be a number')
      .isLength({ min: 5, max: 5 }).withMessage('Area code should be 5 numbers'),
    body('prefix').trim().isNumeric().withMessage('Prefix code should only be a number')
      .isLength({ min: 3, max: 3 }).withMessage('Prefix code should be 3 numbers'),
    body('lineNumber').trim().isNumeric().withMessage('Line number should only be a number')
      .isLength({ min: 4, max: 4 }).withMessage('Line number should be 4 numbers'),
    body('photoUrl').custom((value) => {  
                                          if( value.extension != 'jpeg' | 'jpg' | 'gif') 
                                            { return Promise.reject('pdf not supported') }
                                          else
                                            return true  
                                       }) 
    //body('photoUrl').isLength({ min: 3 }).withMessage('photo url should not be less than 3 characters'),
    //body('photoUrl').notEmpty().withMessage('You must enter a photo'),
  ]
}

const addUserValidationRules = () => {
  return [
    body('username').trim().not().isEmpty().withMessage('username is required.')
      .isLength({ min: 6 }).withMessage('Username should not be less than 6 characters.')
      //.isAlpha().withMessage('First Name should only be alphabetic.'),
      .matches(/^(?=.*[A-Za-z])[A-Za-z]{6,29}$/, "i").withMessage('username should only be alphabetic and 6-30 charater long.'),
    body('admin').trim().isBoolean().withMessage('Admin value is required (True or False'),  
    body('password').trim().not().isEmpty().withMessage('password is required.')
      .isLength({ min: 8 })
        .withMessage('Password should not be less than 8 characters.')
      .isLength({ max: 10 })
        .withMessage('Password should not be more than 10 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,10}$/, "i")
        .withMessage('password should be Minimum 8 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character!'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next()
  }
  //console.log(req.body);
  /* const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
   */
  const extractedErrors = {};
  errors.array().map(err => extractedErrors[err.param] = err.msg );
  //console.log('from addUserValidation');
  // console.log(extractedErrors);

  return res.status(422).json({
    error: extractedErrors,
  })
}//  return res.status(422).json({ error: errors.array() });


module.exports = {
  loginValidationRules,
  addContactValidationRules,
  addUserValidationRules,
  validate
}
