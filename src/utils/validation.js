export function validateUserForm(data) {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required.';
  } else if (data.firstName.trim().length < 3) {
    errors.firstName = 'First name must be at least 3 characters.';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (data.lastName.trim().length < 3) {
    errors.lastName = 'Last name must be at least 3 characters.';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.department?.trim()) {
    errors.department = 'Department is required.';
  }

  return errors;
}
