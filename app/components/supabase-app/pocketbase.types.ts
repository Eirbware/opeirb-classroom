import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface Chapter {
  id: string;
  uri: string;
  xp: number;
}

interface Validation {
  id: string;
  chapter: string;
  user: string;
}

interface RankedUser {
  id: string;
  total_xp: number;
}

interface ExpandedValidation extends Omit<Validation, "chapter"> {
  chapter: Chapter;
}

interface OCPocketBase extends PocketBase {
  collection(idOrName: string): RecordService;
  collection(idOrName: 'users'): RecordService<User>;
  collection(idOrName: 'chapters'): RecordService<Chapter>;
  collection(idOrName: 'validate'): RecordService<Validation>;
  collection(idOrName: 'ranked'): RecordService<RankedUser>;
}

export type { User, Chapter, Validation, RankedUser, OCPocketBase, ExpandedValidation };
