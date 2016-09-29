export interface User {
    id: string;
    email: string;
    displayName: string;
    allow: Lookup<boolean>;
}
