import { arCopy } from "./ar";
import { csCopy } from "./cs";
import { deCopy } from "./de";
import { enCopy } from "./en";
import { esCopy } from "./es";
import { frCopy } from "./fr";
import { hiCopy } from "./hi";
import { huCopy } from "./hu";
import { idCopy } from "./id";
import { itCopy } from "./it";
import { jaCopy } from "./ja";
import { koCopy } from "./ko";
import { nlCopy } from "./nl";
import { plCopy } from "./pl";
import { ptBrCopy } from "./pt-br";
import { ruCopy } from "./ru";
import { trCopy } from "./tr";
import { viCopy } from "./vi";
import { zhCnCopy } from "./zh-cn";
import { zhTwCopy } from "./zh-tw";
import type { SupportedLanguage } from "../language";
import type { LocaleCopy } from "../types";

export const localeCopies: Record<SupportedLanguage, LocaleCopy> = {
  "ar": arCopy,
  "cs": csCopy,
  "de": deCopy,
  "en": enCopy,
  "es": esCopy,
  "fr": frCopy,
  "hi": hiCopy,
  "hu": huCopy,
  "id": idCopy,
  "it": itCopy,
  "ja": jaCopy,
  "ko": koCopy,
  "nl": nlCopy,
  "pl": plCopy,
  "pt-br": ptBrCopy,
  "ru": ruCopy,
  "tr": trCopy,
  "vi": viCopy,
  "zh-cn": zhCnCopy,
  "zh-tw": zhTwCopy,
};
