import type { Database } from "@/lib/database.types";
type GR = { foreignKeyName: string; columns: string[]; isOneToOne?: boolean; referencedRelation: string; referencedColumns: string[] };
type GT = { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: GR[] };
type GS = { Tables: Record<string, GT>; Views: Record<string, any>; Functions: Record<string, any> };
type Check = Database["public"] extends GS ? true : false;
const c: Check = true;
type T2 = Database["public"]["Tables"]["files"] extends GT ? true : false;
const d: T2 = true;
