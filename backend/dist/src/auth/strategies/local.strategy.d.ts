import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<Omit<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, "passwordHash">>;
}
export {};
