import assert from "node:assert/strict";
import test from "node:test";
import { ACCOUNT_VERSION_INVALID,MAX_ACCOUNT_VERSION,nextAccountVersion,validateAccountVersion } from "../../lib/crm/account-version.mjs";

test("validateur accepte exactement les versions de compte bornées",()=>{for(const value of [1,2,123_456,MAX_ACCOUNT_VERSION])assert.equal(validateAccountVersion(value),value);});
test("validateur refuse types, valeurs absentes et bornes interdites",()=>{for(const value of [undefined,null,false,"1",0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER+1,{valueOf:()=>1},{toString:()=>"1"}])assert.throws(()=>validateAccountVersion(value),error=>error.code===ACCOUNT_VERSION_INVALID&&error.message==="version de compte invalide");});
test("incrément est exact, pur et sans valeur par défaut",()=>{const input=41;assert.equal(nextAccountVersion(input),42);assert.equal(input,41);assert.equal(nextAccountVersion(MAX_ACCOUNT_VERSION-1),MAX_ACCOUNT_VERSION);for(const value of [undefined,MAX_ACCOUNT_VERSION,Number.MAX_SAFE_INTEGER])assert.throws(()=>nextAccountVersion(value),error=>error.code===ACCOUNT_VERSION_INVALID);});
