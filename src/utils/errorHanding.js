export const errorResponse = (error) => {
  let errorResponse = error.response;
  if (errorResponse && errorResponse.data) {
    if (Array.isArray(errorResponse.data.message)) {
      return errorResponse.data.message.join(",");
    } else if (errorResponse.data.message) {
      return errorResponse.data.message;
    } else if (errorResponse.data.error) {
      return errorResponse.data.error;
    }
  } else {
    return "Could not process request.";
  }
};
