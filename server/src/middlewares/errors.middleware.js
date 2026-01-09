const { errorHandler } = require("../helpers");

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  console.error("Error Details:", error);

  if (error.code) {
    switch (error.code) {
      case "P2000": // Value too long for column
        error = new errorHandler(
          `The provided value is too long for the column: ${error.meta?.column_name}`,
          400 // Bad Request
        );
        break;

      case "P2001": // Record not found
        error = new errorHandler(
          `The record for the query on ${error.meta?.model_name} was not found.`,
          404 // Not Found
        );
        break;

      case "P2002": // Unique constraint failed
        const duplicateKeyMessage = `Duplicate value for field(s): ${error.meta?.target?.join(", ")}`;
        error = new errorHandler(duplicateKeyMessage, 409); // Conflict
        break;

      case "P2003": // Foreign key constraint failed
        error = new errorHandler("Foreign key constraint failed", 400); // Bad Request
        break;

      case "P2004": // Constraint violation
        error = new errorHandler("A constraint violation occurred", 400); // Bad Request
        break;

      case "P2005": // Invalid value
        error = new errorHandler(
          `Invalid value provided for field: ${error.meta?.field_name}`,
          422 // Unprocessable Entity
        );
        break;

      case "P2006": // Invalid data type
        error = new errorHandler(
          `Invalid data type for field: ${error.meta?.field_name}`,
          422 // Unprocessable Entity
        );
        break;

      case "P2007": // Data validation error
        error = new errorHandler("Data validation error occurred", 422); // Unprocessable Entity
        break;

      case "P2008": // Query parsing error
        error = new errorHandler("Failed to parse the query", 400); // Bad Request
        break;

      case "P2009": // Query validation error
        error = new errorHandler("Query validation error occurred", 400); // Bad Request
        break;

      case "P2010": // Raw query error
        error = new errorHandler("Raw query execution error", 500); // Internal Server Error
        break;

      case "P2011": // Null constraint violation
        error = new errorHandler(
          `Null constraint violation on field: ${error.meta?.field_name}`,
          400 // Bad Request
        );
        break;

      case "P2012": // Missing required value
        error = new errorHandler(
          `Missing required value for field: ${error.meta?.field_name}`,
          400 // Bad Request
        );
        break;

      case "P2013": // Missing connection string
        error = new errorHandler("Missing database connection string", 500); // Internal Server Error
        break;

      case "P2014": // Nested mutation error
        error = new errorHandler("Nested mutation error occurred", 400); // Bad Request
        break;

      case "P2015": // Related record not found
        error = new errorHandler("A related record could not be found", 404); // Not Found
        break;

      case "P2016": // Query interpretation error
        error = new errorHandler("Query interpretation error occurred", 400); // Bad Request
        break;

      case "P2017": // Incorrect result size
        error = new errorHandler(
          "The query returned an unexpected number of results",
          400
        ); // Bad Request
        break;

      case "P2018": // Required connected records not found
        error = new errorHandler("Required connected records not found", 400); // Bad Request
        break;

      case "P2019": // Input error
        error = new errorHandler("Input error occurred", 400); // Bad Request
        break;

      case "P2020": // Value out of range
        error = new errorHandler("Value out of range for the column", 400); // Bad Request
        break;

      case "P2021": // Table not found
        error = new errorHandler(
          `The table ${error.meta?.table} was not found`,
          404
        ); // Not Found
        break;

      case "P2022": // Column not found
        error = new errorHandler(
          `The column ${error.meta?.column_name} was not found`,
          404 // Not Found
        );
        break;

      case "P2023": // Inconsistent database state
        error = new errorHandler("Inconsistent database state detected", 500); // Internal Server Error
        break;

      case "P2024": // Timeout error
        error = new errorHandler("Database request timed out", 504); // Gateway Timeout
        break;

      case "P2025": // Record not found
        error = new errorHandler("Record not found", 404); // Not Found
        break;

      case "P2026": // Missing database server
        error = new errorHandler("Database server not found", 503); // Service Unavailable
        break;

      case "P2027": // Invalid JSON
        error = new errorHandler("Invalid JSON input", 400); // Bad Request
        break;

      case "P2028": // Prisma client error
        error = new errorHandler("Prisma Client error occurred", 500); // Internal Server Error
        break;

      case "P2030": // Cannot connect to database
        error = new errorHandler("Cannot connect to the database", 503); // Service Unavailable
        break;

      case "P2031": // Invalid Prisma schema
        error = new errorHandler("Invalid Prisma schema detected", 500); // Internal Server Error
        break;

      case "P2033": // Missing environment variable
        error = new errorHandler(
          `Missing environment variable: ${error.meta?.var_name}`,
          500 // Internal Server Error
        );
        break;

      default:
        error = new errorHandler(`Database error: ${error.message}`, 500);
        break;
    }
  }

  res.status(error.statusCode).json({
    SUCCESS: false,
    MESSAGE: error.message,
  });
};
