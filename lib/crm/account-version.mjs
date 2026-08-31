export const MIN_ACCOUNT_VERSION=1;
export const MAX_ACCOUNT_VERSION=Number.MAX_SAFE_INTEGER-1;
export const ACCOUNT_VERSION_INVALID="ACCOUNT_VERSION_INVALID";

export class AccountVersionError extends Error{
  constructor(){super("version de compte invalide");this.name="AccountVersionError";this.code=ACCOUNT_VERSION_INVALID;}
}

export function validateAccountVersion(value){if(!Number.isSafeInteger(value)||value<MIN_ACCOUNT_VERSION||value>MAX_ACCOUNT_VERSION)throw new AccountVersionError();return value;}
export function nextAccountVersion(value){const current=validateAccountVersion(value);if(current>=MAX_ACCOUNT_VERSION)throw new AccountVersionError();return current+1;}
