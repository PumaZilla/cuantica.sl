import bobbyPortrait from '../assets/team/linkedin/bobby-waist.png?url';
import bobbyAlternate from '../assets/team/linkedin/bobby-hover-v2.webp?url';

const supportingSocials = {
  instagram:'https://www.instagram.com/santivieito/',
  linkedin:'https://www.linkedin.com/in/santiago-vieito-696360120/',
};
export const supportingCast = [
  { name:'Antonio', ...supportingSocials, role:'Mantenimiento', image:null, alternateImage:null },
  { name:'Madre de Kike', ...supportingSocials, role:'Madre', image:null, alternateImage:null },
  { name:'Igor', instagram:'', linkedin:'', role:'Gourmet', image:null, alternateImage:null },
  { name:'Pitonisa', ...supportingSocials, role:'Clandestina', image:null, alternateImage:null },
  { name:'Sr. Bioverde', ...supportingSocials, role:'C.A.C.A', image:null, alternateImage:null },
  { name:'Srta. Gerania', instagram:'', linkedin:'', role:'Secretaria', image:null, alternateImage:null },
  { name:'Bobby 2.0', ...supportingSocials, role:'Mascota', image:bobbyPortrait, alternateImage:bobbyAlternate },
];
