export function fileSelectionError(file) {
  if (!file || file.size === 0) return "Choisissez un fichier non vide.";
  if (file.size > 25 * 1024 * 1024) return "Ce fichier dépasse 25 Mo. Choisissez une version plus légère en conservant votre original.";
  if (!/\.(jpe?g|png|webp|pdf)$/i.test(file.name)) return "Format non accepté. Choisissez une image JPEG, PNG, WebP ou un document PDF.";
  return null;
}

export function assetLoadFailureMessage(status) {
  if(status===403)return "Vous pouvez voir ce dossier, mais ses originaux sont réservés à son auteur et aux relecteurs affectés disposant des droits nécessaires. Demandez une affectation à un responsable éditorial.";
  if(status===401)return "Votre session a expiré. Reconnectez-vous pour consulter les originaux.";
  return "Les fichiers n’ont pas pu être chargés. Leur présence ne peut pas être déterminée ; réessayez avant d’envoyer un nouvel original.";
}

export function uploadFailureMessage(status) {
  if (status === 409) return "Ce fichier est déjà présent dans ce dossier. Actualisez la liste pour le retrouver ; ne le renvoyez pas.";
  if (status === 413) return "Le fichier ou son transfert dépasse la taille autorisée (25 Mo pour le fichier).";
  if (status === 401 || status === 403) return "Votre session ou vos droits ne permettent pas cet envoi. Vérifiez votre connexion et l’accès à ce dossier.";
  if (status === 400 || status === 415) return "Le serveur a refusé le fichier. Vérifiez son format et qu’il s’ouvre correctement sur votre appareil.";
  if (status === 429) return "Trop de tentatives rapprochées. Patientez avant de réessayer.";
  return "L’envoi n’a pas pu être confirmé. Actualisez les fichiers du dossier avant de réessayer : le serveur a peut-être reçu l’original.";
}
