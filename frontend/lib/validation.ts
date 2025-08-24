export interface ValidationErrors {
  [key: string]: string;
}

export const validateUser = (user: {
  name: string;
  email: string;
  password?: string;
  role: string;
}, isEditing = false): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!user.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (user.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!user.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.email = 'Email inválido';
  }

  if (!isEditing) {
    if (!user.password) {
      errors.password = 'Senha é obrigatória';
    } else if (user.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
  }

  if (!user.role) {
    errors.role = 'Role é obrigatório';
  }

  return errors;
};

export const validateClientEdit = (client: {
  name: string;
  email: string;
  contact: string;
  address: {
    street: string;
    neighborhood: string;
    number: string;
    state: string;
  };
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!client.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (client.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!client.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
    errors.email = 'Email inválido';
  }

  if (!client.contact.trim()) {
    errors.contact = 'Contato é obrigatório';
  }

  if (!client.address.street.trim()) {
    errors.street = 'Rua é obrigatória';
  }

  if (!client.address.number.trim()) {
    errors.number = 'Número é obrigatório';
  }

  if (!client.address.neighborhood.trim()) {
    errors.neighborhood = 'Bairro é obrigatório';
  }

  if (!client.address.state.trim()) {
    errors.state = 'Estado é obrigatório';
  }

  return errors;
};

export const validateClient = (client: {
  name: string;
  email: string;
  contact: string;
  address: {
    street: string;
    neighborhood: string;
    number: string;
    state: string;
  };
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!client.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (client.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!client.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
    errors.email = 'Email inválido';
  }

  if (!client.contact.trim()) {
    errors.contact = 'Contato é obrigatório';
  }

  if (!client.address.street.trim()) {
    errors.street = 'Rua é obrigatória';
  }

  if (!client.address.number.trim()) {
    errors.number = 'Número é obrigatório';
  }

  if (!client.address.neighborhood.trim()) {
    errors.neighborhood = 'Bairro é obrigatório';
  }

  if (!client.address.state.trim()) {
    errors.state = 'Estado é obrigatório';
  }

  return errors;
};
