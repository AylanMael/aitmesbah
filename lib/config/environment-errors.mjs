export class EnvironmentConfigurationError extends Error {
  constructor(code) {
    super("Configuration d’environnement indisponible");
    this.name = "EnvironmentConfigurationError";
    this.code = code;
  }
}

export function configurationError(code) {
  throw new EnvironmentConfigurationError(code);
}
