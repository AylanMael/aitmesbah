import test from "node:test";
import assert from "node:assert/strict";
import {fileSelectionError,uploadFailureMessage} from "../../lib/crm/upload-feedback.mjs";

test("les formats acceptés et la limite exacte de 25 Mo restent disponibles",()=>{
  for(const name of ["photo.JPG","image.jpeg","image.png","image.webp","archive.PDF"])
    assert.equal(fileSelectionError({name,size:25*1024*1024}),null);
});
test("un fichier vide, trop lourd ou de format non accepté est signalé",()=>{
  assert.match(fileSelectionError({name:"a.pdf",size:0}),/non vide/);
  assert.match(fileSelectionError({name:"a.pdf",size:25*1024*1024+1}),/25 Mo/);
  assert.match(fileSelectionError({name:"a.pdf.exe",size:100}),/Format/);
});
test("doublon, refus d’accès et résultat incertain donnent des conseils distincts",()=>{
  assert.match(uploadFailureMessage(409),/déjà présent/);
  assert.match(uploadFailureMessage(403),/droits/);
  assert.match(uploadFailureMessage(500),/peut-être reçu/);
  assert.match(uploadFailureMessage(0),/Actualisez/);
});
