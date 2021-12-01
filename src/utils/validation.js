export const validateEmail = (value) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value.toString());
}

export const validateMinLength = (value,len) => {
  return value.length >= len;
}

export const validateFullName = (value) => {
  const re = /^([\w]{3,})+\s+([\w\s]{3,})+$/;
  return re.test(value.toString());
}
