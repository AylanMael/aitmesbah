"use client";

import {createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject} from "react";

export type DraftFields = {
  title: string;
  summary: string;
  body: string;
  category: string;
  sensitivity: string;
};
type DraftWorkspaceValue = {
  draft: DraftFields | null;
  remember: (draft: DraftFields) => void;
  clear: () => void;
  creationPending: RefObject<boolean>;
  creationAttemptRef: RefObject<{key:string;body:Record<string,unknown>} | null>;
  retrying: boolean;
  setRetrying: (value:boolean) => void;
  saving: boolean;
  setSaving: (value: boolean) => void;
};
const DraftContext = createContext<DraftWorkspaceValue | null>(null);

// Monté dans le layout CRM, avec une clé propre à l'utilisateur. Aucune
// persistance sur disque : le brouillon disparaît en quittant ce layout.
export default function DraftWorkspace({children}: {children: ReactNode}) {
  const [draft, setDraft] = useState<DraftFields | null>(null);
  const creationPending = useRef(false);
  const creationAttemptRef = useRef<{key:string;body:Record<string,unknown>} | null>(null);
  const [retrying,setRetrying] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!draft) return;
    const warn = (event: BeforeUnloadEvent) => {event.preventDefault(); event.returnValue="";};
    const guardLink = (event: MouseEvent) => {
      if(event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      const link=event.target instanceof Element?event.target.closest("a[href]"):null;
      if(!(link instanceof HTMLAnchorElement) || link.download || (link.target && link.target!=="_self"))return;
      const url=new URL(link.href,window.location.href);
      if(url.origin===window.location.origin && (url.pathname==="/crm" || url.pathname.startsWith("/crm/")))return;
      if(!window.confirm("Votre saisie n’est pas enregistrée. Quitter le CRM effacera cette copie temporaire. Continuer ?")){
        event.preventDefault();event.stopImmediatePropagation();
      }
    };
    window.addEventListener("beforeunload",warn);
    document.addEventListener("click",guardLink,true);
    return()=>{window.removeEventListener("beforeunload",warn);document.removeEventListener("click",guardLink,true);};
  },[draft]);
  function clear() {setDraft(null);creationPending.current=false;creationAttemptRef.current=null;setRetrying(false);setSaving(false);}
  return <DraftContext.Provider value={{draft, remember: setDraft, clear, creationPending, creationAttemptRef, retrying, setRetrying, saving, setSaving}}>{children}</DraftContext.Provider>;
}

export function useDraftWorkspace() {
  const workspace = useContext(DraftContext);
  if (!workspace) throw new Error("Le formulaire doit être ouvert dans l’espace CRM.");
  return workspace;
}
