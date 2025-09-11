const AppError = require("./error");

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw new AppError(400, error.details.map((d) => d.message).join(", "));
  }

  return value; 
};

module.exports = validate;
