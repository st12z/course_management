import unidecode from "unidecode";
export const convertSlug=(keyword:string):string=>{
  const unidecodeText=unidecode(keyword.toLowerCase());
  const slug:string=unidecodeText.trim().replace(/\s+/g,"-");
  return slug;
}